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
  async asyncData({ $getApiAccessToken, $config }) {
    const { apiClientId, apiClientSecret } = $config
    const data: unknown = {
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
      const accessToken = await $getApiAccessToken()
      const apiService = createApiService({ accessToken })
      data.apiRes.message = (await apiService.query('rate_limit', {})).data
      data.apiRes.isSuccess = true
    } catch (exc) {
      warn(exc)
      if (exc instanceof TypeError) {
        data.apiRes.message = '$getApiAccessToken does not exist on the client.'
      } else if (exc instanceof AxiosError) {
        data.apiRes.message = `${exc.response.status} ${exc.response.statusText}`
      } else throw exc
    }
    return { data }
  },
})
</script>
