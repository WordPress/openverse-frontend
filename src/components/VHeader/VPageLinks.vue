<template>
  <VItemGroup
    v-if="variant === 'itemgroup'"
    class="min-w-50 mt-2"
    :bordered="false"
    :show-check="false"
  >
    <VItem
      v-for="(page, i) of allPages"
      :key="i"
      as="VLink"
      :is-first="i === 0"
      :selected="currentPage === page.id"
      :href="page.link"
      class="w-full"
      @click="onClick(page.link)"
    >
      <div class="flex flex-row">
        <span class="pe-2">{{ $t(page.name) }}</span>
        <VIcon
          v-if="isLinkExternal(page)"
          :icon-path="externalLinkIcon"
          :size="5"
          class="mb-0.5 self-center"
        />
      </div>
    </VItem>
  </VItemGroup>
  <ul
    v-else
    :class="
      mode === 'light' ? 'text-dark-charcoal' : 'bg-dark-charcoal text-white'
    "
  >
    <VNavLink
      v-for="page in allPages"
      :key="page.id"
      :link="page.link"
      :mode="mode"
      :is-active="currentPage === page.id"
      :class="navLinkClasses"
      @click="onClick(page.link)"
      >{{ $t(page.name) }}</VNavLink
    >
  </ul>
</template>

<script lang="ts">
import {
  type PropType,
  defineComponent,
  useRoute,
} from "@nuxtjs/composition-api"

import usePages from "~/composables/use-pages"

import VItemGroup from "~/components/VItemGroup/VItemGroup.vue"
import VItem from "~/components/VItemGroup/VItem.vue"
import VIcon from "~/components/VIcon/VIcon.vue"
import VNavLink from "~/components/VNavLink/VNavLink.vue"

import externalLinkIcon from "~/assets/icons/external-link.svg"

export default defineComponent({
  name: "VPageLinks",
  components: {
    VIcon,
    VItem,
    VItemGroup,
    VNavLink,
  },
  props: {
    /**
     * In `dark` mode (in the modal), the links are white and the background is dark charcoal.
     * In `light` mode, the links are dark charcoal and the background is transparent.
     *
     * @default 'light'
     */
    mode: {
      type: String as PropType<"light" | "dark">,
      default: "light",
    },
    /**
     * Pass the tailwind classes to style the nav links.
     *
     * @default ''
     */
    navLinkClasses: {
      type: String,
      default: "",
    },
    variant: {
      type: String as PropType<"links" | "itemgroup">,
      default: "links",
    },
  },
  setup(_, { emit }) {
    const { all: allPages, current: currentPage } = usePages(true)
    const route = useRoute()

    const onClick = (link: string) => {
      if (link === route.value.path) {
        emit("close")
      }
    }

    const isLinkExternal = (item: typeof allPages[number]) =>
      !item.link.startsWith("/")

    return {
      allPages,
      currentPage,
      onClick,
      isLinkExternal,
      externalLinkIcon,
    }
  },
})
</script>
