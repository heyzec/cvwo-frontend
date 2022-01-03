import { useState, useEffect, useRef } from 'react'

import dayjs from 'dayjs'

import Tag from '../components/Tag'

import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill } from 'react-icons/bs'

import './Tag.css'

const Task = ({ context, task, isCreated }) => {

  const tags = context.getTags()

  const [readOnly, setReadOnly] = useState(isCreated)
  const [isOpen, setIsOpen] = useState(false)
  // const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : null)
  const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : dayjs())

  const [textValue, setTextValue] = useState("")
  // const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "")
  // const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "")
  const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "1999-12-12")
  const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "12:12")
  const dateReadable = isCreated ? datetime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? datetime.format("HH:mm") : ""

  const inputRef = useRef(null)

  useEffect(() => isCreated ? setTextValue(task.text) : null, [task, isCreated])


  const textChanged = (e) => setTextValue(e.target.value)
  const dateChanged = async (e) => {
    setDateValue(e.target.value)
    const dt = dayjs(`${e.target.value} ${timeValue}`)
    setDatetime(dt)
  }
  const timeChanged = (e) => {
    setTimeValue(e.target.value)
    const dt = dayjs(`${dateValue} ${e.target.value}`)
    setDatetime(dt)
  }


  const tagIconClicked = (e) => {
    e.stopPropagation()
    const listener = (e) => {
      setIsOpen(false)
    }
    if (!isOpen) {
      window.addEventListener('click', listener, { once: true })
      e.stopPropagation()
    }
    setIsOpen(!isOpen)
  }

  const pencilIconClicked = () => {
    setReadOnly(false)
    inputRef.current.focus()
  }

  const crossIconClicked = (e) => {
    context.deleteTask(task.id)
  }

  const dropdownTagClicked = (e) => {
    e.stopPropagation()
    const tagId = parseInt(e.currentTarget.attributes["data-tag-id"].value)
    context.editTask(task.id, {
      "tags": [...task.tags, tagId]
    })
  }
  
  
  const taskBlurred = async (e) => {
    if (
      (isCreated && textValue === task.text && datetime.toISOString() === task.day) ||
      (!isCreated && (!textValue || !dateValue || !timeValue))
    ) {
      // If there are no changes, do nothing
      if (isCreated) {
        setReadOnly(true)
      }
      return
    }

    if (isCreated) {
      await context.editTask(task.id, {
        "text": textValue,
        "day": datetime.toISOString()
      })
      setReadOnly(true)
    } else {
      await context.addTask({
        "text": textValue,
        "day": datetime.toISOString(),
        "tags": []
      })
      setTextValue("")
      setDateValue("")
      setTimeValue("")
      setReadOnly(false)
    }
  }


  const generateTagElems = () => {
    if (!task.tags) {
      return null
    }
    const handler = (e) => {
      e.stopPropagation()
      const tagId = parseInt(e.currentTarget.closest(".tag").attributes["data-tag-id"].value)
      context.editTask(task.id, {
        "tags": task.tags.filter(id => id !== tagId)
      })
    }

    const cross = isOpen ? <FaTimes className="tag-icon clickable" size="12" onClick={handler} /> : null
    return (task.tags.map((id) => {
      const tagObj = tags.find(x => x.id === id)
      return tagObj ? <Tag clickables={cross} key={tagObj.id} tag={tagObj} /> : null
    })
    )
  }


  return (
    <div className="task__wrapper">
      <div className="task">
        <div className="task__text" >
          <h3>
            <input readOnly={readOnly} className="themed-input" value={textValue}
              onChange={textChanged} placeholder={isCreated ? "" : "Add a task here"}
              onBlur={taskBlurred} ref={inputRef} />
          </h3>
        </div>
        {isCreated || textValue
          ? (
            <>
              <div className="task__time">
                {
                  isCreated
                    ? <p>{dateReadable}</p>
                    : <input className={`themed-input ${textValue ? "" : " hidden"}`} type="date" value={dateValue}
                      onChange={dateChanged} onBlur={taskBlurred} />
                }
              </div>
              <div className="task__time" visibility="hidden">
                {
                  isCreated
                    ? <p>{timeReadable}</p>
                    : <input className={`themed-input ${textValue ? "" : " hidden"}`} type="time" value={timeValue}
                      onChange={timeChanged} onBlur={taskBlurred} />
                }
              </div>
              <div className="tag-container">
                {isCreated ? generateTagElems() : null}
              </div>
              <BsTagsFill className="clickable" onClick={tagIconClicked} />
              <HiPencil className={`clickable${isCreated ? "" : " hidden"}`} onClick={pencilIconClicked} />
              <FaTimes className={`clickable${isCreated ? "" : " hidden"}`} onClick={crossIconClicked} />
            </>) : ""}
      </div>
      <div className={`task__dropdown-wrapper${isOpen ? "" : " remove"}`}>
        {task
          ?
          <div className="task__dropdown" >
            {tags.filter(x => !task.tags.includes(x.id)).map((tag) =>

              <Tag className="clickable" onClick={dropdownTagClicked} key={tag.id} tag={tag} />
            )}

          </div>
          : null}

      </div>
    </div>
  )
}

export default Task
