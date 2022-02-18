/**
 * The talkback proxy for e2e tests. When making a request to the API during testing,
 * it tries to use the responses it previously saved in `/test/tapes` folder. If no
 * response is found there, it makes an actual request, and saves the response for
 * future use.
 * This makes it possible for the e2e tests to run without internet, and makes the
 * tests less flaky due to changes in the API or API data.
 */
const talkback = require('talkback')
const path = require('path')
const host = 'https://api.openverse.engineering'

function nameGenerator(tapeNumber, tape) {
  return path.join(`${tape.req.method}`, `response-${tapeNumber}`)
}
const opts = {
  host,
  port: 3000,
  path: './test/tapes',
  record: talkback.Options.RecordMode.NEW,
  debug: false,
  name: 'Openverse e2e proxy',
  tapeNameGenerator: nameGenerator,
}

const server = talkback(opts)

server.start(() => console.log('Talkback started!'))
