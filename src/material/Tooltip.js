import { useState, useEffect } from 'react'

import 'material/Tooltip.css'

const Tooltip = ({ text, children, delay }) => {
  const [visible, setVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)
  
  delay = delay ? delay : 500  // Set default delay to 500ms
  
  const contentEntered = (e) => {
    setTimeoutId(setTimeout(() => {
      setVisible(true)
    }, delay))
  }
  
  const contentLeft = (e) => {
    clearTimeout(timeoutId)
    setVisible(false)
  }

  useEffect(() => {  // Need clear timeout on unmounting (React will warn)
    return () => clearTimeout(timeoutId)
  }, [timeoutId])
  
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
