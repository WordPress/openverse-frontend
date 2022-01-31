import useragent from 'express-useragent'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  let userAgent

  if (typeof nuxtApp.nuxt2Context.req !== 'undefined') {
    userAgent = nuxtApp.nuxt2Context.req.headers['user-agent']
  } else if (typeof navigator !== 'undefined') {
    userAgent = navigator.userAgent
  }

  const ua = useragent.parse(userAgent)

  nuxtApp.provide('ua', ua)
})
