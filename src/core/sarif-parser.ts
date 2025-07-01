import fs from 'fs/promises';
import path from 'path';
import { SarifReport, SarifData, Violation, FileViolations } from '../types/sarif.js';
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
  
  // Extract results from the first run
  const results = sarifData.runs[0]?.results || [];
  
  // Group violations by file
  const fileViolations: FileViolations = {};
  
  for (const result of results) {
    const location = result.locations[0];
    if (location && location.physicalLocation) {
      const fileUri = location.physicalLocation.artifactLocation.uri;
      const region = location.physicalLocation.region;
      
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
        fileUri
      };
      
      fileViolations[fileUri].push(violation);
    }
  }
  
  // Attach code snippets to each violation
  await attachCodeSnippets(fileViolations, path.dirname(filePath));
  
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
 * Attach code snippets to violations by reading source files
 */
async function attachCodeSnippets(fileViolations: FileViolations, basePath: string): Promise<void> {
  for (const [fileUri, violations] of Object.entries(fileViolations)) {
    const absPath = path.join(basePath, fileUri);
    let lines: string[] | null = null;
    
    try {
      const content = await fs.readFile(absPath, 'utf8');
      lines = content.split(/\r?\n/);
    } catch {
      // File not found or not readable, skip snippet generation
      lines = null;
    }
    
    for (const violation of violations) {
      if (lines) {
        // Show up to 2 lines before and after, and all lines in the violation region
        const start = Math.max(0, violation.line - 3); // 0-based
        const end = Math.min(lines.length, (violation.endLine || violation.line) + 2);
        
        violation.snippet = lines.slice(start, end).map((line, idx) => {
          const lineNum = start + idx + 1;
          const marker = lineNum === violation.line ? '▶ ' : '  ';
          return `${marker}${lineNum.toString().padStart(4)}: ${line}`;
        }).join('\n');
      } else {
        violation.snippet = '[Source file not found]';
      }
    }
  }
}

/**
 * Calculate statistics from file violations
 */
function calculateStatistics(fileViolations: FileViolations) {
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  
  for (const violations of Object.values(fileViolations)) {
    for (const violation of violations) {
      switch (violation.level) {
        case 'error':
          errorCount++;
          break;
        case 'warning':
          warningCount++;
          break;
        case 'info':
        case 'note':
          infoCount++;
          break;
      }
    }
  }
  
  const totalFiles = Object.keys(fileViolations).length;
  const totalViolations = errorCount + warningCount + infoCount;
  const averageViolationsPerFile = totalFiles > 0 ? Math.round((totalViolations / totalFiles) * 10) / 10 : 0;
  
  return {
    errorCount,
    warningCount,
    infoCount,
    averageViolationsPerFile
  };
} 