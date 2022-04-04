import type { ServerMiddleware } from '@nuxt/types'

const healthcheck: ServerMiddleware = (_req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.end('OK')
}

export default healthcheck
