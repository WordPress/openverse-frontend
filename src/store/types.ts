import type {
  AudioDetail,
  DetailFromMediaType,
  ImageDetail,
  MediaDetail,
} from '~/models/media'
import type { FetchState } from '~/composables/use-fetch-state'
type FrontendMediaType = MediaDetail['frontendMediaType']

export interface MediaResult<
  T extends MediaDetail | MediaDetail[] | Record<string, MediaDetail>
> {
  result_count: number
  page_count: number
  page_size: number
  page: number
  results: T
}

export interface ApiQueryParams {
  q?: string
  license?: string
  license_type?: string
  extension?: string
  size?: string
  aspect_ratio?: string
  searchBy?: string
  categories?: string
  source?: string
  duration?: string
  mature?: string
  page?: string
}
export type ApiQueryFilters = Omit<ApiQueryParams, 'q'>
export type ApiQueryKeys = keyof ApiQueryFilters

export interface Tag {
  name: string
  provider?: string
}

export interface FilterItem {
  code: string
  name: string
  checked: boolean
}

export interface Filters {
  licenses: FilterItem[]
  licenseTypes: FilterItem[]
  audioCategories: FilterItem[]
  imageCategories: FilterItem[]
  audioExtensions: FilterItem[]
  imageExtensions: FilterItem[]
  aspectRatios: FilterItem[]
  durations: FilterItem[]
  sizes: FilterItem[]
  audioProviders: FilterItem[]
  imageProviders: FilterItem[]
  searchBy: FilterItem[]
  mature: FilterItem[]
}
export type FilterCategory = keyof Filters

export type MediaStoreResult<T extends FrontendMediaType> = {
  count: number
  pageCount: number
  page: number | undefined
  items: Record<MediaDetail['id'], DetailFromMediaType<T>>
}

export interface MediaState {
  results: {
    audio: MediaStoreResult<'audio'>
    image: MediaStoreResult<'image'>
  }
  fetchState: {
    audio: FetchState
    image: FetchState
  }
  audio: AudioDetail | null
  image: ImageDetail | null
}
