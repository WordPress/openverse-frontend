#! /bin/bash

# This script is meant to run inside the playwright docker container, hence the assumed `/src` directory
cd /src

# Use npm to avoid having to install pnpm inside the container, it doesn't matter in this case
npm run test:visual-regression:docker -- $1 $2
