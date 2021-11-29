import { ref, shallowRef, unref, watch } from '@nuxtjs/composition-api'
import { useEventListener } from '~/composables/use-event-listener'

const defaultWindow =
  typeof window === 'undefined' || !('localStorage' in window)
    ? undefined
    : window

export const StorageSerializers = {
  boolean: {
    read: (v) => v === 'true',
    write: (v) => String(v),
  },
  any: {
    read: (v) => v,
    write: (v) => String(v),
  },
  string: {
    read: (v) => v,
    write: (v) => String(v),
  },
}

/**
 * Reactive LocalStorage.
 *
 * @see https://vueuse.org/useStorage
 * @param {string} key
 * @param {MaybeRef<T>} initialValue
 * @param storage
 * @param options
 */
export function useStorage(
  key,
  initialValue,
  storage = defaultWindow?.localStorage,
  options = {}
) {
  const {
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window = defaultWindow,
    onError = (e) => {
      console.error(e)
    },
  } = options

  const rawInit = unref(initialValue)

  const type =
    rawInit == null
      ? 'any'
      : typeof rawInit === 'boolean'
      ? 'boolean'
      : typeof rawInit === 'string'
      ? 'string'
      : 'any'

  const data = (shallow ? shallowRef : ref)(initialValue)
  const serializer = options.serializer ?? StorageSerializers[type]

  function read(event) {
    if (!storage || (event && event.key !== key)) return

    try {
      const rawValue = event ? event.newValue : storage.getItem(key)
      if (rawValue == null) {
        data.value = rawInit
        if (writeDefaults && rawInit !== null)
          storage.setItem(key, serializer.write(rawInit))
      } else {
        data.value = serializer.read(rawValue)
      }
    } catch (e) {
      onError(e)
    }
  }

  read()

  if (window && listenToStorageChanges)
    useEventListener(window, 'storage', (e) => setTimeout(() => read(e), 0))

  if (storage) {
    watch(data, () => {
      try {
        if (data.value == null) storage.removeItem(key)
        else storage.setItem(key, serializer.write(data.value))
      } catch (e) {
        onError(e)
      }
    })
  }

  return data
}
