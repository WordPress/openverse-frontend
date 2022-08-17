<script lang="ts">
import {
  ComponentInstance,
  defineComponent,
  inject,
  onMounted,
  Ref,
  ref,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'

import { ALL_MEDIA, searchPath, SupportedSearchType } from '~/constants/media'
import useSearchType from '~/composables/use-search-type'
import { useMediaStore } from '~/stores/media'
import { useSearchStore } from '~/stores/search'

import VMobileMenuModal from '~/components/VContentSwitcher/VMobileMenuModal.vue'
import VSearchTypePopover from '~/components/VContentSwitcher/VSearchTypePopover.vue'
import VDesktopPageMenu from '~/components/VHeader/VPageMenu/VDesktopPageMenu.vue'
import VMobilePageMenu from '~/components/VHeader/VPageMenu/VMobilePageMenu.vue'

export default defineComponent({
  name: 'VHeaderMenu',
  components: {
    VMobileMenuModal,
    VSearchTypePopover,
    VDesktopPageMenu,
    VMobilePageMenu,
  },
  props: {
    isSearchRoute: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const isMinScreenMd: Ref<boolean> = inject('isMinScreenMd', ref(false))
    const menuModalRef = ref<ComponentInstance | null>(null)
    const content = useSearchType()
    const { app } = useContext()
    const mediaStore = useMediaStore()
    const searchStore = useSearchStore()
    const router = useRouter()

    const isMounted = ref(false)
    onMounted(() => {
      isMounted.value = true
    })

    const selectSearchType = async (type: SupportedSearchType) => {
      menuModalRef.value?.closeMenu()
      content.setActiveType(type)

      const newPath = app.localePath({
        path: searchPath(type),
        query: searchStore.searchQueryParams,
      })
      router.push(newPath)

      const shouldFetchMedia =
        type === ALL_MEDIA
          ? mediaStore.resultCountsPerMediaType.every(
              (mediaCount) => mediaCount[1] === 0
            )
          : mediaStore.results[type].count === 0

      if (shouldFetchMedia) {
        await mediaStore.fetchMedia()
      }
    }

    return {
      isMinScreenMd,
      menuModalRef,
      isMounted,

      content,
      selectSearchType,
    }
  },
  render(h) {
    if (!this.isSearchRoute) {
      return this.isMinScreenMd && this.isMounted
        ? h(VDesktopPageMenu)
        : h(VMobilePageMenu)
    } else if (this.isMinScreenMd && this.isMounted) {
      return h('div', { class: 'flex flex-grow justify-between gap-x-2' }, [
        h(VDesktopPageMenu),
        h(VSearchTypePopover, {
          props: { activeItem: this.content.activeType.value },
          ref: 'menuModalRef',
          on: { select: this.selectSearchType },
        }),
      ])
    } else {
      return h(VMobileMenuModal, {
        ref: 'menuModalRef',
        props: { activeItem: this.content.activeType.value },
        on: {
          select: this.selectSearchType,
        },
      })
    }
  },
})
</script>
