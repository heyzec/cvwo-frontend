import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'

import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill, BsCircle, BsCheckCircle } from 'react-icons/bs'

import Tag from 'components/Tag'
import Tooltip from 'material/Tooltip'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'

import 'components/Task.css'

const Task = ({ context, task, isCreated }) => {

  const tags = context.getTags()

  const [readOnly, setReadOnly] = useState(isCreated)
  const [isOpen, setIsOpen] = useState(false)
  const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : null)

  const [textValue, setTextValue] = useState("")
  const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "")
  const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "")
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
      await context.addTask(context.getCurrentList(), {
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

  const circleClicked = (e) => {
    context.editTask(task.id, {
      "done": !task.done
    })
  }


  return (
    <div className="task__wrapper">
      <Paper className="task">
          <div className="task__checkbox">
            <Tooltip text={isCreated ? `Mark ${task.done ? "undone" : "done"}` : ""}>
              <IconButton onClick={circleClicked}>
                {
                  isCreated && task.done
                    ? <BsCheckCircle size="20" />
                    : <BsCircle size="20" />
                }
              </IconButton>
            </Tooltip>
          </div>
          <div className="task__text" >
            <input readOnly={readOnly} className={`themed-input${isCreated && task.done ? " task--strikethrough" : ""}`} value={textValue}
              onChange={textChanged} placeholder={isCreated ? "" : "Add a task here"}
              onBlur={taskBlurred} ref={inputRef} />
          </div>
          <div className="task__date">
            {
              isCreated
                ? <p>{dateReadable}</p>
                : <input className={`themed-input ${textValue ? "" : " hidden"}`} type="date" value={dateValue}
                  onChange={dateChanged} onBlur={taskBlurred} />
            }
          </div>
          <div className="task__time">
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
          <div className="task__options">
            {
              isCreated
                ? <>
                  <Tooltip text="Edit tags">
                    <IconButton onClick={tagIconClicked}>
                      <BsTagsFill size="15" className="clickable" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip text="Edit task">
                    <IconButton onClick={pencilIconClicked}>
                      <HiPencil size="15" className={`clickable${isCreated ? "" : " hidden"}`} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip text="Delete task">
                    <IconButton onClick={crossIconClicked}>
                      <FaTimes size="15" className={`clickable${isCreated ? "" : " hidden"}`} />
                    </IconButton>
                  </Tooltip>
                </>
                : null
            }
          </div>
      </Paper>
        <div className={`task__dropdown-wrapper${isOpen ? "" : " remove"}`}>
          {
          task
            ? <Paper elevation="4" className="task__dropdown" >
              {
                tags.filter(x => !task.tags.includes(x.id)).map((tag) =>
                  <Tag className="clickable" onClick={dropdownTagClicked} key={tag.id} tag={tag} />
                )
              }
            </Paper>
            : null
        }
      </div>
    </div>
  )
}

export default Task
