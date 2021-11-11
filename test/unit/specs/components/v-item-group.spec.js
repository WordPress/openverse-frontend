import Vue from 'vue'
import { ref } from '@nuxtjs/composition-api'
import { render, screen } from '@testing-library/vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import userEvent from '@testing-library/user-event'

const TestWrapper = Vue.component('TestWrapper', {
  components: { VItemGroup, VItem },
  setup() {
    const items = new Array(4).fill(null).map((_, i) => ({
      id: i,
      label: `Item ${i}`,
    }))

    const selectedItem = ref(items[0])

    return { items, selectedItem }
  },
  template: `
    <VItemGroup v-bind="$attrs">
      <VItem
        v-for="(item) in items"
        :key="item.id"
        :selected="selectedItem.id === item.id"
        @click="selectedItem = item"
      >
        {{ item.label }}
      </VItem>
    </VItemGroup>
  `,
})

describe('VItemGroup', () => {
  it('should render buttons with the appropriate roles', () => {
    render(TestWrapper)
    expect(screen.queryByRole('list')).not.toBe(null)
    const items = screen.queryAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items.every((item) => item.tagName === 'BUTTON')).toBe(true)
  })

  it('should render functional buttons', async () => {
    const { container } = render(TestWrapper)
    const [, secondItem] = screen.queryAllByRole('listitem')
    expect(container.querySelector('[aria-pressed="true"]')).not.toBe(
      secondItem
    )
    await userEvent.click(secondItem)
    expect(container.querySelector('[aria-pressed="true"]')).toBe(secondItem)
  })
})
