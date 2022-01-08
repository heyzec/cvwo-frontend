import { useState, useRef } from 'react'

import Tag from 'components/Tag'

import { AiOutlinePlusCircle, AiOutlineCheckCircle } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import svgColorWheel from 'resources/colorwheel.png'

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
const validateColor = (str) => str.match(/^#([\dA-F]{3}|[\dA-F]{6})$/i)

const TagsSidebar = ({ context }) => {

  const tags = context.getTags()
  const tasks = context.getTasks()

  const [tagText, setTagText] = useState("")
  const [colorValue, setColorValue] = useState("")

  const [tagEditMode, setTagEditMode] = useState("")  // Whether tag is being created or edited
  const [move, setMove] = useState(false)  // Keeps track whether sidebar shows tags or editor

  const colorRef = useRef(null)  // A ref to the invisible color picker input elem


  const colorChanged = (e) => setColorValue(e.target.value)

  const tagChanged = async (e) => {
    setTagText(e.target.value)
  }

  const plusIconClicked = () => {
    setTagEditMode("create")
    setColorValue(colorPalatte[0])
    setMove(true)
  }

  const tickIconClicked = async () => {
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
    setMove(false)
  }

  const pencilIconClicked = () => {
    setTagEditMode("menu")
  }

  const clickablesPencilIconClicked = async (e) => {
    e.stopPropagation()
    const tagId = parseInt(e.currentTarget.closest(".tag").attributes["data-tag-id"].value)
    const tag = tags.filter(tag => tag.id === tagId)[0]
    setTagText(tag.text)
    setColorValue(tag.color)
    setTagEditMode(`edit${tagId}`)
    setMove(true)
  }

  const clickablesCrossIconClicked = async (e) => {
    e.stopPropagation()
    const tagId = parseInt(e.currentTarget.closest(".tag").attributes["data-tag-id"].value)
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

    if (routines.length !== 0) {
      const prompt = (`This tag will be removed from ${routines.length} tasks. Continue?`)
      if (!window.confirm(prompt)) {
        return
      }
    }
    routines.forEach(routine => routine())
    context.deleteTag(tagId)
  }

  const generateTagElems = () => {
    const clickables = tagEditMode ? (
      <>
        <HiPencil className="tag-icon clickable" size="12" onClick={clickablesPencilIconClicked} />
        <FaTimes className="tag-icon clickable" size="12" onClick={clickablesCrossIconClicked} />
      </>
    ) : null
    return tags.map((tag) => <Tag key={tag.id} tag={tag} clickables={clickables} />)
  }


  return (
    <div id="tags-sidebar">
      <div id="tags-sidebar__editor" className={move ? "tags--change" : ""} >
        <AiOutlineCheckCircle className="clickable" size="20" onClick={tickIconClicked} />
        <div id="tags-sidebar__preview-wrapper">
          <Tag tag={{ "color": colorValue, "text": tagText }} />
        </div>
        <div className="tags-sidebar__input-wrapper">
          <input id="tags-sidebar__input-text" className="themed-input"
            value={tagText} placeholder="Tag name" onChange={tagChanged} />
        </div>
        <div className="tags-sidebar__input-wrapper">
          <img className="clickable" src={svgColorWheel} alt="color wheel" width="20px" onClick={() => colorRef.current.click()} />
          <span>
            <input id="tags-sidebar__input-color" className={`themed-input${validateColor(colorValue) ? "" : " red"}`}
              maxLength={7} value={colorValue} placeholder="Color (hex value)" onChange={colorChanged} />
          </span>
        </div>
      </div>
      <div id="tags-sidebar__tags" className={move ? "tags--change" : ""} >
        <span id="tags-sidebar__label">Your tags</span>
        <input id="tags-sidebar__hidden-color" ref={colorRef} type="color" value={colorValue} onChange={colorChanged} />
        {
          ((str) => {
            switch (str) {
              case "":
                return <HiPencil className="clickable" onClick={pencilIconClicked} />
              case "menu":
                return <AiOutlinePlusCircle className="clickable" size="20" onClick={plusIconClicked} />
              default:
                return null
            }
          })(tagEditMode)
        }
        {generateTagElems()}
      </div>
    </div>
  )
}

export default TagsSidebar
