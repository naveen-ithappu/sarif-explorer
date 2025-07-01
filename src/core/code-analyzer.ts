import { Violation, FileViolations } from '../types/sarif.js';

/**
 * Analyze code quality and provide insights based on SARIF violations
 */
export class CodeAnalyzer {
  private violations: Violation[];

  constructor(violations: Violation[]) {
    this.violations = violations;
  }

  /**
   * Get code quality score (0-100)
   */
  getQualityScore(): number {
    if (this.violations.length === 0) {
      return 100;
    }

    const weights = {
      error: 10,
      warning: 3,
      info: 1,
      note: 0.5,
      none: 0.1
    };

    let totalPenalty = 0;
    for (const violation of this.violations) {
      totalPenalty += weights[violation.level];
    }

    // Normalize to 0-100 scale
    const maxPenalty = this.violations.length * weights.error;
    const score = Math.max(0, 100 - (totalPenalty / maxPenalty) * 100);
    
    return Math.round(score);
  }

  /**
   * Get severity distribution
   */
  getSeverityDistribution() {
    const distribution = {
      error: 0,
      warning: 0,
      info: 0,
      note: 0,
      none: 0
    };

    for (const violation of this.violations) {
      distribution[violation.level]++;
    }

    return distribution;
  }

  /**
   * Get most problematic rules
   */
  getProblematicRules(limit: number = 5): Array<{ ruleId: string; count: number; severity: string }> {
    const ruleCounts = new Map<string, { count: number; severity: string }>();

    for (const violation of this.violations) {
      const existing = ruleCounts.get(violation.ruleId);
      if (existing) {
        existing.count++;
        // Keep the highest severity
        if (this.getSeverityWeight(violation.level) > this.getSeverityWeight(existing.severity)) {
          existing.severity = violation.level;
        }
      } else {
        ruleCounts.set(violation.ruleId, { count: 1, severity: violation.level });
      }
    }

    return Array.from(ruleCounts.entries())
      .map(([ruleId, data]) => ({ ruleId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get code hotspots (files with most violations)
   */
  getCodeHotspots(fileViolations: FileViolations, limit: number = 10): Array<{ file: string; violations: number; score: number }> {
    const hotspots = [];

    for (const [file, violations] of Object.entries(fileViolations)) {
      const analyzer = new CodeAnalyzer(violations);
      hotspots.push({
        file,
        violations: violations.length,
        score: analyzer.getQualityScore()
      });
    }

    return hotspots
      .sort((a, b) => b.violations - a.violations)
      .slice(0, limit);
  }

  /**
   * Get improvement recommendations
   */
  getRecommendations(): Array<{ type: string; message: string; priority: 'high' | 'medium' | 'low' }> {
    const recommendations: Array<{ type: string; message: string; priority: 'high' | 'medium' | 'low' }> = [];
    const severityDist = this.getSeverityDistribution();
    const problematicRules = this.getProblematicRules(3);

    // High priority recommendations
    if (severityDist.error > 0) {
      recommendations.push({
        type: 'critical',
        message: `Fix ${severityDist.error} critical error(s) first as they may cause runtime failures`,
        priority: 'high'
      });
    }

    if (problematicRules.length > 0) {
      const topRule = problematicRules[0];
      recommendations.push({
        type: 'rule-focus',
        message: `Focus on fixing "${topRule.ruleId}" rule violations (${topRule.count} occurrences)`,
        priority: 'high'
      });
    }

    // Medium priority recommendations
    if (severityDist.warning > 10) {
      recommendations.push({
        type: 'warnings',
        message: `Address ${severityDist.warning} warnings to improve code quality`,
        priority: 'medium'
      });
    }

    // Low priority recommendations
    if (severityDist.info > 0) {
      recommendations.push({
        type: 'info',
        message: `Review ${severityDist.info} informational issues for potential improvements`,
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * Get trend analysis (if historical data is available)
   */
  getTrendAnalysis(previousViolations?: Violation[]): { trend: 'improving' | 'declining' | 'stable'; change: number } {
    if (!previousViolations) {
      return { trend: 'stable', change: 0 };
    }

    const currentCount = this.violations.length;
    const previousCount = previousViolations.length;
    const change = currentCount - previousCount;

    if (change < -5) {
      return { trend: 'improving', change };
    } else if (change > 5) {
      return { trend: 'declining', change };
    } else {
      return { trend: 'stable', change };
    }
  }

  /**
   * Get compliance status
   */
  getComplianceStatus(): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];
    const severityDist = this.getSeverityDistribution();

    if (severityDist.error > 0) {
      issues.push(`${severityDist.error} critical errors found`);
    }

    if (severityDist.warning > 20) {
      issues.push(`${severityDist.warning} warnings exceed threshold`);
    }

    const qualityScore = this.getQualityScore();
    if (qualityScore < 70) {
      issues.push(`Code quality score is low (${qualityScore}/100)`);
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }

  /**
   * Get file type analysis
   */
  getFileTypeAnalysis(fileViolations: FileViolations): Map<string, { count: number; violations: number; avgViolations: number }> {
    const fileTypes = new Map<string, { count: number; violations: number; files: string[] }>();

    for (const [file, violations] of Object.entries(fileViolations)) {
      const extension = this.getFileExtension(file);
      const existing = fileTypes.get(extension);
      
      if (existing) {
        existing.count++;
        existing.violations += violations.length;
        existing.files.push(file);
      } else {
        fileTypes.set(extension, { count: 1, violations: violations.length, files: [file] });
      }
    }

    const result = new Map<string, { count: number; violations: number; avgViolations: number }>();
    
    for (const [ext, data] of fileTypes.entries()) {
      result.set(ext, {
        count: data.count,
        violations: data.violations,
        avgViolations: Math.round((data.violations / data.count) * 10) / 10
      });
    }

    return result;
  }

  /**
   * Get line density analysis
   */
  getLineDensityAnalysis(): { highDensityLines: number[]; densityMap: Map<number, number> } {
    const lineViolations = new Map<number, number>();

    for (const violation of this.violations) {
      const line = violation.line;
      lineViolations.set(line, (lineViolations.get(line) || 0) + 1);
    }

    const highDensityLines: number[] = [];
    const densityMap = new Map<number, number>();

    for (const [line, count] of lineViolations.entries()) {
      densityMap.set(line, count);
      if (count >= 3) {
        highDensityLines.push(line);
      }
    }

    return {
      highDensityLines: highDensityLines.sort((a, b) => a - b),
      densityMap
    };
  }

  /**
   * Helper method to get severity weight
   */
  private getSeverityWeight(level: string): number {
    const weights = { error: 5, warning: 4, info: 3, note: 2, none: 1 };
    return weights[level as keyof typeof weights] || 0;
  }

  /**
   * Helper method to get file extension
   */
  private getFileExtension(file: string): string {
    const parts = file.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'unknown';
  }
} 