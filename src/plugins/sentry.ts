import * as Sentry from '@sentry/browser'

Sentry.setContext('render context', {
  render_context: process.client ? 'client' : 'server',
})
