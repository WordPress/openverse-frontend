import pkg from './package.json'
import locales from './src/locales/scripts/valid-locales.json'
import stringToBoolean from './src/utils/string-to-boolean'

/**
 * Default environment variables are set on this key. Defaults are fallbacks to existing env vars.
 * All boolean values should be designed to be false by default.
 */
export const env = {
  apiUrl: process.env.API_URL ?? 'https://api.openverse.engineering/v1/',
  enableGoogleAnalytics: stringToBoolean(process.env.ENABLE_GOOGLE_ANALYTICS),
  googleAnalyticsUA: process.env.GOOGLE_ANALYTICS_UA ?? 'UA-2010376-36',
  filterStorageKey: 'openverse-filter-visibility',
  notificationStorageKey: 'openverse-show-notification',
  enableInternalAnalytics: stringToBoolean(
    process.env.ENABLE_INTERNAL_ANALYTICS
  ),
  /** Feature flag to enable non-image media */
  enableAudio: stringToBoolean(process.env.ENABLE_AUDIO),
}

/**
 * The default metadata for the site. Can be extended and/or overwritten per page. And even in components!
 * See the Nuxt.js docs for more info.
 * {@link https://nuxtjs.org/guides/features/meta-tags-seo Nuxt.js Docs}
 */
const meta = [
  { charset: 'utf-8' },
  {
    name: 'description',
    content:
      'A new Openverse search tool for creators seeking to discover and reuse free resources with greater ease.',
  },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: '@creativecommons' },
  { name: 'og:title', content: 'Openverse' },
  {
    name: 'og:image',
    content: '/cclogo-shared-image.jpg',
  },
  {
    name: 'og:description',
    content:
      'Empowering the world to share through 6 simple licenses + a global community of advocates for open.',
  },
  {
    name: 'og:url',
    content: 'https://creativecommons.org',
  },
  {
    name: 'og:site_name',
    content: 'Creative Search',
  },
  {
    vmid: 'monetization',
    name: 'monetization',
    content: '$ilp.uphold.com/edR8erBDbRyq',
  },
]

if (process.env.NODE_ENV === 'production') {
  meta.push({
    'http-equiv': 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  })
}

// Default html head
const head = {
  title: 'Openverse',
  meta,
  link: [
    {
      rel: 'preconnect',
      href: env.apiUrl,
      crossorigin: '',
    },
    {
      rel: 'dns-prefetch',
      href: env.apiUrl,
    },
    {
      rel: 'search',
      type: 'application/opensearchdescription+xml',
      title: 'Openverse',
      href: '/opensearch.xml',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/app-icons/cc-site-icon-150x150.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/app-icons/cc-site-icon-300x300.png',
      sizes: '192x192',
    },
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      href: '/app-icons/cc-site-icon-300x300.png',
      sizes: '192x192',
    },
  ],
}

export default {
  // eslint-disable-next-line no-undef
  version: pkg.version, // used to purge cache :)
  cache: {
    pages: ['/'],
    store: {
      type: 'memory', // 'redis' would be nice
      max: 100,
      ttl: process.env.MICROCACHE_DURATION || 60,
    },
  },
  srcDir: 'src/',
  modern: 'client',
  server: { port: process.env.PORT || 8443 },
  router: {
    middleware: 'middleware',
  },
  components: {
    dirs: [
      '~/components',
      '~/components/ContentReport',
      '~/components/Filters',
      '~/components/ImageDetails',
      '~/components/ImageGrid',
      '~/components/MediaInfo',
      '~/components/MetaSearch',
      '~/components/MediaTag',
      '~/components/Skeleton',
      '~/components/VPopover',
    ],
  },
  plugins: [
    { src: '~/plugins/ab-test-init.js', mode: 'client' },
    { src: '~/plugins/ga.js', mode: 'client' },
    { src: '~/plugins/url-change.js' },
    { src: '~/plugins/migration-notice.js' },
  ],
  css: [
    '~/assets/fonts.css',
    '~/styles/vocabulary.scss',
    '~/styles/global.scss',
    '~/styles/accent.scss',
  ],
  head,
  env,
  dev: process.env.NODE_ENV !== 'production',
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
    '@nuxtjs/eslint-module',
  ],
  // Load the scss variables into every component:
  // No need to import them. Since the variables will not exist in the final build,
  // this doesn't make the built files larger.
  styleResources: {
    scss: ['./styles/utilities/all.scss'],
  },
  modules: ['@nuxtjs/sentry', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  serverMiddleware: [
    { path: '/healthcheck', handler: '~/server-middleware/healthcheck.js' },
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en',
        file: 'en.json',
      },
      ...(locales ?? []),
    ],
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    /**
     * This section is critical for the current, iframed production environment
     * {@link https://i18n.nuxtjs.org/options-reference/#detectbrowserlanguage}
     * */
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      cookieCrossOrigin: true,
      cookieSecure: true,
    },
    baseUrl: 'http://localhost:8443',
    vueI18n: '~/plugins/vue-i18n.js',
  },
  sentry: {
    dsn:
      process.env.SENTRY_DSN ||
      'https://53da8fbcebeb48a6bf614a212629df6b@o787041.ingest.sentry.io/5799642',
    disabled: process.env.NODE_ENV === 'development',
    environment: process.env.NODE_ENV,
    lazy: true,
  },
  tailwindcss: {
    // https://github.com/nuxt-community/tailwindcss-module/issues/114#issuecomment-698885369
    configPath: '~~/tailwind.config.js',
  },
  storybook: {
    port: 6006, // standard port for Storybook
    stories: ['~/**/*.stories.@(mdx|js)'],
    addons: [
      {
        name: '@storybook/addon-essentials',
        options: {
          backgrounds: false,
          viewport: false,
          toolbars: true,
        },
      },
    ],
    parameters: {
      options: {
        storySort: {
          order: ['Introduction', ['Openverse UI']],
        },
      },
    },
  },
}
