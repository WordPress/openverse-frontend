// Small wrapper for localstorage to protect against SSR

const localStorageExists =
  typeof window !== 'undefined' && 'localStorage' in window

const local = {
  /**
   * Gets the value from localStorage if window is defined,
   * or falls back on defaultValue.
   * @param {string} key
   * @param {string|null} defaultValue - value used if localStorage is not available,
   * or if the key is not in localStorage
   * @returns {string|null}
   */
  get(key, defaultValue = null) {
    return localStorageExists ? localStorage.getItem(key) : defaultValue
  },
  /**
   * Sets the value for key in localStorage.
   * @param {string} key
   * @param {string} value
   * @returns {void|null} - null is returned if localStorage is not available.
   */
  set(key, value) {
    localStorageExists ? localStorage.setItem(key, value) : null
  },
}

export default local
