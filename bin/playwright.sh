#! /usr/bin/env sh
set -e

version() {
  pnpm ls --depth=0 | grep -e playwright | awk '{print $2}';
}

export USER_ID="${USER_ID:-$(id -u)}"
export PLAYWRIGHT_ARGS="$*"
PLAYWRIGHT_VERSION=$(version)
export PLAYWRIGHT_VERSION
export TEST_COMMAND="${TEST_COMMAND:-test:playwright:local}"

echo Running Playwright v"$PLAYWRIGHT_VERSION" as "$USER_ID" with Playwright arguments "$PLAYWRIGHT_ARGS"

docker-compose -f docker-compose.playwright.yml up --build --force-recreate --exit-code-from playwright --remove-orphans

docker-compose -f docker-compose.playwright.yml down
