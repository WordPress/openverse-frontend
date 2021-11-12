import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

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
    <div style="width: 300px">
      <VItemGroup v-bind="$props">
        <VItem
          v-for="(item) in items"
          :key="item.id"
          :selected="selectedItem.id === item.id"
          @click="selectedItem = item"
          :direction="$props.direction"
          size="large"
        >
          <VIcon :icon-path="item.icon" /> {{ item.label }}
        </VItem>
      </VItemGroup>
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
