#!/usr/bin/env node

// Main CLI entry point that references the generated TypeScript output
import('./dist/cli/index.js').catch(err => {
  console.error('Error loading CLI:', err.message);
  console.log('Make sure to run "npm run build:cli" first');
  process.exit(1);
}); 