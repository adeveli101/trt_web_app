module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de', 'fr', 'es', 'it'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 