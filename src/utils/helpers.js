// Returns the most updated state from a setter of useState
// Useful when needed to access state from an attached event listener
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
 * Attaches an event handler which conditionally detaches itself.
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
    target.removeEventListener(e.type, handler, { capture: capture })    // Fix others: Adding capture here is CRUCIAL
    postRemoval && postRemoval()
  }

  target.addEventListener('click', handler, { capture: capture })
}
