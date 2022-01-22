import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'

import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill, BsCircle, BsCheckCircle } from 'react-icons/bs'

import Tag from 'components/Tag'
import TagsSelector from 'components/TagsSelector'
import { MuiDatePicker, MuiTimePicker } from 'components/MuiPickers'

import Tooltip from 'material/Tooltip'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'

import getUpdatedValue from 'utils/getUpdatedValue'

import 'components/Task.css'

const Task = ({ context, task, isCreated }) => {

  /***** Retrieve states from context object *****/
  const tags = context.getTags()

  /***** Define other states and refs required *****/
  const [isEditing, setIsEditing] = useState(false)        // False when user is editing the task
  const [isCreating, setIsCreating] = useState(false)        // False when user is editing the task


  const [tagsOpen, setTagsOpen] = useState(false)
  const [dateTime, setDateTime] = useState(isCreated ? dayjs(task.day) : null)

  const [textValue, setTextValue] = useState("")
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)

  const dateReadable = isCreated ? dateTime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? dateTime.format("HH:mm") : ""

  const inputRef = useRef(null)  // Ref to the input elem so that we can force focus to it whenever


  // These properties must be set only after comp renders
  useEffect(() => {
    if (isCreated) {
      setTextValue(task.text)
      setDate(dayjs(task.day))
      setTime(dayjs(task.day))
    } else {
      setTextValue(null)
      setDate(dayjs())
      setTime(null)
    }
  }, [])


  useEffect(() => {
    if (!date || !time) {
      return
    }
    setDateTime(
      dayjs().year(date.year()).month(date.month()).date(date.date()
      ).hour(time.hour()).minute(time.minute()).second(time.second())
    )
  }, [date, time])




  /***** Event handlers *****/
  const textChanged = (e) => setTextValue(e.target.value)

  const tickCircleClicked = (e) => {  // Toggle task as done or undone
    context.editTask(task.id, {
      "done": !task.done
    })
  }

  const crossIconClicked = (e) => context.deleteTask(task.id)

  // (Only applicable to the uncreated task) Start the creation phase
  const paperClicked = (e) => {
    if (!isCreated && !isCreating) {
      window.addEventListener('click', function handler(ev) {

        if (e.nativeEvent === ev || ev.target.closest(".task, .MuiCalendarPicker-root, .MuiPaper-root")) {
          return
        }

        if (!save()) {
          return
        }

        ev.currentTarget.removeEventListener(ev.type, handler, { capture: true })

        setIsCreating(false)
        setTextValue("")
        setDate(null)
        setTime(null)

      }, { capture: true })  // Use capture so that the window's event listener fires first
      inputRef.current.focus()
      setIsCreating(true)
    }
  }


  // (Only applicable to created tasks) Start the editing phase
  const pencilIconClicked = (e) => {
    if (!isEditing) {
      window.addEventListener('click', function handler(ev) {
        if (e.nativeEvent === ev || ev.target.closest(".task, .MuiCalendarPicker-root, .MuiPaper-root")) {
          return
        }
        if (!save()) {
          return
        }
        window.removeEventListener(ev.type, handler, { capture: true })    // Fix others: Adding capture here is CRUCIAL


        setIsEditing(false)
      }, { capture: true })  // Use capture so that the window's event listener fires first
      inputRef.current.focus()
    }
    setIsEditing(!isEditing)
  }


  // Return false if fails validation, else true
  const save = (text, dt) => {
    // To add: Short circuit if task is not edited

    const textValue = getUpdatedValue(setTextValue)
    const date = getUpdatedValue(setDate)
    const time = getUpdatedValue(setTime)
    const dateTime = getUpdatedValue(setDateTime)

    if (!textValue || !date || !time) {
      return false
    }

    const asyncToDo = async () => {
      if (isCreated) {
        await context.editTask(task.id, {
          "text": textValue,
          "day": dateTime.toISOString()
        })
      } else {
        await context.addTask(context.getSelectedListId(), {
          "text": textValue,
          "day": dateTime.toISOString(),
          "tags": []
        })
      }
    }
    asyncToDo()
    return true
  }

  const tagIconClicked = (e) => {
    e.stopPropagation()
    if (!tagsOpen) {
      window.addEventListener('click', function handler(e) {
        if (e.target.closest(".task__dropdown-wrapper")) {
          return
        }
        setTagsOpen(false)
        e.currentTarget.removeEventListener(e.type, handler)
      })
    }
    setTagsOpen(!tagsOpen)
  }



  /***** Helper functions for rendering *****/

  const genDropdownTagClicked = (tagId) => {
    context.editTask(task.id, {
      "tags": [...task.tags, tagId]
    })
  }

  // Required by generateTagElems
  const genCrossClicked = (tag) => (e) => {
    e.stopPropagation()
    const tagId = tag.id
    context.editTask(task.id, {
      "tags": task.tags.filter((id) => id !== tagId)
    })
  }

  const generateTagElems = () => {
    if (!task.tags) {
      return null
    }

    return task.tags.map((id) => {
      const tag = tags.find((tag) => tag.id === id)
      const cross = (
        tagsOpen
          ? <FaTimes className="clickable" size="12" onClick={genCrossClicked(tag)} />
          : null
      )
      return tag ? <Tag clickables={cross} key={tag.id} tag={tag} /> : null
    })
  }

  const elevate = isEditing || isCreating  // If task to float up as visual indicator

  return (
    <div className="task__wrapper">
      <Paper className="task" elevation={elevate ? 2 : 1} onClick={paperClicked}>
        <div className="task__checkbox">
          <Tooltip text={isCreated ? `Mark ${task.done ? "undone" : "done"}` : ""}>
            <IconButton onClick={tickCircleClicked}>
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
            readOnly={isCreated && !isEditing}
            value={textValue}
            onChange={textChanged}
            placeholder={isCreated ? "" : "Add a task here"}
            ref={inputRef} />
        </div>
        <div className="task__date">
          {
            isCreating || isEditing
              ? <MuiDatePicker value={date} setValue={setDate} />
              : <p>{dateReadable}</p>
          }
        </div>
        <div className="task__time">
          {
            isCreating || isEditing
              ? <MuiTimePicker value={time} setValue={setTime} />
              : <p>{timeReadable}</p>
          }
        </div>
        <div className="tag-container">
          {isCreated ? generateTagElems() : null}
        </div>
        <div className="task__options">
          {
            isCreated || 1 == 1
              ? <>
                <Tooltip text="Edit tags">
                  <IconButton onClick={tagIconClicked}>
                    <BsTagsFill size="15" />
                  </IconButton>
                </Tooltip>
                <Tooltip text="Edit task">
                  <IconButton onClick={pencilIconClicked}>
                    <HiPencil size="15" className={isCreated ? "" : " hidden"} />
                  </IconButton>
                </Tooltip>
                <Tooltip text="Delete task">
                  <IconButton onClick={crossIconClicked}>
                    <FaTimes size="15" className={isCreated ? "" : " hidden"} />
                  </IconButton>
                </Tooltip>
              </>
              : null
          }
        </div>
      </Paper>
      <div className={`task__dropdown-wrapper${tagsOpen ? "" : " remove"}`}>
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
