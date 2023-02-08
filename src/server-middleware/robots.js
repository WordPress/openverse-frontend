const { LOCAL, PRODUCTION } = require("../constants/deploy-env")

/**
 * A simple healthcheck that is always true.
 *
 * @todo Update to a resource-sensitive version that fails when
 * memory and/or cpu usage reach a configurable threshhold.
 * @type {import('@nuxt/types').ServerMiddleware}
 */
export default function healthcheck(_, res) {
  const deployEnv = process.env.DEPLOYMENT_ENV ?? LOCAL

  const contents =
    deployEnv === PRODUCTION
      ? `# This file is intentionally left blank`
      : `# Block crawlers from the staging site
User-agent: *
Disallow: /
`

  res.setHeader("Content-Type", "text/plain")
  res.end(contents)
}
