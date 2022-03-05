import type { SupportedMediaType } from '~/constants/media'

export interface Tag {
  name: string
}

export interface ApiMedia {
  id: string
  title: string

  creator: string
  creator_url: string

  url: string
  foreign_landing_url: string

  license: string
  license_version: string
  license_url: string

  tags?: Tag[]
}

/**
 * Stores properties common to all media items. This is extended by interfaces
 * for individual media
 */
export interface Media extends ApiMedia {
  frontendMediaType: SupportedMediaType

  tags: Tag[]
}
