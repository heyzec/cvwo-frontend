import { useState, useEffect, useRef } from 'react'
import './App.css';
import Header from './components/Header'
import Task from './components/Task'
import Tag from './components/Tag'
import svgColorWheel from './resources/colorwheel.png'
import { AiOutlinePlusCircle, AiOutlineCheckCircle } from 'react-icons/ai'

import { Helpers } from './helpers'

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
  // const [datetime, setDatetime] = useState(dayjs())
  // 

  const [tagEditable, setTagEditable] = useState(false)
  // 
  const [colorValue, setColorValue] = useState("")
  const colorChange = (e) => setColorValue(e.target.value)

  const h = new Helpers()
  h.setTasksCallbacks(() => tasks, setTasks)
  h.setTagsCallbacks(() => tags, setTags)
  const fetchTasks = h.fetchTasks
  const addTask = h.addTask
  const editTask = h.editTask
  const deleteTask = h.deleteTask
  const fetchTags = h.fetchTags
  const addTag = h.addTag
  const context = h


  const col = useRef(null)
  const ref2 = useRef(null)




  // Run once after initial rendering
  useEffect(() => {
    fetchTags()  // For now, the tags must be fetched first
    fetchTasks()
  }, [])

  const [test, setTest] = useState(false)
  const [tagText, setTagText] = useState(Math.random())  // tagText is a ugly workaround

  // Function for testing purposes
  const magic = async (e) => {
    console.log(window)
    window.addEventListener('click', (e) => {
      alert("HI")
    }, { once: true }
    )
    e.stopPropagation()
  }

  const callback = () => {
    console.log("The following is ref2")
    console.log(ref2)
  }

  const creatingNewTag = () => {
    setTagEditable(true)
    ref2.current.focus()
    setColorValue(colorPalatte[0])
  }

  const newTagDone = async () => {
    await context.addTag({
      "text": ref2.current.textContent,
      "color": colorValue
    })
    setTagEditable(false)
    setTagText(Math.random())
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        {tasks.map((task) => <Task context={context} tags={tags /* consider useContext */} key={task.id} task={task} isCreated={true}
          tags={tags} />)}
        <Task context={context} isCreated={false} tags={tags} />
        <button onClick={magic}>Magic!</button>
      </div>

      <div id="tag-test">
        {tags.map((tag) => <Tag key={tag.id} tag={tag} />)}
        <input id="col" ref={col} type="color" value={colorValue} onChange={colorChange} />
        <Tag key={tagText} passRef={ref2} color={colorValue} className={tagEditable ? "" : "lower"} editable={true} value="" onBlur={(callback)} />

        {
          tagEditable
            ? <AiOutlineCheckCircle className="clickable" onClick={newTagDone} />
            : <AiOutlinePlusCircle className="clickable" onClick={creatingNewTag} />
        }

        <img className="clickable" src={svgColorWheel} width="20px" onClick={() => col.current.click()} />

      </div>
    </div>
  );
}

export default App;
