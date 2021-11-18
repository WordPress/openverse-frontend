import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VPopover from '~/components/VPopover/VPopover.vue'
import VButton from '~/components/VButton.vue'

import { ref } from '@nuxtjs/composition-api'

import close from '~/assets/icons/close.svg'
import pause from '~/assets/icons/pause.svg'
import play from '~/assets/icons/play.svg'
import replay from '~/assets/icons/replay.svg'

const icons = [close, pause, play, replay]

export default {
  component: VItemGroup,
  title: 'Components/VItemGroup',
  args: {
    direction: {
      type: 'radio',
      options: ['vertical', 'horizontal'],
    },
    bordered: 'boolean',
  },
}

const DefaultStory = (args, { argTypes }) => ({
  template: `
    <div>
      <p>
        This is a "radio" style list group. Only a single element can be selected at a time.
      </p>
      <div style="width: 300px">
        <VItemGroup v-bind="$props" type="radiogroup">
          <VItem
            v-for="(item) in items"
            :key="item.id"
            :selected="selectedItem.id === item.id"
            @click="selectedItem = item"
            size="medium"
          >
            <VIcon :icon-path="item.icon" /> {{ item.label }}
          </VItem>
        </VItemGroup>
      </div>
    </div>
  `,
  components: { VItemGroup, VItem, VIcon },
  props: Object.keys(argTypes),
  setup() {
    const items = new Array(icons.length).fill(null).map((_, i) => ({
      id: i,
      label: `Item ${i}`,
      icon: icons[i],
    }))

    const selectedItem = ref(items[0])

    return { items, selectedItem }
  },
})

export const Default = DefaultStory.bind({})
Default.args = {
  direction: 'vertical',
  bordered: true,
}

const MenuStory = (args, { argTypes }) => ({
  template: `
    <div>
      <p>
        This is a "menu" style item group. Multiple items can be active at a time and all have the "menuitemcheckbox" role.
      </p>
      <div style="width: 300px">
        <VItemGroup v-bind="$props" type="menu">
          <VItem
            v-for="(item) in items"
            :key="item.id"
            :selected="selectedItemIds.has(item.id)"
            @click="toggleItem(item)"
            size="medium"
          >
            <VIcon :icon-path="item.icon" /> {{ item.label }}
          </VItem>
        </VItemGroup>
      </div>
    </div>
  `,
  components: { VItemGroup, VItem, VIcon },
  props: Object.keys(argTypes),
  setup() {
    const items = new Array(icons.length).fill(null).map((_, i) => ({
      id: i,
      label: `Item ${i}`,
      icon: icons[i],
    }))

    const selectedItemIds = ref(/** @type {Set<number>} */ (new Set()))

    const toggleItem = (item) => {
      if (selectedItemIds.value.delete(item.id)) {
        selectedItemIds.value = new Set(selectedItemIds.value)
      } else {
        selectedItemIds.value = new Set(selectedItemIds.value.add(item.id))
      }
    }

    return { items, selectedItemIds, toggleItem }
  },
})

export const Menu = MenuStory.bind({})
Menu.args = {
  direction: 'vertical',
  bordered: true,
}

const PopoverStory = (args, { argTypes }) => ({
  template: `
    <VPopover>
      <template #trigger="{ a11yProps, visible }">
        <VButton v-bind="a11yProps" :pressed="visible">{{ visible ? 'Close menu' : 'Open menu' }}</VButton>
      </template>

      <VItemGroup v-bind="$props" type="menu">
        <VItem
          v-for="(item) in items"
          :key="item.id"
          :selected="selectedItemIds.has(item.id)"
          @click="toggleItem(item)"
          size="medium"
        >
          <VIcon :icon-path="item.icon" /><span :class="{ 'pe-2': $props.direction === 'vertical' }">{{ item.label }}</span>
        </VItem>
    </VItemGroup>
    </VPopover>
  `,
  components: { VButton, VPopover, VItem, VItemGroup, VIcon },
  props: Object.keys(argTypes),
  setup() {
    const items = new Array(icons.length).fill(null).map((_, i) => ({
      id: i,
      label: `Item ${i}`,
      icon: icons[i],
    }))

    const selectedItemIds = ref(/** @type {Set<number>} */ (new Set()))

    const toggleItem = (item) => {
      if (selectedItemIds.value.delete(item.id)) {
        selectedItemIds.value = new Set(selectedItemIds.value)
      } else {
        selectedItemIds.value = new Set(selectedItemIds.value.add(item.id))
      }
    }

    return { items, selectedItemIds, toggleItem }
  },
})

export const Popover = PopoverStory.bind({})
Popover.args = {
  direction: 'vertical',
  bordered: false,
}
