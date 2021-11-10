import VCheckbox from '~/components/VCheckbox'
import License from '~/components/License/License'

export default {
  title: 'Components/Checkbox',
  component: VCheckbox,
  argTypes: {
    value: 'boolean',
    label: {
      type: 'string',
      control: {
        type: 'text',
      },
    },
    default: {
      type: 'number',
      control: { type: 'text' },
    },
    disabled: 'boolean',
  },
}

const SimpleCheckboxStory = (args, { argTypes }) => ({
  template: `<VCheckbox v-bind="$props" id="simple" @change="onChange" >Code is Poetry</VCheckbox>`,
  components: { Checkbox: VCheckbox },
  props: Object.keys(argTypes),
  methods: {
    onChange() {
      window.alert(`Checkbox checked!`)
    },
  },
})

const DisabledCheckboxStory = (args, { argTypes }) => ({
  template: `<VCheckbox v-bind="$props" id="disabled" disabled="true" @change="onChange" >Use commercially</VCheckbox>`,
  components: { VCheckbox },
  props: Object.keys(argTypes),
})

const LicenseCheckboxStory = (args, { argTypes }) => ({
  template: `<VCheckbox v-bind="$props" id="license" @change="onChange"><License license="by-nc" /></VCheckbox>`,
  components: { VCheckbox, License },
  props: Object.keys(argTypes),
  methods: {
    onChange() {
      window.alert('License checkbox checked!')
    },
  },
})

export const Default = SimpleCheckboxStory.bind({})
Default.args = {}

export const DisabledCheckbox = DisabledCheckboxStory.bind({})
DisabledCheckbox.args = {}

export const LicenseCheckbox = LicenseCheckboxStory.bind({})
LicenseCheckbox.args = {}
