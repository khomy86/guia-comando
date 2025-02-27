// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  // Optimize CSS loading
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  
  // App configuration
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
          integrity: 'sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r',
          crossorigin: 'anonymous',
          defer: true
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js',
          integrity: 'sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+',
          crossorigin: 'anonymous',
          defer: true
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Guia de Comando - Aplicação para gestão de acidentes' },
        { name: 'theme-color', content: '#ffc023' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      title: 'Guia de Comando',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  
  // Enable server-side rendering
  ssr: true,
  
  // Nitro server configuration
  nitro: {
    preset: 'vercel',
    serveStatic: true,
    compressPublicAssets: true,
    routeRules: {
      // Cache static assets for 1 year
      '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // Cache API responses for 5 minutes
      '/api/**': { cors: true, headers: { 'cache-control': 'no-cache' } }
    }
  },
  
  // Performance optimizations
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true
  },
  
  // Build optimizations
  build: {
    transpile: [],
    extractCSS: true
  },
  
  // Runtime config for API keys
  runtimeConfig: {
    // Keys within public are also exposed to the client
    cloudmersiveApiKey: process.env.CLOUDMERSIVE_API_KEY || '',
    public: {
      // Public keys here
      appName: 'Guia de Comando'
    }
  },
  
  // Optimize imports
  imports: {
    autoImport: true
  },
  
  // Optimize modules
  modules: [
    // Add any modules you're using here
  ],
  
  // Optimize vite configuration
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production'
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router']
    }
  }
})
