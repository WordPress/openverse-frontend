import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'

export default {
  component: VLogoLoader,
  title: 'Components/VLogoLoader',
  argTypes: {
    status: {
      default: 'idle',
      options: ['loading', 'idle'],
      control: { type: 'radio' },
    },
    loadingLabel: {
      control: { type: 'text' },
    },
  },
}

const SimpleLoaderStory = (_, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>
      <VLogoLoader v-bind="$props" :key="$props.status" />
    </div>
  `,
  components: { VLogoLoader },
  setup() {},
})

export const Default = SimpleLoaderStory.bind({})
Default.args = {
  status: 'idle',
  loadingLabel: 'Loading images',
}

export const Loading = SimpleLoaderStory.bind({})
Loading.args = {
  status: 'loading',
  loadingLabel: 'Loading images',
}
