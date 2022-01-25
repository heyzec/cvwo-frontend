import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'

import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { BsTagsFill, BsCircle, BsCheckCircle } from 'react-icons/bs'

import { getUpdatedValue, attachListener, vimAddListener, vimRemoveListener } from 'utils/helpers'

import Tag from 'components/Tag'
import TagsSelector from 'components/TagsSelector'
import { MuiDatePicker, MuiTimePicker } from 'components/MuiPickers'

import Tooltip from 'material/Tooltip'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'

import 'components/Task.css'

const Task = ({ context, task, isCreated, isSelected, importedTags }) => {


  // ---------------- Retrieve states from context object  ----------------
  const tags = context.getTags()

  // ---------------- Define other states and refs required  ----------------
  const [isEditing, setIsEditing] = useState(false)          // True if user is editing a created (isCreated) task
  const [isCreating, setIsCreating] = useState(false)        // True if user is now adding a new task (!isCreated)

  const [tagsOpen, setTagsOpen] = useState(false)
  const [dateTime, setDateTime] = useState(isCreated ? dayjs(task.day) : null)

  const [textValue, setTextValue] = useState("")
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [isDone, setIsDone] = useState(null)

  const dateReadable = isCreated ? dateTime.format("ddd, D MMM 'YY") : ""
  const timeReadable = isCreated ? dateTime.format("HH:mm") : ""

  const inputRef = useRef(null)  // Ref to the input elem so that we can force focus to it whenever

  const [selectedListId, setSelectedListId] = [context.getSelectedListId(), context.setSelectedListId]


  // These properties must be set only after comp renders to prevent infinite re-renders
  useEffect(() => {
    if (isCreated) {
      setTextValue(task.text)
      setDate(dayjs(task.day))
      setTime(dayjs(task.day))
      setIsDone(task.done)
    } else {
      setTextValue("")
      setDate(dayjs())
      setTime(dayjs())
      setIsDone(false)
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


  const [keyMappings, setKeyMappings] = [context.getKeyMappings(), context.setKeyMappings]


  // ---------------- Event handlers  ----------------

  const inputKeyDowned = (e) => {
    if (!isEditing) {
      return
    }
    if (['Enter', 'Esc', 'Escape'].includes(e.key)) {
      e.stopPropagation()
      saveTask()
      inputRef.current.blur()  // Remove focus so that keyboard shortcuts are available again
    }
  }

  const textChanged = (e) => setTextValue(e.target.value)

  const tickCircleClicked = (e) => {  // Toggle task as done or undone
    setIsDone(!isDone)

    if (isCreated) {
      context.editTask(task.id, {
        "done": !task.done
      })
    }
  }

    const crossIconClicked = (e) => context.deleteTask(task.id)

    // (Only applicable to the uncreated task) Start the creation phase
    const paperClicked = (e) => {
      if (!isCreated && !isCreating) {
        attachListener({
          target: window,
          preRemoval: () => {
            const textValue = getUpdatedValue(setTextValue)
            if (!textValue) {
              setIsCreating(false)
              return false
            }
            return saveTask()
          },
          postRemoval: () => {
            setIsCreating(false)
            setTextValue("")
            setDate(null)
            setTime(null)
          },
          // exclusionEvent: e,
          exclusionSelector: ".task, .MuiCalendarPicker-root, .MuiPaper-root",
        })
        inputRef.current.focus()
        setIsCreating(true)
      }
    }


    /** (Only applicable to created tasks) Start the editing phase **/
    const pencilIconClicked = (e) => {
      if (!isEditing) {
        window.addEventListener('click', function listener(ev) {
          if (e && e.nativeEvent === ev) {
            return
          }
          if (ev.target.closest(".task, .MuiCalendarPicker-root, .MuiPaper-root")) {
            return
          }
          saveTask(() => window.removeEventListener('click', listener))
        })
        inputRef.current.focus()
      }
      setIsEditing(!isEditing)
    }

    const tagIconClicked = (e) => {
      if (!tagsOpen) {
        attachListener({
          target: window,
          postRemoval: () => setTagsOpen(false),
          exclusionSelector: ".task__dropdown-wrapper, .tag__clickables",
          exclusionEvent: e,
          capture: false
        })
      }
      setTagsOpen(!tagsOpen)
    }


    /** Return false if fails validation, else true */
    const saveTask = (removeListenerCallback) => {
      // To add: Short circuit if task is not edited


      const textValue = getUpdatedValue(setTextValue)
      const date = getUpdatedValue(setDate)
      const time = getUpdatedValue(setTime)
      const dateTime = getUpdatedValue(setDateTime)
      const isCreating = getUpdatedValue(setIsCreating)
      const isEditing = getUpdatedValue(setIsEditing)
      const selectedListId = getUpdatedValue(setSelectedListId)
      const isDone = getUpdatedValue(setIsDone)

      if (!textValue || !date || !time) {
        return false
      }
      if (!isCreating && !isEditing) {
        return
      }
      if (isCreating) {
        if (!textValue) {
          setIsCreating(false)
          return false
        }
      }

      if (isCreating) {
        context.addTask(selectedListId, {  // An async function, but don't await here
          text: textValue,
          day: dateTime.toISOString(),
          done: isDone,
          tags: []
        })
      } else {
        context.editTask(task.id, {
          text: textValue,
          day: dateTime.toISOString()
        })
      }

      if (isCreating) {
        setIsCreating(false)
        setTextValue("")
        setDate(null)
        setTime(null)
      } else {
        setIsEditing(false)
      }

      removeListenerCallback && removeListenerCallback()
    }



    // ---------------- Add keyboard shortcuts ----------------

    useEffect(() => {
      if (!isSelected) {
        return
      }

      const helper = (e) => {
        e.preventDefault()
        pencilIconClicked()
        if (e.key === 'I') {
          inputRef.current.setSelectionRange(0, 0)
        }
      }

      const arr = []
      arr.push(vimAddListener(keyMappings, 'i', helper))
      arr.push(vimAddListener(keyMappings, 'A', helper))
      arr.push(vimAddListener(keyMappings, 'I', helper))
      arr.push(vimAddListener(keyMappings, 'Enter', (e) => tickCircleClicked()))
      arr.push(vimAddListener(keyMappings, ' ', (e) => tickCircleClicked()))
      arr.push(vimAddListener(keyMappings, 'cc', (e) => {
        setTextValue("")
        helper(e)
      }))
      arr.push(vimAddListener(keyMappings, 'dd', (e) => crossIconClicked()))
      return () => arr.forEach(vimRemoveListener)
    }, [task, isSelected, inputRef])




    // ---------------- Helper functions for rendering  ----------------

    /** If a tag is clicked in the TagsSelector component, add tag to list. */
    const genDropdownTagClicked = (tagId) => {
      const tag = tags.find((tag) => tag.id === tagId)
      context.editTask(task.id, {
        tags: [...task.tags, tag.text]
      })
    }

    // Required by generateTagElems
    /** If a tag's cross icon is clicked, remove tag from list. */
    const genCrossClicked = (tag) => (e) => {
      e.stopPropagation()
      const tagToRemove = tag
      context.editTask(task.id, {
        tags: task.tags.filter((tag) => tag !== tagToRemove.text)
      })
    }

    const generateTagElems = () => {
      if (!task.tags) {
        return null
      }

      return task.tags.map((tagText) => {
        let tag = tags.find((tag) => tag.text === tagText)
        if (!tag && importedTags) {
          tag = importedTags.find((tag) => tag.text === tagText)
        }
        const cross = (
          tagsOpen
            ? <FaTimes className="clickable" size="12" onClick={genCrossClicked(tag)} />
            : null
        )
        return tag ? <Tag clickables={cross} key={tag.id} tag={tag} /> : null
      })
    }


    // If task to float up as visual indicator
    const elevation = (isEditing || isCreating) ? 3 : isSelected ? 2 : 1

    return (
      <div className="task__wrapper">
        <Paper className="task" elevation={elevation} onClick={paperClicked}>
          <div className="task__checkbox">
            <Tooltip text={`Mark ${isDone ? "undone" : "done"}`}>
              <IconButton onClick={tickCircleClicked}>
                {
                  isDone
                    ? <BsCheckCircle size="20" />
                    : <BsCircle size="20" />
                }
              </IconButton>
            </Tooltip>
          </div>
          <div className="task__text" >
            <input
              className={isCreated && task.done ? " task--strikethrough" : ""}
              readOnly={isCreated && !isEditing}
              value={textValue}
              onChange={textChanged}
              onKeyDown={inputKeyDowned}
              placeholder={isCreated ? "" : "Add a task here"}
              ref={inputRef}
            />
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
            {
              // If this is an "uncreated" task, there are no tags to show.
              // If tags are empty, perhaps because tasks resources loaded before tags, also don't render this yet.
              isCreated && tags
                ? generateTagElems()
                : null
            }
          </div>
          <div className={`task__options${isCreated ? "" : " hidden"}`}>
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
          </div>
          <div className={`task__dropdown-wrapper${tagsOpen ? "" : " remove"}`}>
            {
              !isCreated || !tags ? null
                : (
                  <TagsSelector
                    tags={tags?.filter((tag) => !task.tags.includes(tag.text))}
                    genOnClick={genDropdownTagClicked}
                  />
                )
            }
          </div>
        </Paper>
      </div>
    )
  }

  export default Task
