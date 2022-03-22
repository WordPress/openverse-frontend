import type { SupportedMediaType } from '~/constants/media'

export interface Tag {
  name: string
}

/**
 * Stores properties common to all media items. This is extended by interfaces
 * for individual media.
 */
export interface Media {
  id: string
  title: string

  creator: string
  creator_url?: string

  url: string
  foreign_landing_url: string

  license: string
  license_version: string
  license_url: string
  attribution: string // TODO: check if it exists for all media items

  frontendMediaType: SupportedMediaType

  provider: string
  source?: string

  detail_url: string
  related_url: string

  tags: Tag[]
}

export interface ImageDetail extends Media {
  frontendMediaType: 'image'

  fields_matched?: string[]
}

export interface AudioDetail extends Media {
  frontendMediaType: 'audio'

  thumbnail?: string
  audio_set?: string
  genres?: string[]
  duration?: number
  bit_rate?: number
  sample_rate?: number
  alt_files?: { provider: string; filetype: string }[]
  filetype?: string
  peaks?: number[]
}

export type MediaDetail = ImageDetail | AudioDetail

export type DetailFromMediaType<T extends SupportedMediaType> =
  T extends 'image' ? ImageDetail : T extends 'audio' ? AudioDetail : never
