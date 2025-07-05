# SARIF Explorer Examples

This folder contains sample SARIF files and generated HTML reports to demonstrate the capabilities of SARIF Explorer.

## Sample Files

### 1. `eslint-sample.sarif`
A comprehensive ESLint analysis report with multiple violation types:
- **Errors**: 2 violations (prefer-const, no-undef)
- **Warnings**: 2 violations (no-unused-vars, no-empty-function)  
- **Info**: 1 violation (no-console)
- **Files**: 3 TypeScript/React files with embedded source code

### 2. `typescript-sample.sarif`
TypeScript compiler analysis with type checking issues:
- **Errors**: 3 violations (type mismatches, missing properties)
- **Warnings**: 1 violation (unused import)
- **Files**: 2 TypeScript files with complex type definitions

### 3. `security-sample.sarif`
Security analysis using SonarQube with security-focused rules:
- **Errors**: 2 critical security issues (SQL injection, XSS)
- **Warnings**: 3 medium priority issues (weak crypto, hardcoded secrets)
- **Info**: 1 low priority issue (deprecated function)
- **Files**: 4 files (JavaScript, Python, Java)

## Generated HTML Reports

Each SARIF file has a corresponding generated HTML report:
- `eslint-sample.html` - Modern light theme visualization
- `typescript-sample.html` - TypeScript analysis results
- `security-sample.html` - Security-focused analysis


## Usage

To generate HTML reports from these samples:

```bash
# Using the CLI
node cli.js examples/eslint-sample.sarif -o examples/eslint-sample.html

# Or with npm script
npm run generate examples/eslint-sample.sarif -o examples/eslint-sample.html
```