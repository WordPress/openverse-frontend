import osu from 'node-os-utils'

/**
 * A Healthcheck which passes if the amount of avaliable memory
 * is greater than our desired minimum avaliable memory percentage.
 *
 * Useful in the event of memory leaks, in particular.
 *
 * @type {import('@nuxt/types').ServerMiddleware}
 */
export default function Healthcheck(_, res) {
  osu.mem
    .info()
    .then((info) => {
      const avaliableMemory = info.freeMemPercentage

      /**
       * Server Middleware do not have access to any context or configuration,
       * so we use a raw environment variable and set a default here, instead
       * of in `nuxt.config.ts` or `utils/env.ts`.
       */
      const desiredAvaliableMemory = Number(
        process.env.HEALTHCHECK_DESIRED_AVALIABLE_MEMORY_PERCENTAGE ?? '15'
      )

      const avaliableMemoryIsSufficient =
        avaliableMemory > desiredAvaliableMemory

      console.info(`Healthcheck memory information: `, {
        avaliableMemory,
        desiredAvaliableMemory,
        avaliableMemoryIsSufficient,
      })

      if (!avaliableMemoryIsSufficient) {
        throw Error(
          `Avaliable memory percentage ${avaliableMemory} is below desired ${desiredAvaliableMemory}`
        )
      }

      res.setHeader('Content-Type', 'text/plain')
      res.end('OK')
    })
    .catch((error) => {
      console.error(error)
      res.statusCode = 503
      res.end('Healthcheck Failed')
    })
}
