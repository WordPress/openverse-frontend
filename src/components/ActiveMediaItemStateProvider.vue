<template>
  <div><slot /></div>
</template>

<script setup lang="ts">
import { ref, provide, InjectionKey, Ref } from '#app'

export type ActiveMedia = {
  type: 'audio' | 'image' | null,
  id: string | null,
}

export type ActiveMediaState = {
  activeMedia: Ref<ActiveMedia>,
  setActiveMedia: (nextActiveMedia: ActiveMedia) => void,
  unsetActiveMedia: () => void,
}

export const activeMediaStateKey: InjectionKey<ActiveMediaState> = Symbol(
  'activeMediaStateKey'
)

const defaultActiveMedia: ActiveMedia = { type: null, id: null }

const activeMedia = ref<ActiveMedia>(defaultActiveMedia)

const setActiveMedia = (nextActiveMedia: ActiveMedia) =>
  (activeMedia.value = nextActiveMedia)

const unsetActiveMedia = () => (activeMedia.value = defaultActiveMedia)

provide(activeMediaStateKey, { activeMedia, setActiveMedia, unsetActiveMedia })
</script>
