import { createApiService } from '~/data/api-service'
import { log } from '~/utils/console'

import type { Context, Plugin } from '@nuxt/types'

/* Module level state */

const tokenData = {
  accessToken: '', // '' denotes non-existent key
  accessTokenExpiry: 0, // 0 denotes non-existent key
}

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
  return tokenData.accessTokenExpiry - expiryThreshold <= currTimestamp()
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
  const res = await apiService.post<TokenResponse>(
    'auth_tokens/token',
    formData
  )
  log('Response data', res.data)
  tokenData.accessToken = res.data.access_token
  tokenData.accessTokenExpiry = currTimestamp() + res.data.expires_in
}

/**
 * Get an async function that always returns a valid, automatically-refreshed
 * API access token.
 * @param context - the Nuxt context
 */
const getApiAccessToken =
  (context: Context) => async (): Promise<string | undefined> => {
    const { apiClientId, apiClientSecret } = context.$config
    if (apiClientId && apiClientSecret) {
      if (isApiAccessTokenExpiring())
        await refreshApiAccessToken(
          context.$config.apiClientId,
          context.$config.apiClientSecret
        )
      return tokenData.accessToken
    }
    return undefined
  }

/* Plugin */

const apiToken: Plugin = async (context, inject) => {
  inject('getApiAccessToken', getApiAccessToken(context))
}
export default apiToken
