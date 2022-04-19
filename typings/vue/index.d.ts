declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

import type { Details as UADetails } from 'express-useragent'

declare module 'vue/types/vue' {
  export interface Vue {
    $ua: UADetails | null
  }
}
