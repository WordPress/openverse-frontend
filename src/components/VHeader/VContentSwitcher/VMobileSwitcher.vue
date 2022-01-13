<template>
  <VModal
    ref="modalRef"
    :label="$t('header.filter-button.simple')"
    mode="full"
    class="flex justify-center"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #trigger="{ a11yProps, visible }">
      <slot
        name="content-switcher-button"
        :a11y-props="a11yProps"
        :visible="visible"
      />
    </template>
    <template #default>
      <nav class="p-4">
        <slot name="content-switcher-content" />
        <slot name="page-switcher-content" />
      </nav>
    </template>
  </VModal>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

import VModal from '~/components/VModal/VModal.vue'

export default {
  name: 'VMobileSwitcher',
  components: { VModal },
  setup() {
    const modalRef = ref(null)
    const closeMenu = () => {
      modalRef.value?.close()
    }
    return {
      modalRef,
      closeMenu,
    }
  },
}
</script>
