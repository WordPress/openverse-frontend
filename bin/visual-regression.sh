#!/bin/bash

export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

cd /src
npm run test:visual-regression:local -- $1
