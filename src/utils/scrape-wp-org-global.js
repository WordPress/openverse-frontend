const fetch = require('node-fetch')
const { chromium } = require('playwright')

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
  await page.goto('http://wordpress.org')

  const [header, footer, stylesheetURLs] = await page.evaluate(async () => {
    return [
      document.querySelector('#wporg-header').outerHTML,
      document.querySelector('#wporg-footer').outerHTML,
      [...document.styleSheets].map((i) => i.href).filter(Boolean),
    ]
  })

  let css = await Promise.all(
    stylesheetURLs.map((i) => fetch(i).then((res) => res.text()))
  ).then((i) =>
    i
      .reduce((acc, i) => `${acc}\n${i}`, '')
      .replace(/\/\/s.w.org/g, 'https://s.w.org')
  )

  await browser.close()

  return [header, footer, css]
}

module.exports = { scrapeWpDotOrg }
