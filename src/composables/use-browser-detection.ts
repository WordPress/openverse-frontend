import { useNuxtApp } from '#app'

export const useBrowserDetection = () => {
  return useNuxtApp().nuxt2Context.$ua
}

export const useBrowserIsBlink = () => {
  const browser = useBrowserDetection()
  if (browser !== null) {
    return browser.isChrome || browser.isEdge || browser.isOpera
  } else {
    return false
  }
}

export const useBrowserIsMobile = () => {
  const browser = useBrowserDetection()
  if (browser === null) {
    return false
  } else {
    return browser.isMobile
  }
}
