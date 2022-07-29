import { mockCreateApiService } from '~~/test/unit/test-utils/api-service-mock'

import apiTokenPlugin, {
  Process,
  expiryThreshold,
} from '~/plugins/api-token.server'

import type { Context } from '@nuxt/types'

export declare let process: NodeJS.Process & Process

const matchTokenDataRequest = /auth_tokens\/token/

const getMockContext = (
  $config: { apiClientId: string; apiClientSecret: string } = {
    apiClientId: 'abcdefg_client_i_d',
    apiClientSecret: 'shhhhhhhhh_1234_super_secret',
  }
) =>
  ({
    $sentry: {
      captureException: jest.fn(),
    },
    $config: $config,
  } as unknown as Context)

const mockInject = jest.fn()

const frozenNow = Date.now()
const frozenSeconds = Math.floor(frozenNow / 1e3)
jest.spyOn(global.Date, 'now').mockReturnValue(frozenNow)
const twelveHoursInSeconds = 12 * 3600
let tokenCount = 1
const getMockTokenResponse = (expires_in = twelveHoursInSeconds) => ({
  access_token: `abcd1234_${tokenCount++}`,
  expires_in,
})

const defaultPromise = Promise.resolve()

describe('api-token.server plugin', () => {
  afterEach(() => {
    process.tokenData = {
      accessToken: '',
      accessTokenExpiry: 0,
    }
    process.tokenFetching = defaultPromise
  })

  describe('successful token retrieval', () => {
    it('should save the token into the process', async () => {
      const mockTokenResponse = getMockTokenResponse()
      mockCreateApiService((axiosMockAdapter) => {
        axiosMockAdapter
          .onPost(matchTokenDataRequest)
          .replyOnce(200, mockTokenResponse)
      })

      await apiTokenPlugin(getMockContext(), mockInject)

      expect(process.tokenData).toMatchObject({
        accessToken: mockTokenResponse.access_token,
        accessTokenExpiry: frozenSeconds + twelveHoursInSeconds,
      })
    })

    it('should re-retrieve the token when about to expire', async () => {
      const mockTokenResponse = getMockTokenResponse(expiryThreshold - 1)
      const nextMockTokenResponse = getMockTokenResponse()
      mockCreateApiService((axiosMockAdapter) => {
        axiosMockAdapter
          .onPost(matchTokenDataRequest)
          .replyOnce(200, mockTokenResponse)

          .onPost(matchTokenDataRequest)
          .replyOnce(200, nextMockTokenResponse)
      })

      await apiTokenPlugin(getMockContext(), mockInject)
      await apiTokenPlugin(getMockContext(), mockInject)

      expect(process.tokenData).toMatchObject({
        accessToken: nextMockTokenResponse.access_token,
        accessTokenExpiry: frozenSeconds + twelveHoursInSeconds,
      })
    })

    it('should not request a new token if the token is not about to expire', async () => {
      const mockTokenResponse = getMockTokenResponse(twelveHoursInSeconds)
      const nextMockTokenResponse = getMockTokenResponse()
      mockCreateApiService((axiosMockAdapter) => {
        axiosMockAdapter
          .onPost(matchTokenDataRequest)
          .replyOnce(200, mockTokenResponse)

          .onPost(matchTokenDataRequest)
          .replyOnce(200, nextMockTokenResponse)
      })

      await apiTokenPlugin(getMockContext(), mockInject)
      await apiTokenPlugin(getMockContext(), mockInject)

      expect(process.tokenData).toMatchObject({
        accessToken: mockTokenResponse.access_token,
        accessTokenExpiry: frozenSeconds + twelveHoursInSeconds,
      })
    })

    it.only('subsequent requests should all block on the same token retrieval promise', async () => {
      /**
       * This test is pretty complicated because we need to simulate
       * multiple requests coming in at the same time with requests
       * to the token API resolving only after the multiple
       * requests have come in. If we didn't cause the request for the
       * token to block until we'd fired off all three requests then
       * the first request could resolve before the other two had a chance
       * to check the mutex and await on the fetching promise.
       *
       * This relies on the behavior of the Node event loop where
       * several async functions called synchronously in succession will exectue
       * up until the first blocking `await` and then return the promise. This allows
       * us to effectively get all three of the async api token plugin function
       * calls up to the first blocking await which will either be the the call to
       * `refreshApiAccessToken` which makes the axios call (blocked by the adapter
       * mock in this test) _or_ awaiting the promise shared by the entire process.
       */
      const mockTokenResponse = getMockTokenResponse()
      const nextMockTokenResponse = getMockTokenResponse()
      let resolveFirstRequestPromise: undefined | ((value: unknown) => void) =
        undefined
      const resolveFirstRequest = async () => {
        while (!resolveFirstRequestPromise) {
          console.log('awaiting request resolvability')
          await new Promise((r) => setTimeout(r, 1))
        }
        resolveFirstRequestPromise({})
      }

      mockCreateApiService((mockAdapter) => {
        mockAdapter
          .onPost(matchTokenDataRequest)
          .replyOnce(async () => {
            console.log('in first request')
            const promise = new Promise((resolve) => {
              resolveFirstRequestPromise = resolve as () => void
            })

            await promise
            console.log('resolving first request')

            return [200, mockTokenResponse]
          })

          .onGet(matchTokenDataRequest)
          .replyOnce(200, nextMockTokenResponse)
      })

      const promises = [
        apiTokenPlugin(getMockContext(), mockInject),
        apiTokenPlugin(getMockContext(), mockInject),
        apiTokenPlugin(getMockContext(), mockInject),
      ]

      await resolveFirstRequest()
      await Promise.all(promises)

      // If the process tokenData still matches the first
      // request's return then we know that all three requests
      // used the same response.
      expect(process.tokenData).toMatchObject({
        accessToken: mockTokenResponse.access_token,
        accessTokenExpiry: frozenSeconds + twelveHoursInSeconds,
      })
    })
  })
})
