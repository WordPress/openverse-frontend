import { useNav } from '~/store/nav'

/**
 * If the URL contains a referral parameter pointing containing
 * 'creativecommons.org' the migration notice needs to be displayed. This
 * plugin checks the presence of the param and updates the store.
 */
export default function ({ query }) {
  if (query.referrer) {
    const navStore = useNav()
    navStore.isReferredFromCc = query.referrer.includes('creativecommons.org')
  }
}
