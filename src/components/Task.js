import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import dayjs from 'dayjs'

const Task = ({ task, updateTask, deleteTask }) => {

  const [readOnly, setReadOnly] = useState(true)
  const [text, setText] = useState("")
  
  const [datetime, setDatetime] = useState(dayjs(task.day))
  const [dateValue, setDateValue] = useState(datetime.format("YYYY-MM-DD"))
  const [timeValue, setTimeValue] = useState(datetime.format("HH:mm"))
  const dateReadable = datetime.format("ddd, D MMM 'YY")
  const timeReadable = datetime.format("HH:mm")

  const textChange = (e) => setText(e.target.value)
  const dateChange = async (e) => {
    setDateValue(e.target.value)
    const dt = dayjs(`${e.target.value} ${timeValue}`)
    setDatetime(dt)
  }
  const timeChange = (e) => {
    setTimeValue(e.target.value)
    const dt = dayjs(`${dateValue} ${e.target.value}`)
    setDatetime(dt)
  }

  useEffect(() => {
    setText(task.text)
  }, [task])
  
  
  const handleBlur = (e) => {
    setReadOnly(true)
    if (text === task.text && datetime.toISOString() === task.day) {  
      // If there are no changes, do nothing
      return
    }
    updateTask(task.id, {
      "text": text,
      "day": dayjs(`${dateValue} ${timeValue}`).toISOString()
    })
  }

  return (
    <div className="task">
      <div className="task-name" >
        <h3>
          <input readOnly={readOnly} className="task-name-input" value={text}
            onChange={textChange} />
        </h3>
      </div>
      <div className="task-time">
        {
          readOnly
            ? <p>{dateReadable}</p>
            : <input className="datetimepicker" type="date" value={dateValue}
            onChange={dateChange} onBlur={handleBlur}/>
        }
      </div>
      <div className="task-time">
        {
          readOnly
            ? <p>{timeReadable}</p>
            : <input className="datetimepicker" type="time" value={timeValue}
            onChange={timeChange} onBlur={handleBlur}/>
        }
      </div>
      <HiPencil className="icon" onClick={() => setReadOnly(false)} />
      <FaTimes className="icon" onClick={() => deleteTask(task.id)} />
    </div>
  )
}

export default Task