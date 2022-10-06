export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'GAFIN DEFI',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Welcome to Gafin Defi' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'og:image', content: '/thumbnail.jpg' },
      { name: 'og:image:alt', content: 'Welcome to Gafin Defi' },
      { name: 'og:description', content: 'Welcome to Gafin Defi' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/fav.ico' }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/CustomModal.plugin.js',
    '~plugins/Toast.plugin.ts',
    { src: "~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: 'https://gafin.io/defi'
  },

  server: {
    host: "0.0.0.0"
  }
};
