import VButtonGroup from '~/components/VButtonGroup'
import VButton from '~/components/VButton'

export default {
  title: 'Components/VButtonGroup',
  component: VButtonGroup,
  argTypes: {
    buttonCount: {
      type: 'number',
      default: 2,
    },
  },
}

const DefaultStory = (args, { argTypes }) => ({
  components: { VButtonGroup, VButton },
  template: `
    <VButtonGroup>
      <VButton v-for="i in $props.buttonCount" :key="i">Button {{ i }}</VButton>
    </VButtonGroup>
  `,
  props: Object.keys(argTypes),
})

export const Default = DefaultStory.bind({})
