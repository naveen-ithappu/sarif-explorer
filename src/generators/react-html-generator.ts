import React from 'react';
import { renderToString } from 'react-dom/server';
import { SarifData } from '../types/sarif.js';
import { SarifReportApp } from './SarifReportApp.js';
import { generateHtmlDocument } from './html-template.js';

/**
 * Generate HTML report from SARIF data using React components
 */
export async function generateReactHtmlReport(sarifData: SarifData, outputPath: string): Promise<void> {
  const htmlContent = generateReactHtml(sarifData);
  
  // Write the HTML file
  const fs = await import('fs/promises');
  await fs.writeFile(outputPath, htmlContent, 'utf8');
}

/**
 * Generate React-based HTML content
 */
function generateReactHtml(sarifData: SarifData): string {
  // Render React component to HTML string
  const reactHtml = renderToString(React.createElement(SarifReportApp, { data: sarifData }));
  
  // Generate the complete HTML document with embedded styles and scripts
  return generateHtmlDocument(reactHtml);
} 