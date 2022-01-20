import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'

import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill, BsCircle, BsCheckCircle } from 'react-icons/bs'

import Tag from 'components/Tag'
import TagsSelector from 'components/TagsSelector'
import Tooltip from 'material/Tooltip'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'

import 'components/Task.css'

const Task = ({ context, task, isCreated }) => {

  /***** Retrieve states from context object *****/
  const tags = context.getTags()

  /***** Define other states and refs required *****/
  const [readOnly, setReadOnly] = useState(isCreated)
  const [isOpen, setIsOpen] = useState(false)
  const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : null)

  const [textValue, setTextValue] = useState("")
  const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "")
  const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "")
  const dateReadable = isCreated ? datetime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? datetime.format("HH:mm") : ""

  const inputRef = useRef(null)


  /***** Event handlers *****/
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
    if (!isOpen) {
      window.addEventListener('click', function handler(e) {
        if (e.target.closest(".task__dropdown-wrapper")) {
          return
        }
        setIsOpen(false)
        e.currentTarget.removeEventListener(e.type, handler)
      })
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

  const genDropdownTagClicked = (tagId) => {
    // e.stopPropagation()  // Prevent dropdown from closing upon tag selected
    // const tagId = parseInt(e.currentTarget.attributes["data-tag-id"].value)
    // const tagId = tag.id

    context.editTask(task.id, {
      "tags": [...task.tags, tagId]
    })
  }

  const taskBlurred = async (e) => {
    // When task is blurred, save the edits (if any)
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
      await context.addTask(context.getSelectedListId(), {
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

  const circleClicked = (e) => {
    context.editTask(task.id, {
      "done": !task.done
    })
  }


  /***** Set task text *****/  // TODO: Check if its still necessary to delay doing this till after comp mounts?
  useEffect(() => isCreated ? setTextValue(task.text) : null,
    [task, isCreated]
  )


  /***** Function to be called in the block below *****/
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
      const tag = tags.find(x => x.id === id)
      return tag ? <Tag clickables={cross} key={tag.id} tag={tag} /> : null
    })
    )
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
          <input
            className={`themed-input${isCreated && task.done ? " task--strikethrough" : ""}`}
            readOnly={readOnly}
            value={textValue}
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
            ? <TagsSelector tags={tags.filter((tag) => !task.tags.includes(tag.id))} genOnClick={genDropdownTagClicked} />
            : null
        }
      </div>
    </div>
  )
}

export default Task
