#!/bin/bash

# SARIF Explorer - Generate All Examples
# This script generates HTML reports for all sample SARIF files

echo "🚀 Generating SARIF Explorer example reports..."
echo ""

# Check if CLI is built
if [ ! -f "dist/cli/index.js" ]; then
    echo "📦 Building CLI first..."
    npm run build:cli
    echo ""
fi

# Generate ESLint sample
echo "📊 Generating ESLint sample..."
node cli.js --input examples/eslint-sample.sarif --output examples/eslint-sample.html

# Generate TypeScript sample
echo "📊 Generating TypeScript sample..."
node cli.js --input examples/typescript-sample.sarif --output examples/typescript-sample.html

# Generate Security sample
echo "📊 Generating Security sample..."
node cli.js --input examples/security-sample.sarif --output examples/security-sample.html

# Generate Multi-tool sample
echo "📊 Generating Multi-tool sample..."
node cli.js --input examples/multi-tool-sample.sarif --output examples/multi-tool-sample.html

echo ""
echo "✅ All example reports generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  - examples/eslint-sample.html"
echo "  - examples/typescript-sample.html"
echo "  - examples/security-sample.html"
echo "  - examples/multi-tool-sample.html"
echo ""
echo "🌐 Open any HTML file in your browser to view the reports"
echo "📖 See examples/USAGE.md for detailed usage instructions" 