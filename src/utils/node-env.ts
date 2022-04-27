import { DEVELOPMENT, TEST, PRODUCTION } from '~/constants/node-env'

export const isDev: boolean = process.env.NODE_ENV === DEVELOPMENT
export const isTest: boolean = process.env.NODE_ENV === TEST
export const isProd: boolean = process.env.NODE_ENV === PRODUCTION
