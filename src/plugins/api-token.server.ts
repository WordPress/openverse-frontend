import { createApiService } from '~/data/api-service'
import { log, error } from '~/utils/console'

import type { Context, Plugin } from '@nuxt/types'

/* Process level state */

declare let process: NodeJS.Process & {
  tokenData: {
    accessToken: string
    accessTokenExpiry: number
  }

  tokenFetching: Promise<void>
}

/**
 * Store the plugin's "state" on the `process` to prevent it being
 * thrown out in dev mode when the plugin's module
 * is mysteriously reloaded (cache-busted) for each request.
 */
process.tokenData = process.tokenData || {
  accessToken: '', // '' denotes non-existent key
  accessTokenExpiry: 0, // 0 denotes non-existent key
}

process.tokenFetching = process.tokenFetching || Promise.resolve()

/* Token refresh logic */

interface TokenResponse {
  access_token: string
  expires_in: number
}

/**
 * Get the timestamp as the number of seconds from the UNIX epoch.
 * @returns the UNIX timestamp with a resolution of one second
 */
const currTimestamp = (): number => Math.floor(Date.now() / 1e3)

/**
 * Check whether the access token in `tokenData` is set to expire soon.
 * @returns whether the stored access token is about to expire
 */
const isApiAccessTokenExpiring = (): boolean => {
  const expiryThreshold = 5 // seconds
  const aboutToExpire =
    process.tokenData.accessTokenExpiry - expiryThreshold <= currTimestamp()
  log(`isApiAccessTokenExpiring: aboutToExpire=${aboutToExpire}`)
  return aboutToExpire
}

/**
 * Update `tokenData` with  the new access token given the client ID and secret.
 * @param clientId - the client ID of the application issued by the API
 * @param clientSecret - the client secret of the application issued by the API
 */
const refreshApiAccessToken = async (
  clientId: string,
  clientSecret: string
) => {
  log('Refreshing access token...')
  const formData = new URLSearchParams()
  formData.append('client_id', clientId)
  formData.append('client_secret', clientSecret)
  formData.append('grant_type', 'client_credentials')

  const apiService = createApiService()
  try {
    const res = await apiService.post<TokenResponse>(
      'auth_tokens/token',
      formData
    )
    log('Successfully retrieved API token')
    process.tokenData.accessToken = res.data.access_token
    process.tokenData.accessTokenExpiry = currTimestamp() + res.data.expires_in
    log(`Next token expiry for worker expiry=${res.data.expires_in}`)
  } catch (e) {
    /**
     * If an error occurs, serve the current request (and any pending)
     * anonymously and hope it works. By setting the expiry to 0 we queue
     * up another token fetch attempt for the next request.
     */
    error('Unable to retrieve API token, clearing existing token', e)
    process.tokenData.accessToken = ''
    process.tokenData.accessTokenExpiry = 0
  }
}

/**
 * Get an async function that always returns a valid, automatically-refreshed
 * API access token.
 *
 * Uses the promise generated by the api token fetch as the "lock" for subsequent
 * requests within the same worker process.
 *
 * @param context - the Nuxt context
 */
const getApiAccessToken = async (
  context: Context
): Promise<string | undefined> => {
  const { apiClientId, apiClientSecret } = context.$config
  if (apiClientId && apiClientSecret) {
    log('We have client information')
    if (isApiAccessTokenExpiring()) {
      process.tokenFetching = refreshApiAccessToken(
        apiClientId,
        apiClientSecret
      )
    }
    log('awaiting the fetching of the api token to resolve')
    await process.tokenFetching
    log('done waiting for the token, moving on now...')

    return process.tokenData.accessToken
  }
  return undefined
}

/* Plugin */

declare module '@nuxt/types' {
  interface Context {
    $openverseApiToken: string
  }
}

const apiToken: Plugin = async (context, inject) => {
  const openverseApiToken = await getApiAccessToken(context)

  if (openverseApiToken) {
    log('injecting openverseApiToken into request context')
  } else {
    log('using empty openverseApiToken')
  }

  inject('openverseApiToken', openverseApiToken || '')
}
export default apiToken
