#!/bin/bash

# $1 = the first argument in the command line

# trasforms component name from PascalCase to kebab-case
componentNameInKebabCase=$(echo "$1" | sed 's/\(.\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')

pnpm run create:component-scaffolding "$1" "$componentNameInkebabCase"
