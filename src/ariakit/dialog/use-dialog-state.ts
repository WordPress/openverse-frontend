import {
  DisclosureState,
  useDisclosureState,
  UseDisclosureStateOptions,
} from '~/ariakit/disclosure/use-disclosure-state'

/**
 * While this module is current just a pass-through for `useDisclosureState`
 * it exists to maintain parity with the Ariakit implementation and to make
 * it easier to implement additional dialog behaviors over top the disclosure
 * state ones in the future without having to update usage-sites.
 */
export const useDialogState = useDisclosureState
export type DialogState = DisclosureState
export type UseDialogStateOptions = UseDisclosureStateOptions
