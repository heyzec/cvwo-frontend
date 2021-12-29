import { useState, forwardRef, useImperativeHandle } from 'react'

import './Loading.css'

const Loading = forwardRef((props, ref) => {
 
  const TRANSITION_DURATION = 100
  const [SHOW, FADE, REMOVE] = [0, 1, 2]

  const [state, setState] = useState(SHOW)

  const remove = () => {
    setState(FADE)
    setTimeout(() => {
      setState(REMOVE)
    }, TRANSITION_DURATION)
  }
  
  useImperativeHandle(ref, () => ({  // To expose certain stuff to the parents via ref
    remove: remove
  }))

  if (state === REMOVE) {
    return null
  } 
  
  return (
  <div className={`loading-screen${state === SHOW ? "" : " loading-screen--hide"}`}>
    <div className="lds-dual-ring"></div>
  </div>
  )
})

export default Loading
