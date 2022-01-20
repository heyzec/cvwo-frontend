import { useState, useRef } from 'react'

import { FaPlus } from 'react-icons/fa'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import svgColorWheel from 'resources/colorwheel.png'

import { validateColor } from 'utils/funcs'
import Tag from 'components/Tag'
import Button from 'material/Button'
import IconButton from 'material/IconButton'
import TextField from 'material/TextField'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import Paper from 'material/Paper'

import 'components/TagsSidebar.css'

const colorPalatte = [
  "#f2777a",
  "#f99157",
  "#0f0c06",
  "#090c09",
  "#060c0c",
  "#06090c",
  "#0c090c",
  "#d27b53"
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
  const [selectedTag, setSelectedTag] = useState(null)  // Which tag's menu icon was clicked

  const colorRef = useRef(null)                         // A ref to the invisible color picker input elem
  const floatRef = useRef(null)                         // Ref to the floating menu



  /***** Event handlers *****/
  const colorValueChanged = (e) => setColorValue(e.target.value)
  const tagTextChanged = (e) => setTagText(e.target.value)

  const createTagClicked = () => {
    setTagEditMode("create")
    setColorValue(colorPalatte[0])
    setEditorOpen(true)
  }

  const menuEditClicked = (e) => {
    e.stopPropagation()
    const tagId = selectedTag
    const tag = tags.filter(tag => tag.id === tagId)[0]
    setTagText(tag.text)
    setColorValue(tag.color)
    setTagEditMode(`edit${tagId}`)
    setEditorOpen(true)
  }

  const menuDeleteClicked = async (e) => {
    e.stopPropagation()
    const tagId = selectedTag
    const routines = []
    tasks.forEach((task) => {
      if (task.tags.includes(tagId)) {
        routines.push(async () => {
          await context.editTask(task.id, {
            "tags": task.tags.filter(id => id !== tagId)
          })
        })
      }
    })

    const tag = tags.filter((tag) => tag.id === tagId)[0]

    if (routines.length !== 0) {
      const prompt = `The tag '${tag.text}' will be removed from ${routines.length} tasks. Continue?`
      if (!window.confirm(prompt)) {
        return
      }
    }
    routines.forEach(routine => routine())
    context.deleteTag(tagId)
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

      // Bug here, to fix
      await context.editTag(tagId, {
        "text": tagText,
        "color": colorValue
      })
    }
    setTagEditMode("")
    setTagText("")
    setEditorOpen(false)
  }


  // Not an event handler, but generates an event handler
  const genDotsClicked = (tag) => (e) => {

    floatRef.current.style.top = `${e.pageY - 140}px`
    floatRef.current.style.left = `${e.pageX - 50}px`

    if (!selectedTag) {
      window.addEventListener('click', function handler(ev) {
        if (e.nativeEvent === ev || ev.target.closest(".tags-sidebar__float")) {
          return
        }
        setSelectedTag(null)
        ev.currentTarget.removeEventListener(ev.type, handler)
      }, { capture: true })  // Use capture so that the window's event listener fires first
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
        <div ref={floatRef} className={`tags-sidebar__float${selectedTag ? "" : " remove"}`}>
          <Paper>
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
