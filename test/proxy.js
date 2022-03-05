/**
 * The talkback proxy for e2e tests. When making a request to the API during testing,
 * it tries to use the responses it previously saved in `/test/tapes` folder. If no
 * response is found there, it:
 * - by default, returns 'Not found'.
 * - if you pass `--update-tapes` as a parameter, makes an actual request, and saves the response for
 * future use.
 * This makes it possible for the e2e tests to run without internet, and makes the
 * tests less flaky due to changes in the API or API data.
 */
const process = require('process')
const zlib = require('zlib')

const talkback = require('talkback')

const host = 'https://api.openverse.engineering/v1'

const tapeNameGenerator = (tapeNumber) => `response-${tapeNumber}`

const updatingTapes =
  process.argv.includes('--update-tapes') || process.env.UPDATE_TAPES === 'true'

const recordMode = updatingTapes
  ? talkback.Options.RecordMode.NEW
  : talkback.Options.RecordMode.DISABLED
console.log('Record mode: ', recordMode)

/**
 * Transform any response values to use the talkback
 * proxy instead of pointing directly upstream for
 * RESTful references.
 *
 * Ignore thumbnail and non-successful requests, those
 * don't return JSON bodies so we can save them as-is.
 *
 * Sometimes we get a raw brotli buffer back from upstream
 * and we need to decompress it. Sometimes we get the actual
 * JSON. I'm fairly confident this has something to do with Cloudflare
 * cached responses being compressed and others not? In any case,
 * if the response comes back compressed then we need to
 * decompress it, fix the upstream API references, and then
 * compress it back before saving. We could mess with the
 * `content-encoding` header instead of re-compressing it but
 * I think that would sort of violate the contract talkback is meant
 * to have and furthermore would eliminate a complexity in
 * our stack that apparently exists in production. Given e2e
 * tests should aim to test as close to production conditions as
 * possible I think it makes sense to retain both the compressed
 * and uncompressed responses.
 *
 * A note to future contributors: If you find that JSON.parse is
 * complaining about unknown characters then you're either
 * dealing with an error response that isn't being caught by
 * the status check on the first line OR you've discovered
 * another compression algorithm being used (or, of course, it
 * could be something else entirely). Don't discount that it could
 * be something else, but I'd check those two things first
 * before digging elsewhere.
 *
 * @param tape
 */
const tapeDecorator = (tape) => {
  if (tape.req.url.endsWith('/thumb/') || tape.res.status >= 399) return tape

  let responseBody,
    isBrotli = tape.res.headers['content-encoding']?.includes('br')

  if (isBrotli) {
    responseBody = zlib.brotliDecompressSync(tape.res.body).toString()
  } else {
    responseBody = tape.res.body.toString()
  }

  const fixedResponseBody = responseBody.replace(
    /https?:\/\/api.openverse.engineering\/v1/g,
    'http://localhost:3000'
  )

  tape.res.body = isBrotli
    ? zlib.brotliCompressSync(fixedResponseBody)
    : Buffer.from(fixedResponseBody)
  return tape
}

const opts = {
  host,
  port: 3000,
  path: './test/tapes',
  record: recordMode,
  fallbackMode: talkback.Options.FallbackMode.NOT_FOUND,
  ignoreHeaders: ['user-agent', 'origin', 'referrer', 'content-length', 'host'],
  name: 'Openverse e2e proxy',
  summary: false,
  tapeNameGenerator,
  tapeDecorator,
}

const server = talkback(opts)

server.start(() => console.log('Talkback started!'))
function closeServer() {
  server.close()
  console.log('Server closed, exiting process')
  process.exit(0)
}
process.on('SIGTERM', () => {
  console.log('Received SIGTERM')
  closeServer()
})
