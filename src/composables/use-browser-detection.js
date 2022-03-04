import { useContext } from '@nuxtjs/composition-api'

export const useBrowserDetection = () => {
  const { app } = useContext()
  return app.$ua
}

export const useBrowserIsBlink = () => {
  const browser = useBrowserDetection()
  if (browser!==null) {
    return browser.isChrome || browser.isEdge || browser.isOpera
  } else {
    return null
  }
  
  
}

export const useBrowserIsMobile = () => {
  const mobile = useBrowserDetection().isMobile
  if (mobile!==null) {
    return mobile
  } else {
    return null
  }
}
