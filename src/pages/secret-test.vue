<template>
  <VContentPage>
    <h1>{{ $t('secret-test-page.title') }}</h1>

    <h2>{{ $t('secret-test-page.rate-limit.title') }}</h2>
    <i18n path="secret-test-page.rate-limit.desc" tag="p">
      <template #rate-limit>
        <code>{{ $t('secret-test-page.rate-limit.endpoint') }}</code>
      </template>
    </i18n>
    <pre><code>{{ message }}</code></pre>
    <p>
      {{
        $t(`secret-test-page.suggestions.${isSuccess ? 'success' : 'failure'}`)
      }}
    </p>
  </VContentPage>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import VContentPage from '~/components/VContentPage.vue'

import { createApiService } from '../data/api-service'

export default defineComponent({
  name: 'VSecretTest',
  components: {
    VContentPage,
  },
  async asyncData({ $config }) {
    const { apiAccessToken: accessToken = undefined } = $config
    let message: string
    let isSuccess = false
    if (!accessToken) {
      const data = { error: 'Access token is undefined' }
      message = JSON.stringify(data, null, 2)
    } else {
      const apiService = createApiService({ accessToken })
      const data = (await apiService.query('rate_limit', {})).data
      message = JSON.stringify(data, null, 2)
      isSuccess = true
    }
    return { message, isSuccess }
  },
})
</script>
