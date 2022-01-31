import { useNuxtApp } from '#app'

export const useBrowserDetection = () => {
  return useNuxtApp().$ua
}

export const useBrowserIsBlink = () => {
  const browser = useBrowserDetection()
  return browser.isChrome || browser.isEdge || browser.isOpera
}
