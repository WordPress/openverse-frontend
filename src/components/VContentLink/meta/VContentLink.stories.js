import VContentLink from '~/components/VContentLink/VContentLink.vue'

export default {
  title: 'Components/VContentLink',
  component: VContentLink,
  argTypes: {
    mediaType: {
      options: ['audio', 'image'],
      control: { type: 'radio' },
    },
    resultsCount: {
      control: { type: 'number' },
    },
  },
}

const VContentLinkStory = (args, { argTypes }) => ({
  template: `<VContentLink v-bind="$props" />`,
  components: { VContentLink },
  props: Object.keys(argTypes),
})

export const Default = VContentLinkStory.bind({})
Default.args = {
  mediaType: 'image',
  resultsCount: 123456,
}
