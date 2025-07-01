import fs from 'fs/promises';
import path from 'path';
import { SarifReport, SarifData, Violation, FileViolations, SarifArtifact } from '../types/sarif.js';
import { validateSarifFile } from '../utils/validators.js';

/**
 * Parse SARIF file and extract violations grouped by file
 */
export async function parseSarifFile(filePath: string): Promise<SarifData> {
  // Validate the SARIF file first
  await validateSarifFile(filePath);
  
  // Read and parse the SARIF file
  const content = await fs.readFile(filePath, 'utf8');
  const sarifData: SarifReport = JSON.parse(content);
  
  // Process all runs and merge results
  const allResults = [];
  const allArtifacts = new Map<number, SarifArtifact>();
  
  for (const run of sarifData.runs) {
    // Collect artifacts from this run
    if (run.artifacts) {
      run.artifacts.forEach((artifact, index) => {
        allArtifacts.set(index, artifact);
      });
    }
    
    // Collect results from this run
    if (run.results) {
      allResults.push(...run.results);
    }
  }
  
  // Group violations by file
  const fileViolations: FileViolations = {};
  
  for (const result of allResults) {
    const location = result.locations[0];
    if (location && location.physicalLocation) {
      const fileUri = location.physicalLocation.artifactLocation.uri;
      const region = location.physicalLocation.region;
      const artifactIndex = location.physicalLocation.artifactLocation.index;
      
      if (!fileViolations[fileUri]) {
        fileViolations[fileUri] = [];
      }
      
      const violation: Violation = {
        ruleId: result.ruleId,
        level: result.level,
        message: result.message.text,
        line: region.startLine,
        column: region.startColumn || 1,
        endLine: region.endLine,
        endColumn: region.endColumn,
        fileUri,
        artifactIndex
      };
      
      fileViolations[fileUri].push(violation);
    }
  }
  
  // Attach code snippets to each violation
  await attachCodeSnippets(fileViolations, path.dirname(filePath), allArtifacts);
  
  // Calculate statistics
  const files = Object.keys(fileViolations).sort();
  const totalViolations = files.reduce((sum, file) => sum + fileViolations[file].length, 0);
  
  const statistics = calculateStatistics(fileViolations);
  
  return {
    files,
    fileViolations,
    totalViolations,
    statistics
  };
}

/**
 * Attach code snippets to violations by reading source files or using embedded content
 */
async function attachCodeSnippets(
  fileViolations: FileViolations, 
  basePath: string, 
  artifacts: Map<number, SarifArtifact>
): Promise<void> {
  for (const [fileUri, violations] of Object.entries(fileViolations)) {
    let lines: string[] | null = null;
    
    // Try to get content from artifacts first
    for (const violation of violations) {
      if (violation.artifactIndex !== undefined && artifacts.has(violation.artifactIndex)) {
        const artifact = artifacts.get(violation.artifactIndex)!;
        if (artifact.contents?.text) {
          lines = artifact.contents.text.split(/\r?\n/);
          break;
        }
      }
    }
    
    // If no artifact content, try reading from file system
    if (!lines) {
      const absPath = path.join(basePath, fileUri);
      try {
        const content = await fs.readFile(absPath, 'utf8');
        lines = content.split(/\r?\n/);
      } catch {
        // File not found or not readable, skip snippet generation
        lines = null;
      }
    }
    
    for (const violation of violations) {
      if (lines) {
        violation.snippet = generateCodeSnippet(lines, violation);
      } else {
        violation.snippet = '[Source file not found]';
      }
    }
  }
}

/**
 * Generate formatted code snippet for a violation
 */
