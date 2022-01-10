import { useState } from 'react'
import 'material/TextField.css'

const TextField = () => {
  
  const [value, setValue] = useState("")
  
  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className="textfield">
      <input className="textfield__input" type="text" autocomplete="off" value={value} onChange={handleChange} />
        <div className="textfield__text-wrapper">
          <span className="textfield__text">First Name</span>
        </div>
    </div>
  )
}
export default TextField
