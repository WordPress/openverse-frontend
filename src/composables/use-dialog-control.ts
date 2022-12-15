import {
  reactive,
  ref,
  Ref,
  SetupContext,
  watch,
} from "@nuxtjs/composition-api"

import { useBodyScrollLock } from "~/composables/use-body-scroll-lock"

export function useDialogControl({
  visibleRef,
  nodeRef,
  shouldLockBodyScrollRef = ref(true),
  emit,
}: {
  visibleRef?: Ref<boolean>
  nodeRef?: Ref<HTMLElement | null>
  shouldLockBodyScrollRef?: Ref<boolean>
  emit: SetupContext["emit"]
}) {
  const internalVisibleRef =
    typeof visibleRef === "undefined" ? ref(false) : visibleRef

  const triggerA11yProps = reactive({
    "aria-expanded": false,
    "aria-haspopup": "dialog",
  })

  watch(internalVisibleRef, (visible) => {
    triggerA11yProps["aria-expanded"] = visible
    if (visible) {
      open()
    } else {
      close()
    }
  })

  const open = () => {
    console.log(
      "opening, setting internal visible to true",
      internalVisibleRef.value,
      visibleRef?.value
    )
    internalVisibleRef.value = true
    lock()
    console.log(
      "now, internal:",
      internalVisibleRef.value,
      "prop: ",
      visibleRef?.value
    )
    if (typeof visibleRef === "undefined") {
      emit("open")
    }
  }

  const close = () => {
    internalVisibleRef.value = false
    unlock()
    if (typeof visibleRef === "undefined") {
      emit("open")
    }
  }

  const { lock, unlock } =
    shouldLockBodyScrollRef.value && nodeRef
      ? useBodyScrollLock({ nodeRef })
      : {
          lock: () => {
            /** */
          },
          unlock: () => {
            /** */
          },
        }
  const onTriggerClick = () => {
    if (internalVisibleRef.value) {
      close()
    } else {
      open()
    }
  }

  return {
    close,
    open,
    onTriggerClick,
    triggerA11yProps,
  }
}
