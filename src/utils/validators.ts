import fs from 'fs/promises';
import path from 'path';

interface NodeError extends Error {
  code?: string;
}

/**
 * Validates that the input file exists and is readable
 */
export async function validateInputFile(filePath: string): Promise<void> {
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Check if it's a file (not a directory)
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${filePath}`);
    }
    
    // Check if file is readable
    await fs.readFile(filePath, 'utf8');
    
  } catch (error) {
    const nodeError = error as NodeError;
    if (nodeError.code === 'ENOENT') {
      throw new Error(`Input file not found: ${filePath}`);
    }
    if (nodeError.code === 'EACCES') {
      throw new Error(`Permission denied reading file: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Validates that the output directory is writable
 */
export async function validateOutputPath(outputPath: string): Promise<void> {
  try {
    const outputDir = path.dirname(outputPath);
    
    // Check if output directory exists, create if it doesn't
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }
    
    // Check if directory is writable
    const testFile = path.join(outputDir, '.test-write');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    
  } catch (error) {
    const nodeError = error as NodeError;
    if (nodeError.code === 'EACCES') {
      throw new Error(`Permission denied writing to directory: ${path.dirname(outputPath)}`);
    }
    throw new Error(`Cannot write to output path: ${outputPath}`);
  }
}

/**
 * Validates that the input file is a valid JSON SARIF file
 */
export async function validateSarifFile(filePath: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Basic SARIF validation
    if (!data.version || !data.runs || !Array.isArray(data.runs)) {
      throw new Error('Invalid SARIF format: missing required fields (version, runs)');
    }
    
    if (data.runs.length === 0) {
      throw new Error('SARIF file contains no runs');
    }
    
    const run = data.runs[0];
    if (!run.tool || !run.results) {
      throw new Error('Invalid SARIF run: missing required fields (tool, results)');
    }
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in SARIF file: ${filePath}`);
    }
    throw error;
  }
} 