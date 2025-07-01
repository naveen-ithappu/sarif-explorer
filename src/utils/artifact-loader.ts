import fs from 'fs/promises';
import path from 'path';

export interface ArtifactLoadResult {
  success: boolean;
  content?: string;
  error?: string;
  filePath: string;
}

/**
 * Load artifact content from file system
 */
export async function loadArtifactContent(
  artifactUri: string, 
  sourceDir: string
): Promise<ArtifactLoadResult> {
  try {
    // Resolve the artifact path relative to the source directory
    const resolvedPath = path.resolve(sourceDir, artifactUri);
    
    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      return {
        success: false,
        error: `File not found: ${resolvedPath}`,
        filePath: resolvedPath
      };
    }

    // Read file content
    const content = await fs.readFile(resolvedPath, 'utf8');
    
    return {
      success: true,
      content,
      filePath: resolvedPath
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error reading file',
      filePath: path.resolve(sourceDir, artifactUri)
    };
  }
}

/**
 * Load multiple artifacts and return a map of URI to content
 */
export async function loadArtifactsFromDirectory(
  artifactUris: string[],
  sourceDir: string
): Promise<Map<string, ArtifactLoadResult>> {
  const results = new Map<string, ArtifactLoadResult>();
  
  for (const uri of artifactUris) {
    const result = await loadArtifactContent(uri, sourceDir);
    results.set(uri, result);
  }
  
  return results;
}

/**
 * Validate source directory exists and is readable
 */
export async function validateSourceDirectory(sourceDir: string): Promise<boolean> {
  try {
    const stats = await fs.stat(sourceDir);
    return stats.isDirectory();
  } catch {
    return false;
  }
} 