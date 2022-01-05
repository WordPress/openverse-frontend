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
    isSelected: {
      control: { type: 'switch' },
    },
  },
}

const VContentLinkStory = (args, { argTypes }) => ({
  template: `<VContentLink v-bind="$props" />`,
  components: { VContentLink },
  props: Object.keys(argTypes),
})

const TwoVContentLinkStory = () => ({
  template: `
  <div class="grid grid-cols-2 gap-4">
    <VContentLink
      v-for="(type, key) in types"
      :key="key"
      :media-type="type.mediaType"
      :results-count="type.resultsCount"
      :is-selected="selected == type.mediaType"
      @selected="onSelected"/>
  </div>
  `,
  components: { VContentLink },
  data() {
    return {
      types: [
        { mediaType: 'image', resultsCount: 654321 },
        { mediaType: 'audio', resultsCount: 123456 },
      ],
      selected: 'audio',
    }
  },
  methods: {
    onSelected(mediaType) {
      this.selected = mediaType
    },
  },
})

export const Default = VContentLinkStory.bind({})
Default.args = {
  mediaType: 'image',
  resultsCount: 123456,
  isSelected: false,
}

export const Mobile = TwoVContentLinkStory.bind({})
Mobile.parameters = {
  viewport: { defaultViewport: 'mob' },
}
