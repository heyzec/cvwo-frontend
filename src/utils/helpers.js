/**
 * Returns the most updated state from a setter of useState.
 * Useful when needed to access state from an attached event listener.
 */
export const getUpdatedValue = (setValue) => {
  let output
  const func = (val) => {
    output = val
    return val
  }
  setValue(func)
  return output
}

/**
 * Attaches an event handler which conditionally detaches itself. Note that the handler attached will
 * get stale states.
 * @param {object}   params                    An object containing all params
 * @param {object}   params.target             The DOM element to attach the event handler to.
 * @param {Function} params.preRemoval         Function to call before removal of event listener. If function returns falsy,
 *                                             the event listener will not be removed and postRemoval will not be called.
 * @param {Function} params.postRemoval        Function to call after removal of event listener.
 * @param {object}   params.exclusionEvent     Ignore this event.
 * @param {String}   params.exclusionSelector  CSS Selector, if event target is within DOM of this, don't remove handler.
 * @param {Boolean}  params.capture            If true (default), use capture mode for events (in contrast to bubbling).
 */
export const attachListener = (params) => {
  const { target, preRemoval, postRemoval, exclusionEvent, exclusionSelector, capture = true } = params
  // capture=true means the window's event listener fires first

  const handler = (e) => {
    if (exclusionEvent && exclusionEvent.nativeEvent === e) {  // Don't trigger if the event is created by the current attaching
      return
    }
    if (exclusionSelector && e.target.closest(exclusionSelector)) {
      return
    }
    if (preRemoval && !preRemoval()) {
      return
    }
    target.removeEventListener(e.type, handler, { capture: capture })
    postRemoval && postRemoval()
  }

  target.addEventListener('click', handler, { capture: capture })
}

/**
 * 
 * @param {Array} mappings      The state given by useState, stores a map of seq to callbacks
 * @param {String} seq          A string representing the sequence of keys which activates callback
 * @param {Function} callback   The function to run whenever user press the sequence of keys.
 *                              It will receive the keydown event when called.
 * @returns                     An object that, when fed into vimRemoveSeq, removes this handler 
 */
export const vimAddListener = (mappings, seq, callback) => {
  const pair = [seq, callback]
  mappings.push(pair)
  return () => {
    const index = mappings.indexOf(pair);
    if (index > -1) {
      mappings.splice(index, 1);
    }
  }
}

/**
 * @param {Object} callback   The object returned by vimAddSequence when handler is registered
 */
export const vimRemoveListener = (callback) => {
  callback()
}

/**
 * @param {Object} e                 The keydown event
 * @param {Array} mappings           
 * @param {Function} setKeys         A setter function from useState. We need to keep track of two states.
 * @param {Function} setKeyTimeout   Another setter function from useState.
 * @param {Number} timeout           The number of milliseconds the user must press adjacent keys to fire callback
 */
export const vimDispatcher = (e, mappings, setKeys, setKeyTimeout, timeout) => {
  if (document.activeElement.tagName === 'INPUT') {  // Don't steal keys when user is entering textboxes
    return
  }

  const keys = getUpdatedValue(setKeys)
  const keyTimeout = getUpdatedValue(setKeyTimeout)
  clearTimeout(keyTimeout)
  const seqThusFar = keys + e.key

  const mappingsHash = new Map(mappings)       // Convert into a hash to remove duplicate keys
  const arr = Array.from(mappingsHash.keys())

  const nFullMatches = arr.filter((seq) => seq === seqThusFar).length
  const nPartialMatches = arr.filter((seq) => seq !== seqThusFar && seq.startsWith(seqThusFar)).length
  
  const executeCallback = (seq, e) => {
    e.preventDefault()         // Prevent Tab key default
    mappingsHash.get(seq)(e)
  }

  if (nFullMatches === 1 && nPartialMatches === 0) {
    executeCallback(seqThusFar, e)
    setKeys("")
  } else if (nFullMatches + nPartialMatches !== 0) {
    setKeys(seqThusFar)
    const t = setTimeout(() => {
      if (nFullMatches === 1) {
        executeCallback(seqThusFar, e)
      }
      setKeys("")
    }, timeout)
    setKeyTimeout(t)
  }
}
