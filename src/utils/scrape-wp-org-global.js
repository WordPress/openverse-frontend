const fetch = require('node-fetch')
const { chromium } = require('playwright')
const stringToBoolean = require('./string-to-boolean')

const useNewHeader =
  stringToBoolean(process.env.FEATURE_2021_GLOBAL_HEADER_FOOTER) ?? false

const wpSite = useNewHeader
  ? {
      url: 'http://wordpress.org/news-test',
      headerSelector: '.global-header',
      footerSelector: '.global-footer',
    }
  : {
      url: 'http://wordpress.org',
      headerSelector: '#wporg-header',
      footerSelector: '#wporg-footer',
    }

/**
 * Scrapes the header, footer, and stylesheet contents from
 * the WordPress.org homepage. Also replaces protocol-agnostic
 * urls with 'https://' so they aren't interpreted as
 * relative urls.
 *
 * This is probably extremely brittle and a bad idea.
 */
async function scrapeWpDotOrg() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(wpSite.url)
  const [header, footer, inlineStyleString, stylesheetURLs] =
    await page.evaluate(async (wpSite) => {
      console.log(wpSite)

      return [
        document.querySelector(wpSite.headerSelector).outerHTML,
        document.querySelector(wpSite.footerSelector).outerHTML,
        // don't forget inline style tags!
        [...document.querySelectorAll('style')].reduce(
          (acc, i) => `${acc}\n${i.innerHTML}`,
          ''
        ),
        [...document.styleSheets].map((i) => i.href).filter(Boolean),
      ]
    }, wpSite)

  let css = await Promise.all(
    stylesheetURLs.map((i) => fetch(i).then((res) => res.text()))
  ).then((i) =>
    i
      .reduce((acc, i) => `${acc}\n${i}`, '')
      .replace(/\/\/s.w.org/g, 'https://s.w.org')
  )

  await browser.close()

  return [header, footer, `${inlineStyleString}\n${css}`]
}

module.exports = { scrapeWpDotOrg }
