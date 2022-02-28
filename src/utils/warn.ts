export const getLogger = (level: 'log' | 'warn' | 'error') =>
  process.env.NODE_ENV !== 'production'
    ? console[level]
    : () => {
        // do nothing
      }

export const warn = getLogger('warn')
export const log = getLogger('log')
