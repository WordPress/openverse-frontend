/**
 * Stores properties common to all media items. This is extended by interfaces
 * for individual media
 */
export interface Media {
  id: string
  title: string

  creator: string
  creator_url: string

  url: string
  foreign_landing_url: string

  license: string
  license_version: string
  license_url: string
}
