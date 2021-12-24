import { useState, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Tag from '../components/Tag'

const Task = ({ context, task, isCreated, tags }) => {

  const [readOnly, setReadOnly] = useState(isCreated)
  const [text, setText] = useState("")

  const [datetime, setDatetime] = useState(isCreated ? dayjs(task.day) : null)
  const [dateValue, setDateValue] = useState(isCreated ? datetime.format("YYYY-MM-DD") : "")
  const [timeValue, setTimeValue] = useState(isCreated ? datetime.format("HH:mm") : "")
  const dateReadable = isCreated ? datetime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? datetime.format("HH:mm") : ""

  const textElem = useRef(null)  // rename this variable
  const [open, setOpen] = useState(false)

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
    textElem.current.focus()
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
      await context.editTask(task.id, {
        "text": text,
        "day": datetime.toISOString()
      })
      setReadOnly(true)
    } else {
      await context.addTask({
        "text": text,
        "day": datetime.toISOString(),
        "tags": []
      })
      setText("")
      setDateValue("")
      setTimeValue("")
      setReadOnly(false)
    }
  }


  const genTagElems = () => {
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

    const cross = open ? <FaTimes className="tag-icon clickable" size="12" onClick={handler} /> : null
    return (task.tags.map((id) => {
      const tagObj = tags.find(x => x.id === id)
      return tagObj ? <Tag clickables={cross} key={tagObj.id} tag={tagObj} /> : null
    })
    )
  }



  const addTagClicked = (e) => {
    e.stopPropagation()
    const tagId = parseInt(e.currentTarget.attributes["data-tag-id"].value)
    context.editTask(task.id, {
      "tags": [...task.tags, tagId]
    })

  }

  const tagIconClicked = (e) => {
    e.stopPropagation()
    const listener = (e) => {
      setOpen(false)
    }
    if (!open) {
      window.addEventListener('click', listener, { once: true })
      e.stopPropagation()
    }
    setOpen(!open)
  }

  const crossIconClicked = (e) => {
    context.deleteTask(task.id)
  }

  return (
    <div className="task-super">
      <div className="task">
        <div className="task-name" >
          <h3>
            <input readOnly={readOnly} className="editable themed-input" value={text}
              onChange={textChange} placeholder={isCreated ? "" : "Add a task here"}
              onBlur={handleBlur} ref={textElem} />
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
              <BsTagsFill className="clickable" onClick={tagIconClicked} />
              <HiPencil className={`clickable${isCreated ? "" : " hidden"}`} onClick={pencilClicked} />
              <FaTimes className={`clickable${isCreated ? "" : " hidden"}`} onClick={crossIconClicked} />
            </>) : ""}
      </div>
      <div className={`dropdown${open ? "" : " remove"}`}>
        {task
          ?
          <div className="dropdown-inner" >
            {tags.filter(x => !task.tags.includes(x.id)).map((tag) =>

              <Tag className="clickable" onClick={addTagClicked} key={tag.id} tag={tag} />
            )}

          </div>
          : null}

      </div>
    </div>
  )
}

export default Task
