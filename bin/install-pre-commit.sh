#! /usr/bin/env sh

set -e

if [ -z "$SKIP_PRE_COMMIT" ] && [ ! -f ./pre-commit.pyz ]
then
  echo "installing pre-commit"
  pnpm pc:download && pnpm pc:install
else
  echo "skipping pre-commit installation"
fi
