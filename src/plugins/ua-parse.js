import useragent from 'express-useragent'

export default function (context, inject) {
  let userAgent=""

  if (typeof context.req !== 'undefined') {
    userAgent = String(context.req.headers['user-agent'])
  } else if (typeof navigator !== 'undefined') {
    userAgent = String (navigator.userAgent)
  }
  const ua = useragent.parse(userAgent)

  context.$ua = ua
  inject('ua', ua)
}
