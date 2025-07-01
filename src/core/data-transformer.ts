import { SarifData, Violation, FileViolations } from '../types/sarif.js';

/**
 * Transform SARIF data into different views and formats
 */
export class SarifDataTransformer {
  private data: SarifData;

  constructor(data: SarifData) {
    this.data = data;
  }

  /**
   * Get violations grouped by rule ID
   */
  getViolationsByRule(): Map<string, Violation[]> {
    const ruleViolations = new Map<string, Violation[]>();
    
    for (const violations of Object.values(this.data.fileViolations)) {
      for (const violation of violations) {
        if (!ruleViolations.has(violation.ruleId)) {
          ruleViolations.set(violation.ruleId, []);
        }
        ruleViolations.get(violation.ruleId)!.push(violation);
      }
    }
    
    return ruleViolations;
  }

  /**
   * Get violations grouped by severity level
   */
  getViolationsByLevel(): Map<string, Violation[]> {
    const levelViolations = new Map<string, Violation[]>();
    
    for (const violations of Object.values(this.data.fileViolations)) {
      for (const violation of violations) {
        if (!levelViolations.has(violation.level)) {
          levelViolations.set(violation.level, []);
        }
        levelViolations.get(violation.level)!.push(violation);
      }
    }
    
    return levelViolations;
  }

  /**
   * Get files sorted by violation count (descending)
   */
  getFilesByViolationCount(): Array<{ file: string; count: number; violations: Violation[] }> {
    return this.data.files
      .map(file => ({
        file,
        count: this.data.fileViolations[file].length,
        violations: this.data.fileViolations[file]
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get rules sorted by violation count (descending)
   */
  getRulesByViolationCount(): Array<{ ruleId: string; count: number; violations: Violation[] }> {
    const ruleViolations = this.getViolationsByRule();
    return Array.from(ruleViolations.entries())
      .map(([ruleId, violations]) => ({
        ruleId,
        count: violations.length,
        violations
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get summary statistics with additional insights
   */
  getDetailedStatistics() {
    const ruleViolations = this.getViolationsByRule();
    const levelViolations = this.getViolationsByLevel();
    const filesByCount = this.getFilesByViolationCount();
    const rulesByCount = this.getRulesByViolationCount();

    return {
      ...this.data.statistics,
      totalRules: ruleViolations.size,
      filesWithMostViolations: filesByCount.slice(0, 10),
      rulesWithMostViolations: rulesByCount.slice(0, 10),
      levelBreakdown: Object.fromEntries(levelViolations.entries()),
      ruleBreakdown: Object.fromEntries(ruleViolations.entries())
    };
  }

  /**
   * Filter data by various criteria
   */
  filterData(filters: {
    levels?: string[];
    rules?: string[];
    files?: string[];
    minLine?: number;
    maxLine?: number;
  }): SarifData {
    const filteredViolations: FileViolations = {};

    for (const [fileUri, violations] of Object.entries(this.data.fileViolations)) {
      // Filter by file
      if (filters.files && filters.files.length > 0 && !filters.files.includes(fileUri)) {
        continue;
      }

      const filteredFileViolations = violations.filter(violation => {
        // Filter by level
        if (filters.levels && filters.levels.length > 0 && !filters.levels.includes(violation.level)) {
          return false;
        }

        // Filter by rule
        if (filters.rules && filters.rules.length > 0 && !filters.rules.includes(violation.ruleId)) {
          return false;
        }

        // Filter by line range
        if (filters.minLine && violation.line < filters.minLine) {
          return false;
        }
        if (filters.maxLine && violation.line > filters.maxLine) {
          return false;
        }

        return true;
      });

      if (filteredFileViolations.length > 0) {
        filteredViolations[fileUri] = filteredFileViolations;
      }
    }

    const files = Object.keys(filteredViolations).sort();
    const totalViolations = files.reduce((sum, file) => sum + filteredViolations[file].length, 0);

    // Recalculate statistics for filtered data
    const statistics = this.calculateStatistics(filteredViolations);

    return {
      files,
      fileViolations: filteredViolations,
      totalViolations,
      statistics
    };
  }

  /**
   * Get violations in a specific line range
   */
  getViolationsInRange(startLine: number, endLine: number): Violation[] {
    const violations: Violation[] = [];
    
    for (const fileViolations of Object.values(this.data.fileViolations)) {
      for (const violation of fileViolations) {
        if (violation.line >= startLine && violation.line <= endLine) {
          violations.push(violation);
        }
      }
    }
    
    return violations.sort((a, b) => a.line - b.line);
  }

  /**
   * Get violations for a specific file
   */
  getFileViolations(fileUri: string): Violation[] {
    return this.data.fileViolations[fileUri] || [];
  }

  /**
   * Get violations for a specific rule
   */
  getRuleViolations(ruleId: string): Violation[] {
    const violations: Violation[] = [];
    
    for (const fileViolations of Object.values(this.data.fileViolations)) {
      for (const violation of fileViolations) {
        if (violation.ruleId === ruleId) {
          violations.push(violation);
        }
      }
    }
    
    return violations;
  }

  /**
   * Calculate statistics for given violations
   */
  private calculateStatistics(fileViolations: FileViolations) {
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
        
        const currentCount = ruleIdCounts.get(violation.ruleId) || 0;
        ruleIdCounts.set(violation.ruleId, currentCount + 1);
      }
    }
    
    const totalFiles = Object.keys(fileViolations).length;
    const totalViolations = errorCount + warningCount + infoCount + noteCount + noneCount;
    const averageViolationsPerFile = totalFiles > 0 ? Math.round((totalViolations / totalFiles) * 10) / 10 : 0;
    
    const sortedRules = Array.from(ruleIdCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
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
} 