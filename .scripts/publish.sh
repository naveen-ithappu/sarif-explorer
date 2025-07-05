#!/bin/bash

# Set NPM_TOKEN from environment variable
export NPM_TOKEN=${NPM_TOKEN_PERSONAL}

# Execute npm publish with all arguments passed to this script
npm publish --access public "$@" 