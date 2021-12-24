// React hooks
import { useState, useEffect, useRef } from 'react'

// Helpers and components
import { Helpers } from './helpers'
import Header from './components/Header'
import Task from './components/Task'
import Tag from './components/Tag'
import ToastContainer from './components/Toasts';

// Resources
import { AiOutlinePlusCircle, AiOutlineCheckCircle } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import svgColorWheel from './resources/colorwheel.png'

// Styles
import './App.css';

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

console.log(`This is a ${process.env.NODE_ENV} environment`)

function App() {

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])

  const context = new Helpers()
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)


  const [tagEditMode, setTagEditMode] = useState("")

  const [tagText, setTagText] = useState("")
  const [colorValue, setColorValue] = useState("")
  const colorChange = (e) => setColorValue(e.target.value)

  const validateColor = (str) => str.match(/^#([\dA-F]{3}|[\dA-F]{6})$/i)

  const col = useRef(null)
  const ref2 = useRef(null)



  const toasts = useRef(null)  // This ref allows us to access functions in the ToastContainer


  // Run once after initial rendering
  useEffect(() => {
    context.fetchTags()  // For now, the tags must be fetched first
    context.fetchTasks()
  }, [])



  const callback = () => {
    console.log("The following is ref2")
    console.log(ref2)
  }

  const creatingNewTag = () => {
    setTagEditMode("create")
    ref2.current.focus()
    setColorValue(colorPalatte[0])
  }

  const gotoMenu = () => {
    setTagEditMode("menu")
  }

  const newTagDone = async () => {
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

  // Function for testing purposes
  const magic = async () => {
    toasts.current.notify("You can make lwidth, height...", "lightgreen", 2000)
  }


  const tagChanged = async (e) => {
    setTagText(e.target.value)
  }



  const genGlobalTagElems = () => {

    const handleDelete = async (e) => {
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

    const handleEdit = async (e) => {
      e.stopPropagation()
      const tagId = parseInt(e.currentTarget.closest(".tag").attributes["data-tag-id"].value)
      const tag = tags.filter(tag => tag.id === tagId)[0]
      setTagText(tag.text)
      setColorValue(tag.color)
      setTagEditMode(`edit${tagId}`)

    }
    const clickables = tagEditMode ? (
      <>
        <HiPencil className="tag-icon clickable" size="12" onClick={handleEdit} />
        <FaTimes className="tag-icon clickable" size="12" onClick={handleDelete} />
      </>
    ) : null

    return tags.map((tag) => <Tag key={tag.id} tag={tag} clickables={clickables} />)
  }



  return (
    <div className="App">
      <ToastContainer ref={toasts} />
      <div>

      </div>
      <Header />
      <div className="container">
        {tasks.map((task) => <Task context={context} tags={tags /* consider useContext */} key={task.id} task={task} isCreated={true}
          tags={tags} />)}
        <Task context={context} isCreated={false} tags={tags} />
        <button onClick={magic}>Magic!</button>
      </div>

      <div id="tags-footer">
        <div id="tag-editor" className={tagEditMode.match(/create|edit\d+/) ? "" : "hidden"}>
          <div id="tag-preview-container">
            <Tag passRef={ref2} tag={{ "color": colorValue, "text": tagText }} editable={true} onBlur={(callback)} />

          </div>
          <div className="tag-input-wrapper">
            <input id="tag-input-text" className="themed-input"
              value={tagText} placeholder="Tag name" onChange={tagChanged} />

          </div>
          <div className="tag-input-wrapper">
            <img className="clickable" src={svgColorWheel} width="20px" onClick={() => col.current.click()} />
            <span>
              <input id="tag-input-color" className={`themed-input${validateColor(colorValue) ? "" : " red"}`}
                maxLength={7} value={colorValue} placeholder="Color (hex value)" onChange={colorChange} />

            </span>

          </div>

        </div>
        <div id="tag-test">
          {genGlobalTagElems()}
          <input id="col" ref={col} type="color" value={colorValue} onChange={colorChange} />
          {
            ((str) => {
              switch (str) {
                case "":
                  return <HiPencil className="clickable" onClick={gotoMenu} />
                case "menu":
                  return <AiOutlinePlusCircle className="clickable" size="20" onClick={creatingNewTag} />
                case "create":
                  return <AiOutlineCheckCircle className="clickable" size="20" onClick={newTagDone} />
                case str.match(/^edit\d+$/)?.input:
                  return <AiOutlineCheckCircle className="clickable" size="20" onClick={newTagDone} />
                default:
                  console.log(str)
                  return "OOPS"
              }
            })(tagEditMode)
          }
        </div>
      </div>
    </div>
  )
}

export default App
