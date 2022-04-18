import { render } from '@testing-library/vue'
import Vuei18n from 'vue-i18n'

import { createLocalVue } from '@vue/test-utils'

import VBoxLayout from '~/components/VAudioTrack/layouts/VBoxLayout.vue'

const enMessages = require('~/locales/en.json')

const i18n = new Vuei18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: enMessages },
})

describe('VBoxLayout', () => {
  let options = null
  let localVue
  let props = {
    audio: {
      id: 'e19345b8-6937-49f7-a0fd-03bf057efc28',
      title: 'La vie des bêtes',
      foreign_landing_url: 'https://www.jamendo.com/track/11188',
      creator: 'AS-POTIRONT!',
      creator_url: 'https://www.jamendo.com/artist/264/as-potiront',
      url: 'https://mp3d.jamendo.com/download/track/11188/mp32',
      license: 'by-nc-sa',
      license_version: '2.5',
      license_url: 'https://creativecommons.org/licenses/by-nc-sa/2.5/',
      provider: 'jamendo',
      source: 'jamendo',
      filetype: 'mp32',
      tags: [
        {
          name: 'vocal',
        },
        {
          name: 'male',
        },
        {
          name: 'speed_medium',
        },
        {
          name: 'party',
        },
        {
          name: 'cuivres',
        },
      ],
      fields_matched: ['tags.name'],
      thumbnail:
        'https://localhost:8000/v1/audio/e19345b8-6937-49f7-a0fd-03bf057efc28/thumb',
      waveform:
        'https://localhost:8000/v1/audio/e19345b8-6937-49f7-a0fd-03bf057efc28/waveform',
      genres: ['pop', 'rock', 'manouche'],
      detail_url:
        'http://localhost:8000/v1/audio/e19345b8-6937-49f7-a0fd-03bf057efc28',
      related_url:
        'http://localhost:8000/v1/audio/e19345b8-6937-49f7-a0fd-03bf057efc28/recommendations',
    },
    size: 'm',
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuei18n)
    options = {
      propsData: props,
      mocks: { $nuxt: { context: { i18n } } },
      localVue,
      i18n,
    }
  })

  it('renders audio title, license and category in v-box-layout', () => {
    props.audio.category = 'music'
    const screen = render(VBoxLayout, options)
    screen.getByText(props.audio.title)
    screen.getByLabelText('Attribution-NonCommercial-Share-Alike')
    screen.getByText('Music')
  })

  it('should not render category string if category is null', () => {
    props.audio.category = null
    const screen = render(VBoxLayout, options)
    const categoryLabel = screen.queryByText('Music')
    expect(categoryLabel).toBeNull()
  })
})
