import cheerio from 'cheerio'

/**
 * Returns raw text of the meta tags present in an HTML document
 *
 * Note: As we determine _which_ meta tags are important to send
 * we'll want to revise this to filter the tags we append in the
 * `each` callback.
 *
 * @param {string} html
 * @returns {string}
 */
export const pluckMeta = (html) => {
  const $ = cheerio.load(html)
  const meta = $('meta')
  let text = ''
  meta.each((_, element) => {
    text += cheerio.load(element).html()
  })

  return text
}

/**
 * Intercepts rendered responses and sends a raw text response
 * of the `meta` tags presented in the rendered response whenever
 * a `?meta` query param is present in a request.
 *
 * @param {unknown} _
 * @param {{ redirected: boolean, html: string }} result
 * @param {{ req: import('connect').IncomingMessage, res: import('http').ServerResponse }} context
 * @returns {void}
 */
const hook = (_, result, { req, res }) => {
  try {
    // @todo(sarayourfriend) Investigate if there's a safe way around using this internal property
    // @ts-ignore Accessing undocumented property `_parsedUrl`
    const isMetaRequest = new URLSearchParams(req._parsedUrl.search).has('meta')

    if (!isMetaRequest) {
      // Let nuxt handle the request as normal
      return
    }

    const text = pluckMeta(result.html)

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Length', Buffer.byteLength(text))
    res.end(text, 'utf8')

    // Let nuxt know we've handled the resolution of the request on our own
    result.redirected = true
  } catch (e) {
    // Something happened either in parsing the query string or the generated HTML
    // In any case, let's log it for visibility and let Nuxt handle the request like normal
    console.log(e)
    // continue
  }
}

export default hook
