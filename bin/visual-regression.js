/**
 * Run this as a node script so that we can retrieve the `process.cwd`
 * which isn't possible to evaluate cross-platform inside an package.json script
 *
 * We can also automatically sync the local playwright version
 * with the docker image version. This ensures that the browser
 * versions expected by the `playwright` binary installed locally
 * matches the versions pre-installed in the container.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const axios = require('axios')
const apiProxyServer = require('./api-proxy')
/* eslint-enable @typescript-eslint/no-var-requires */

async function runVisualRegressionTests() {
  const res = await axios.get('http://localhost:8443')
  if (res.status !== 200) {
    console.error(
      'Please run the frontend locally and verify that it is working.'
    )
    process.exit(1)
  }

  await apiProxyServer.start()
  console.info('API talkback proxy started')

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
    '--add-host=host.docker.internal:host-gateway', // This is necessary to make `host.docker.internal` work on Linux. Does it break the command for other OSs?
    `mcr.microsoft.com/playwright:v${playwrightVersion}-focal`,
    '/src/bin/visual-regression.sh',
  ]

  if (process.argv.includes('-u')) {
    args.push('-u')
  }

  if (process.argv.includes('--debug')) {
    args.push('--debug')
  }

  try {
    console.info('Running visual regression tests')
    spawnSync('docker', args, {
      stdio: 'inherit',
    })
  } finally {
    apiProxyServer.close()
  }
}

runVisualRegressionTests()
