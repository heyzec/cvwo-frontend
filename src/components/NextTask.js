import { useState } from 'react'

const NextTask = ({ addTaskCallback }) => {

  const [text, setText] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  
  const textChange = (e) => setText(e.target.value)
  const dateChange = (e) => setDate(e.target.value)
  const timeChange = (e) => setTime(e.target.value)

  const handleBlur = async (e) => {
    if (!text || !date || !time) {  // If required fields not filled, do nothing
      return
    }
    
    const day = (new Date(`${date}T${time}`)).toISOString()
      const task = {
        "id": Math.random(),
        "text": text,
        "day": day,
        "reminder": true
      }
      await addTaskCallback(task)
      setText("")
      setDate("")
      setTime("")
  }

  return (
    <div className="task" onBlur={handleBlur}>
      <div className="task-name">
        <h3>
          <input id="task-next-input" value={text} placeholder="Add a task here"
            onChange={textChange} />
        </h3>
      </div>
      <div className="task-time">
        <input className="datetimepicker" type="date" value={date} onChange={dateChange} />
        <input className="datetimepicker" type="time" value={time} onChange={timeChange} />
      </div>
    </div>
  )
}

export default NextTask