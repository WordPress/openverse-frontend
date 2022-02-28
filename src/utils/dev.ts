export const isDev: boolean = process.env.NODE_ENV === 'development'
export const isTest: boolean = process.env.NODE_ENV === 'test'
export const isNotProd: boolean = process.env.NODE_ENV !== 'production'
