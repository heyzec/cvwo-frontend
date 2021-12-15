import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'

const Task = ({ task, updateTask, deleteTask }) => {

  const [text, setText] = useState(task.text)
  const [readOnly, setReadOnly] = useState(true)

  useEffect(() => {
    setText(task.text)
  }, [task])
  
  const d = new Date(task.day)
  const dateString = d.toDateString()
  const timeString = d.toTimeString().substring(0, 9)
  
  const handleChange = (e) => setText(e.target.value)
  const handleBlur = (e) => {
    setReadOnly(true)
    if (text === task.text) {  // If there are no changes, do nothing
      return
    }
    updateTask(task.id, {
      "text": text
    })
  }

  return (
    <div className="task">
      <div className="task-name" >
        <h3>
          <input readOnly={readOnly} className="task-name-input" value={text}
            onChange={handleChange} onBlur={handleBlur}/>
        </h3>
      </div>
      <div className="task-time">
        <p>{`${dateString} ${timeString}`}</p>
      </div>
      <HiPencil className="icon" onClick={() => setReadOnly(false)} />
      <FaTimes className="icon" onClick={() => deleteTask(task.id)} />
    </div>
  )
}

export default Task