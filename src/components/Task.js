import { useState, useEffect, useRef} from 'react'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import {BsTagsFill} from 'react-icons/bs'
import dayjs from 'dayjs'
import Tag from '../components/Tag'

const Task = ({ task, isCreated, updateTask, deleteTask, addTask, tags }) => {

  const [readOnly, setReadOnly] = useState(isCreated)
  const [text, setText] = useState("")

  const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : null)
  const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "")
  const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "")
  const dateReadable = isCreated ? datetime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? datetime.format("HH:mm") : ""
  
  const textelem = useRef(null)

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

  useEffect(() => isCreated ? setText(task.text) : null, [task, isCreated])
  
  const pencilClicked = () => {
    setReadOnly(false)
    textelem.current.focus()
  }

  const handleBlur = async (e) => {
    if (
      (isCreated && text === task.text && datetime.toISOString() === task.day) ||
      (!isCreated && (!text || !dateValue || !timeValue))
    ) {
      // If there are no changes, do nothing
      if (isCreated) {
        setReadOnly(true)
      }
      return
    }

    if (isCreated) {
      updateTask(task.id, {
        "text": text,
        "day": datetime.toISOString()
      })
      setReadOnly(true)
    } else {
      const task = {
        "text": text,
        "day": datetime.toISOString(),
        "tags": []
      }
      await addTask(task)
      setText("")
      setDateValue("")
      setTimeValue("")
      setReadOnly(false)
    }
  }
  
  
  const genTagElems = () => (!task.tags ? null : (
    task.tags.map((id) => {
      const tagObj = tags.find(x => x.id === id)
      return tagObj ? <Tag tag={tagObj} /> : null
    })
  ))



  return (
    <div className="task">
      <div className="task-name" >
        <h3>
          <input readOnly={readOnly} className="task-name-input" value={text}
            onChange={textChange} placeholder={isCreated ? "" : "Add a task here"}
            onBlur={handleBlur} ref={textelem} />
        </h3>
      </div>
      {isCreated || text
        ? (
          <>
            <div className="task-time">
              {
                isCreated
                  ? <p>{dateReadable}</p>
                  : <input className={`datetimepicker${text ? "" : " hidden"}`} type="date" value={dateValue}
                    onChange={dateChange} onBlur={handleBlur} />
              }
            </div>
            <div className="task-time" visibility="hidden">
              {
                isCreated
                  ? <p>{timeReadable}</p>
                  : <input className={`datetimepicker${text ? "" : " hidden"}`} type="time" value={timeValue}
                    onChange={timeChange} onBlur={handleBlur} />
              }
            </div>
            <div className="tag-container">
              {isCreated ? genTagElems() : null}
            </div>
            <BsTagsFill />
            <HiPencil className={`icon${isCreated ? "" : " hidden"}`} onClick={pencilClicked} />
            <FaTimes className={`icon${isCreated ? "" : " hidden"}`} onClick={() => deleteTask(task.id)} />
          </>) : ""}
    </div>
  )
}

export default Task