import useragent from 'express-useragent'

export default function (context, inject) {
  let userAgent

  if (typeof context.req !== 'undefined') {
    userAgent = context.req.headers['user-agent']
  } else if (typeof navigator !== 'undefined') {
    userAgent = navigator.userAgent
  }
  const ua = null
  if(userAgent!==null||userAgent!==undefined){
   ua = useragent.parse(userAgent)
  }

  context.$ua = ua
  inject('ua', ua)
}
