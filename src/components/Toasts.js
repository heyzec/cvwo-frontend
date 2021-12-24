import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import './Toasts.css'

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
    <div ref={self} className={`toast-box${show ? " toast-show" : ""}`} style={style}>
      {text}
    </div>
  )
}

const ToastContainer = forwardRef((props, ref) => {

  const [toastArray, setToastArray] = useState([])



  const showToast = (message, color, duration) => {
    const id = Math.random()  // A proper UUID generator is better
    const thisToast = (
      <Toast key={id}
        text={message} color={color} duration={duration} />
    )
    setToastArray([...toastArray, thisToast])
    setTimeout(() => {
      setToastArray((toastArray) => toastArray.filter((toast) => toast !== thisToast))
    }, duration + 1000)
  }

  useImperativeHandle(ref, () => ({
    notify: showToast
  }))

  return (
    <div className="toast-container">
      {toastArray}
    </div>
  )
})
export default ToastContainer