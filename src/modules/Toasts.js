import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { rand32 } from 'utils/funcs'
import useStorageState from 'modules/useStorageState'
import Paper from 'material/Paper'
import 'modules/Toasts.css'

const Toast = ({ text, color, duration }) => {
  const [shrinking, setShrinking] = useState(false)
  const self = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setShrinking(true)
    }, duration)
  }, [])

  const style = {
    backgroundColor: color
  }

  return (
    <Paper ref={self} elevation="3" className={`toast-box${shrinking ? " toast-shrinking" : ""}`} style={style}>
      {text}
    </Paper>
  )
}

/**
 * More than just a component. It exposes functions via its ref which can used to create notification toasts.
 * A delayed toast means the toast is only shown on browser refresh. This allows us to notify user in ways previous
 * not possible, such as after the user deletes their account.
 */
const ToastContainer = forwardRef((props, ref) => {

  const [toastArray, setToastArray] = useState([])
  const [delayedToastArray, setDelayedToastArray] = useStorageState('delayedToasts', [], true)

  const showToast = ({ message, duration = 2000, color = "lightgreen", delayed = false }) => {
    if (delayed) {
      setDelayedToastArray((elems) => [...elems, { message, duration, color }])
      return
    }

    const id = rand32()
    const thisToast = (
      <Toast key={id} text={message} color={color} duration={duration} />
    )
    // Add this Toast to the array now, but remove it from the array after some time
    setToastArray((toastArray) => [...toastArray, thisToast])
    setTimeout(() => {
      setToastArray((toastArray) => toastArray.filter((toast) => toast !== thisToast))
    }, duration + 1000)
  }

  const delayedToast = (params) => showToast({ ...params, delayed: true })


  // Functions available for alerting user
  useImperativeHandle(ref, () => ({
    showToast: showToast,
    success: (message, duration) => showToast({ message, duration: duration || 2000, color: 'lightgreen' }),
    error: (message, duration) => showToast({ message, duration: duration || 4000, color: 'pink' }),
    info: (message, duration) => showToast({ message, duration: duration || 1000, color: 'white' }),

    delayedToast: delayedToast,
    delayedSuccess: (message, duration) => delayedToast({ message, duration: duration || 2000, color: 'lightgreen' }),
    delayedError: (message, duration) => delayedToast({ message, duration: duration || 4000, color: 'pink' }),
    delayedInfo: (message, duration) => delayedToast({ message, duration: duration || 1000, color: 'white' }),
  }))


  useEffect(() => {
    delayedToastArray.forEach((delayedToast) => {
      showToast(delayedToast)
    })
    setDelayedToastArray([])
    window.sessionStorage.removeItem('delayedToasts')
  }, [])

  return (
    <div className="toast-container">
      {toastArray}
    </div>
  )
})
export { ToastContainer }
