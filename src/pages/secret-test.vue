<template>
  <VContentPage>
    <h1>{{ $t('secret-test-page.title') }}</h1>

    <h2>{{ $t('secret-test-page.rate-limit.title') }}</h2>
    <i18n path="secret-test-page.rate-limit.desc" tag="p">
      <template #rate-limit>
        <code>{{ $t('secret-test-page.rate-limit.endpoint') }}</code>
      </template>
    </i18n>
    <pre><code>{{ data }}</code></pre>
    <p>
      {{
        $t(
          `secret-test-page.suggestions.${
            data.apiRes.isSuccess ? 'success' : 'failure'
          }`
        )
      }}
    </p>
  </VContentPage>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { AxiosError } from 'axios'

import VContentPage from '~/components/VContentPage.vue'

import { createApiService } from '../data/api-service'
import { warn } from '../utils/console'

export default defineComponent({
  name: 'VSecretTest',
  components: {
    VContentPage,
  },
  async asyncData({ $openverseApiToken, $config }) {
    const { apiClientId, apiClientSecret } = $config
    const data = {
      secrets: {
        apiClientId,
        apiClientSecret,
      },
      apiRes: {
        message: { error: 'Something is not working properly.' },
        isSuccess: false,
      },
    }
    try {
      const apiService = createApiService({ accessToken: $openverseApiToken })
      data.apiRes.message = (await apiService.query('rate_limit/', {}))
        .data as typeof data.apiRes.message
      data.apiRes.isSuccess = true
    } catch (exc) {
      warn(exc)
      if (exc instanceof AxiosError) {
        data.apiRes.message = {
          error: `${exc.response?.status} ${exc.response?.statusText}`,
        }
      } else throw exc
    }
    return { data }
  },
})
</script>
