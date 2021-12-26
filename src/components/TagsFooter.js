import { useState, useRef } from 'react'

import Tag from './Tag'

import { AiOutlinePlusCircle, AiOutlineCheckCircle } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import svgColorWheel from '../resources/colorwheel.png'

import './TagsFooter.css'

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

const TagsFooter = ({ context }) => {

  const tags = context.getTags()
  const tasks = context.getTasks()

  const [tagEditMode, setTagEditMode] = useState("")

  const [tagText, setTagText] = useState("")
  const [colorValue, setColorValue] = useState("")

  const col = useRef(null)
  const ref2 = useRef(null)


  const colorChanged = (e) => setColorValue(e.target.value)

  const tagChanged = async (e) => {
    setTagText(e.target.value)
  }


  const plusIconClicked = () => {
    setTagEditMode("create")
    ref2.current.focus()
    setColorValue(colorPalatte[0])
  }

  const tickIconClicked = async () => {
    setTagEditMode("")
    setTagText("")
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
      await context.editTag(tagId, {
        "text": tagText,
        "color": colorValue
      })

    }
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
    <div id="tags-footer">
      <div id="tags-footer__editor" className={tagEditMode.match(/create|edit\d+/) ? "" : "hidden"}>
        <div id="tags-footer__preview-wrapper">
          <Tag passRef={ref2} tag={{ "color": colorValue, "text": tagText }} />

        </div>
        <div className="tags-footer__input-wrapper">
          <input id="tags-footer__input-text" className="themed-input"
            value={tagText} placeholder="Tag name" onChange={tagChanged} />

        </div>
        <div className="tags-footer__input-wrapper">
          <img className="clickable" src={svgColorWheel} alt="color wheel" width="20px" onClick={() => col.current.click()} />
          <span>
            <input id="tags-footer__input-color" className={`themed-input${validateColor(colorValue) ? "" : " red"}`}
              maxLength={7} value={colorValue} placeholder="Color (hex value)" onChange={colorChanged} />

          </span>
        </div>

      </div>
      <div id="tags-footer__tags">
        {generateTagElems()}
        <input id="tags-footer__hidden-color" ref={col} type="color" value={colorValue} onChange={colorChanged} />
        {
          ((str) => {
            switch (str) {
              case "":
                return <HiPencil className="clickable" onClick={pencilIconClicked} />
              case "menu":
                return <AiOutlinePlusCircle className="clickable" size="20" onClick={plusIconClicked} />
              case "create":
                return <AiOutlineCheckCircle className="clickable" size="20" onClick={tickIconClicked} />
              case str.match(/^edit\d+$/)?.input:
                return <AiOutlineCheckCircle className="clickable" size="20" onClick={tickIconClicked} />
              default:
                console.log(str)
                return "OOPS"
            }
          })(tagEditMode)
        }
      </div>
    </div>
  )
}

export default TagsFooter