function generateCodeSnippet(lines: string[], violation: Violation): string {
  // Show up to 3 lines before and after, and all lines in the violation region
  const start = Math.max(0, violation.line - 4); // 0-based
  const end = Math.min(lines.length, (violation.endLine || violation.line) + 3);
  
  return lines.slice(start, end).map((line, idx) => {
    const lineNum = start + idx + 1;
    const isViolationLine = lineNum >= violation.line && 
                           lineNum <= (violation.endLine || violation.line);
    const marker = isViolationLine ? '▶ ' : '  ';
    const lineNumber = lineNum.toString().padStart(4);
    return `${marker}${lineNumber}: ${line}`;
  }).join('\n');
}

/**
 * Calculate comprehensive statistics from file violations
 */
function calculateStatistics(fileViolations: FileViolations) {
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  let noteCount = 0;
  let noneCount = 0;
  
  const ruleIdCounts = new Map<string, number>();
  const fileViolationCounts = new Map<string, number>();
  
  for (const [fileUri, violations] of Object.entries(fileViolations)) {
    fileViolationCounts.set(fileUri, violations.length);
    
    for (const violation of violations) {
      // Count by level
      switch (violation.level) {
        case 'error':
          errorCount++;
          break;
        case 'warning':
          warningCount++;
          break;
        case 'info':
          infoCount++;
          break;
        case 'note':
          noteCount++;
          break;
        case 'none':
          noneCount++;
          break;
      }
      
      // Count by rule ID
      const currentCount = ruleIdCounts.get(violation.ruleId) || 0;
      ruleIdCounts.set(violation.ruleId, currentCount + 1);
    }
  }
  
  const totalFiles = Object.keys(fileViolations).length;
  const totalViolations = errorCount + warningCount + infoCount + noteCount + noneCount;
  const averageViolationsPerFile = totalFiles > 0 ? Math.round((totalViolations / totalFiles) * 10) / 10 : 0;
  
  // Find most common rule violations
  const sortedRules = Array.from(ruleIdCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Find files with most violations
  const sortedFiles = Array.from(fileViolationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return {
    errorCount,
    warningCount,
    infoCount,
    noteCount,
    noneCount,
    averageViolationsPerFile,
    mostCommonRules: sortedRules,
    filesWithMostViolations: sortedFiles,
    totalFiles,
    totalViolations
  };
}

/**
 * Get detailed information about a specific file's violations
 */
export function getFileViolationDetails(fileUri: string, fileViolations: FileViolations) {
  const violations = fileViolations[fileUri] || [];
  
  const levelCounts = {
    error: violations.filter(v => v.level === 'error').length,
    warning: violations.filter(v => v.level === 'warning').length,
    info: violations.filter(v => v.level === 'info').length,
    note: violations.filter(v => v.level === 'note').length,
    none: violations.filter(v => v.level === 'none').length
  };
  
  const ruleCounts = new Map<string, number>();
  violations.forEach(v => {
    const count = ruleCounts.get(v.ruleId) || 0;
    ruleCounts.set(v.ruleId, count + 1);
  });
  
  return {
    totalViolations: violations.length,
    levelCounts,
    ruleCounts: Array.from(ruleCounts.entries()).sort((a, b) => b[1] - a[1]),
    violations
  };
}

/**
 * Filter violations by various criteria
 */
export function filterViolations(
  fileViolations: FileViolations,
  filters: {
    level?: string[];
    ruleId?: string[];
    filePattern?: string;
  }
): FileViolations {
  const filtered: FileViolations = {};
  
  for (const [fileUri, violations] of Object.entries(fileViolations)) {
    // Filter by file pattern
    if (filters.filePattern && !fileUri.includes(filters.filePattern)) {
      continue;
    }
    
    const filteredViolations = violations.filter(violation => {
      // Filter by level
      if (filters.level && filters.level.length > 0 && !filters.level.includes(violation.level)) {
        return false;
      }
      
      // Filter by rule ID
      if (filters.ruleId && filters.ruleId.length > 0 && !filters.ruleId.includes(violation.ruleId)) {
        return false;
      }
      
      return true;
    });
    
    if (filteredViolations.length > 0) {
      filtered[fileUri] = filteredViolations;
    }
  }
  
  return filtered;
} 