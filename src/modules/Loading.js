import { useState, useEffect } from 'react'
import 'modules/Loading.css'

export const Spinner = ({ size = 32 }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${size / 8}px`
  }

  return <div className="lds-dual-ring" style={style}></div>
}

const Loading = ({ show, ref }) => {
  
  const TRANSITION_DURATION = 150
  
  // SHOW: Show spinner, FADE: Overlay element is present, but hidden, REMOVE: Completely remove element from DOM
  const [SHOW, FADE, REMOVE] = [0, 1, 2]
  const [state, setState] = useState(FADE)

  useEffect(() => {
    if (show) {
      setState(FADE)
      setTimeout(() => {
        setState(SHOW)
      }, TRANSITION_DURATION)
    } else {
      setState(FADE)
      setTimeout(() => {
        setState(REMOVE)
      }, TRANSITION_DURATION)
    }
  }, [show])

  if (state === REMOVE) {
    return null
  }

  return (
    <div className={`loading${state === SHOW ? "" : " loading--hide"}`}>
      <Spinner size="64" />
    </div>
  )
}

export default Loading
