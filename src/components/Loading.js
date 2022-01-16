import { useState, useEffect } from 'react'
import 'components/Loading.css'

const Loading = ({ show, ref }) => {

  const TRANSITION_DURATION = 100
  const [SHOW, FADE, REMOVE] = [0, 1, 2]
  const [state, setState] = useState(REMOVE)

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
    <div className={`loading-screen${state === SHOW ? "" : " loading-screen--hide"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  )
}

export default Loading
