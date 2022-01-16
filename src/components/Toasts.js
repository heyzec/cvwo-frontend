import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Paper from 'material/Paper'
import 'components/Toasts.css'

const Toast = ({ text, color, duration }) => {
  const [show, setShow] = useState(false)
  const self = useRef(null)

  useEffect(() => {
    setShow(true)
    setTimeout(() => {
      setShow(false)
    }, duration)
  }, [])

  const style = {
    backgroundColor: color
  }

  return (
    <Paper ref={self} elevation="3" className={`toast-box${show ? " toast-show" : ""}`} style={style}>
      {text}
    </Paper>
  )
}

const ToastContainer = forwardRef((props, ref) => {

  const [toastArray, setToastArray] = useState([])

  const showToast = (message, color = "lightgreen", duration = 2000) => {
    const id = Math.random()  // A proper UUID generator is better
    const thisToast = (
      <Toast key={id} text={message} color={color} duration={duration} />
    )
    // Add this Toast to the array now, but remove it from the array after some time
    setToastArray([...toastArray, thisToast])
    setTimeout(() => {
      setToastArray((toastArray) => toastArray.filter((toast) => toast !== thisToast))
    }, duration + 1000)
  }

  useImperativeHandle(ref, () => ({  // To expose certain stuff to the parents via ref
    notify: showToast
  }))

  return (
    <div className="toast-container">
      {toastArray}
    </div>
  )
})
export { ToastContainer }
