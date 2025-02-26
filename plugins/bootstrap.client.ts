import * as bootstrap from 'bootstrap'

export default defineNuxtPlugin(nuxtApp => {
  // Make Bootstrap available throughout the app
  nuxtApp.provide('bootstrap', bootstrap)
}) 