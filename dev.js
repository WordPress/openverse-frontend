/**
 * This needs to live here instead of inside `nuxt.config.js` because it is referenced by
 * runtime parts of our app. If we place it in `nuxt.config.js` then our app has to import
 * the `nuxt.config.js` file, which in turn tries to import `@nuxt/bridge` which will cause
 * `babel-loader` to fail on `var _require = createRequire(import.meta.url);`
 *
 * In all cases the only variable we were referencing from the nuxt config was the `dev` variable
 * so moving it into its own independent module makes it possible to still centralize that particular
 * variable's configuration while making it sharable across the app without causing build issues
 */
export const dev = process.env.NODE_ENV !== 'production'
