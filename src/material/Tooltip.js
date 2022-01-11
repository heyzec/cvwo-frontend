import { useState } from 'react'

import 'material/Tooltip.css'

const Tooltip = ({ text, children, delay }) => {
  const [visible, setVisible] = useState(false)
  const [delayHandler, setDelayHandler] = useState(null)
  
  delay = delay ? delay : 500  // Set default delay to 500ms
  
  const contentEntered = (e) => {
    setDelayHandler(setTimeout(() => {
      setVisible(true)
    }, delay))
  }
  
  const contentLeft = (e) => {
    clearTimeout(delayHandler)
    setVisible(false)
  }

  
  return (
    <div className="tooltip">
      <div className="tooltip__content" onMouseEnter={contentEntered} onMouseLeave={contentLeft} >
        {children}
      </div>
      <div className="tooltip__text-wrapper">
        <span className={`tooltip__text${visible ? " tooltip--active" : ""}`}>{text}</span>
      </div>
    </div >
  )
}
export default Tooltip
