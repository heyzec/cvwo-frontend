import { useState } from 'react'

/**
  Adapted from https://usehooks.com/useLocalStorage/
  
  Care needs to be taken when using React hooks with event handlers.
  Usually, the problem of an event handler getting a stale state can be
  solved using the state updater function (see State updater function in
  https://stackoverflow.com/a/53846698). However, for some reason that I
  have yet to figure out, when this custom hook is used, this cannot be
  solved with the above mentioned fix. Consider using the re-registering
  of event listener method instead.
**/

const useStorageState = (key, defaultValue) => {

  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (ex) {
      return defaultValue
    }
  })

  const wrappedSetValue = (newValue) => {
    const valueToStore = typeof newValue === "function" ? newValue(value) : newValue
    setValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [value, wrappedSetValue]
}
export default useStorageState
