/**
 * Run this as a node script so that we can retrieve the `process.cwd`
 * which isn't possible to evaluate cross-platform inside an package.json script
 *
 * We can also automatically sync the local playwright version
 * with the docker image version. This ensures that the browser
 * versions expected by the `playwright` binary installed locally
 * matches the versions pre-installed in the container.
 */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const yaml = require('yaml')

const pnpmLock = yaml.parse(
  String(fs.readFileSync(path.resolve(process.cwd(), 'pnpm-lock.yaml')))
)

const playwrightVersion = pnpmLock.devDependencies['@playwright/test']

const args = [
  'run',
  '--rm',
  '-it',
  '--mount',
  `type=bind,source=${process.cwd()},target=/src`,
  '--add-host=host.docker.internal:host-gateway',
  `mcr.microsoft.com/playwright:v${playwrightVersion}-focal`,
  '/src/bin/visual-regression.sh',
]

if (process.argv.includes('-u')) {
  args.push('-u')
}

spawnSync('docker', args, {
  stdio: 'inherit',
})
