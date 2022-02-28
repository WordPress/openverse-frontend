import { isDev } from '~/utils/dev'

export const sentry = {
  dsn:
    process.env.SENTRY_DSN ||
    'https://53da8fbcebeb48a6bf614a212629df6b@o787041.ingest.sentry.io/5799642',
  disabled: isDev,
  environment: process.env.NODE_ENV,
  lazy: true,
}
