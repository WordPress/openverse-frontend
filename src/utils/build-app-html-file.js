/**
 * This module builds the app.html file in the `/src/` directory.
 * This script should only be run from the root of the application.
 */
const { scrapeWpDotOrg } = require('./scrape-wp-org-global')
const { writeFile } = require('fs/promises')

scrapeWpDotOrg().then(([header, footer, css]) => {
  writeFile(
    process.cwd() + '/src/app.html',
    `
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    <style data-wordpress-injected-styles>${css}</style>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    ${header}
    {{ APP }}
    ${footer}
  </body>
</html>
  `
  )
})
