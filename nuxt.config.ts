// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'pt-PT' },
      title: 'Guia de Comando',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Guia de Comando - Aplicação para gestão de acidentes' },
        { name: 'theme-color', content: '#ffc023' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    // Server-only. Overridable at runtime with NUXT_CLOUDMERSIVE_API_KEY
    cloudmersiveApiKey: process.env.CLOUDMERSIVE_API_KEY || '',
  },

  // Nitro auto-detects the Vercel preset when building on Vercel
  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/api/**': { headers: { 'cache-control': 'no-store' } },
  },

  experimental: {
    viewTransition: true,
  },
})
