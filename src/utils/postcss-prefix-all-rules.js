const postcss = require('postcss')
const defaultOptions = {
  prefix: '',
}

/**
 * PostCSS plugin to walk all rules and prefix every selector,
 * essentially namespacing a CSS file.
 *
 * Copied from: https://github.com/tillschander/postcss-prefix-all-rules
 */
module.exports = postcss.plugin('postcss-prefix-all-rules', (userOptions) => {
  let options = Object.assign({}, defaultOptions, userOptions)

  return (root, result) => {
    if (options.prefix.trim() === '') {
      return result.warn('No prefix spcified.')
    }

    root.walkRules((rule) => {
      let selectors = rule.selector.split(',')

      selectors = selectors.map((selector) => {
        let matchArray = selector.match(/(\s*)(\S+.*)/i)

        if (selector.length === 0) {
          return selector
        }

        return matchArray[1] + options.prefix + ' ' + matchArray[2]
      })

      rule.selector = selectors.join(',')
    })

    return result
  }
})
