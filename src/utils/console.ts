import { isNotProd } from '~/utils/dev'

export const getLogger = (level: 'log' | 'warn' | 'error') =>
  isNotProd
    ? console[level]
    : () => {
        // do nothing
      }

export const warn = getLogger('warn')
export const log = getLogger('log')
