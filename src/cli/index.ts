#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { generateReactHtmlReport } from '../generators/react-html-generator.js';
import { parseSarifFile, SarifParseOptions } from '../core/sarif-parser.js';
import { validateInputFile, validateOutputPath } from '../utils/validators.js';

const program = new Command();

program
  .name('sarif-explorer')
  .description('Convert SARIF reports to interactive HTML viewer')
  .version('1.0.0')
  .option('-i, --input <path>', 'Path to SARIF report file', '')
  .option('-o, --output <path>', 'Path for generated HTML file', '')
  .option('-s, --source-dir <path>', 'Source directory for loading artifact files (default: SARIF file directory)', '')
  .option('--no-snippets', 'Exclude code snippets in the report')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .action(async (options) => {
    try {
      const { input, output, sourceDir, snippets, verbose } = options;
      
      if (verbose) {
        console.log(chalk.blue('🔍 SARIF Explorer - Starting conversion process...'));
      }

      // Validate input file
      if (!input) {
        console.error(chalk.red('❌ Error: Input file path is required'));
        console.log(chalk.yellow('Usage: sarif-explorer --input path/to/report.sarif --output report.html'));
        process.exit(1);
      }

      if (!output) {
        console.error(chalk.red('❌ Error: Output file path is required'));
        console.log(chalk.yellow('Usage: sarif-explorer --input path/to/report.sarif --output report.html'));
        process.exit(1);
      }

      // Validate input file exists and is readable
      await validateInputFile(input);
      
      // Validate output directory is writable
      await validateOutputPath(output);

      // Prepare parse options
      const parseOptions: SarifParseOptions = {
        sourceDir: sourceDir || undefined,
        includeSnippets: snippets,
        verbose
      };

      if (verbose) {
        console.log(chalk.blue(`📁 Reading SARIF file: ${input}`));
        if (sourceDir) {
          console.log(chalk.blue(`📂 Source directory: ${sourceDir}`));
        }
        if (!snippets) {
          console.log(chalk.blue(`🚫 Code snippets disabled`));
        }
      }

      // Parse SARIF file
      const sarifData = await parseSarifFile(input, parseOptions);
      
      if (verbose) {
        console.log(chalk.green(`✅ Parsed SARIF file successfully`));
        console.log(chalk.blue(`📊 Found ${sarifData.files.length} files with issues`));
        console.log(chalk.blue(`🚨 Total violations: ${sarifData.totalViolations}`));
      }

      // Generate HTML report
      if (verbose) {
        console.log(chalk.blue(`🔄 Generating HTML report...`));
      }

      await generateReactHtmlReport(sarifData, output);

      console.log(chalk.green(`✅ SARIF report generated successfully!`));
      console.log(chalk.blue(`📄 Output file: ${output}`));
      console.log(chalk.blue(`📊 Files with issues: ${sarifData.files.length}`));
      console.log(chalk.blue(`🚨 Total violations: ${sarifData.totalViolations}`));

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`));
      if (options.verbose && error instanceof Error && error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

program.parse(); 