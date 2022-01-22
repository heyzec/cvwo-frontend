import { useState, useRef } from 'react'

import { FaPlus } from 'react-icons/fa'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import svgColorWheel from 'resources/colorwheel.png'

import { validateColor } from 'utils/funcs'
import { attachListener } from 'utils/helpers'
import Tag from 'components/Tag'

import Button from 'material/Button'
import IconButton from 'material/IconButton'
import TextField from 'material/TextField'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import Paper from 'material/Paper'

import 'components/TagsSidebar.css'

const colorPalatte = [
  "#f5714d",
  "#b7758c",
  "#7cabc9",
  "#f0e6e7",
  "#e8b689",
  "#ed9ec9",
  "#f0d9b2",
  "#fcca65",
  "#bde0ed",
]

const TagsSidebar = ({ context }) => {

  /***** Retrieve states from context object *****/
  const tags = context.getTags()
  const tasks = context.getTasks()



  /***** Initialise states and refs *****/
  const [tagText, setTagText] = useState("")            // For input elem in editor
  const [colorValue, setColorValue] = useState("")      // For input elem in editor

  const [tagEditMode, setTagEditMode] = useState("")    // Whether tag is being created or edited
  const [editorOpen, setEditorOpen] = useState(false)   // Keeps track whether sidebar shows tags or editor
  const [selectedTagId, setSelectedTag] = useState(null)  // Which tag's menu icon was clicked

  const colorRef = useRef(null)                         // A ref to the invisible color picker input elem
  const floatRef = useRef(null)                         // Ref to the floating menu



  /***** Event handlers *****/
  const colorValueChanged = (e) => setColorValue(e.target.value)
  const tagTextChanged = (e) => setTagText(e.target.value)

  const createTagClicked = () => {
    setTagEditMode("create")
    setColorValue(colorPalatte[Math.floor(Math.random() * colorPalatte.length)])
    setEditorOpen(true)
  }

  const menuEditClicked = (e) => {
    const tag = tags.find((tag) => tag.id === selectedTagId)

    setTagText(tag.text)
    setColorValue(tag.color)
    setTagEditMode(`edit${selectedTagId}`)
    setEditorOpen(true)
  }

  const menuDeleteClicked = async (e) => {
    const tag = tags.find((tag) => tag.id === selectedTagId)

    const tagText = tag.text
    const routines = []
    tasks.forEach((task) => {
      if (task.tags.includes(tagText)) {
        routines.push(async () => {
          await context.editTask(task.id, {
            "tags": task.tags.filter((text) => text !== tagText)
          })
        })
      }
    })

    if (routines.length !== 0) {
      const prompt = `The tag '${tag.text}' will be removed from ${routines.length} tasks. Continue?`
      if (!window.confirm(prompt)) {
        return
      }
    }
    routines.forEach(routine => routine())
    context.deleteTag(tagText)
  }

  const doneButtonClicked = async () => {
    if (!(tagText && validateColor(colorValue))) {
      return
    }
    if (tagEditMode === "create") {
      await context.addTag({
        "text": tagText,
        "color": colorValue
      })
    } else if (tagEditMode.match(/^edit\d+$/)) {
      const tagId = parseInt(tagEditMode.match(/\d+/)[0])

      const tag = tags.find((tag) => tag.id === tagId)

      const [routinesLocal, routinesShared] = [[], []]
      tasks.forEach((task) => {
        if (task.tags.includes(tag.text)) {
          const routine = async () => {
            await context.editTask(task.id, {
              "tags": task.tags.map((text) => text === tag.text ? tagText : text)
            })
          }
          if (task.shared) {
            routinesShared.push(routine)
          } else {
            routinesLocal.push(routine)
          }
        }
      })

      const totalLength = routinesLocal.length + routinesShared.length
      if (totalLength) {
        const prompt = `The tag '${tag.text}' will be renamed for ${totalLength} tasks (${routinesShared.length} shared). Continue?`
        if (!window.confirm(prompt)) {
          return
        }
      }
      routinesLocal.forEach(routine => routine())
      routinesShared.forEach(routine => routine())


      await context.editTag(tagId, {
        "text": tagText,
        "color": colorValue
      })
    }
    setTagEditMode("")
    setTagText("")
    setEditorOpen(false)
  }


  // Not an event handler, but generates an event handler. This event handler
  // opens and moves a menu to the location of the button user clicked. Menu is
  // closed only if user clicks elsewhere.
  const genDotsClicked = (tag) => (e) => {
    console.log(e.currentTarget)

    const { left, top } = e.currentTarget.getBoundingClientRect()

    floatRef.current.style.top = `${top - 120}px`
    floatRef.current.style.left = `${left - 30}px`

    if (!selectedTagId) {
      attachListener({
        target: window,
        preRemoval: () => setSelectedTag(null),
        exclusionSelector: ".tags-sidebar__float",
      })
    }
    setSelectedTag(tag.id)
  }


  const tagItems = tags.map((tag) => (
    <div className="tags-sidebar__row">
      <Tag key={tag.id} tag={tag} />
      <span className="tags-sidebar__spacer"></span>
      <IconButton onClick={genDotsClicked(tag)} >
        <HiOutlineDotsVertical />
      </IconButton>
    </div>
  ))

  return (
    <div id="tags-sidebar">
      <div id="tags-sidebar__main" >
        <div className="tags-sidebar__head">
          <span>Your tags</span>
          <hr />
        </div>
        <Button
          className="tags-sidebar__add-tag"
          variant="contained"
          startIcon={<FaPlus />}
          onClick={createTagClicked}
        >
          New tag
        </Button>
        <div className="tags-sidebar__tags">
          {tagItems}
        </div>
        <div ref={floatRef} className={`tags-sidebar__float-wrap${selectedTagId ? "" : " remove"}`}>
          <Paper className="tags-sidebar__float">
            <SelectableList>
              <SelectableListItem onClick={menuEditClicked}>
                Edit
              </SelectableListItem>
              <SelectableListItem onClick={menuDeleteClicked}>
                Delete
              </SelectableListItem>
            </SelectableList>
          </Paper>
        </div>
      </div>

      <Paper elevation="2" className={`tags-sidebar__editor${editorOpen ? " tags--editing" : ""}`}>
        <input
          id="tags-sidebar__hidden-color"
          ref={colorRef}
          type="color"
          value={colorValue}
          onChange={colorValueChanged}
        />
        <div id="tags-sidebar__preview-wrapper">
          <Tag tag={{ "color": colorValue, "text": tagText }} />
        </div>
        <TextField label="Tag name" value={tagText} onChange={tagTextChanged} />
        <div className="tags-sidebar__input-wrapper">
          <img
            className="clickable"
            src={svgColorWheel}
            alt="color wheel"
            width="20px"
            onClick={() => colorRef.current.click()}
          />
          <span>
            <input id="tags-sidebar__input-color" className={`themed-input${validateColor(colorValue) ? "" : " red"}`}
              maxLength={7} value={colorValue} placeholder="Color (hex value)" onChange={colorValueChanged} />
          </span>
        </div>
        <Button variant="contained" onClick={doneButtonClicked}>
          Done
        </Button>
      </Paper>

    </div>
  )
}
export default TagsSidebar
