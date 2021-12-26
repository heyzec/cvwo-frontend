import { useState, useEffect, useRef } from 'react'

import { Context } from './helpers'
import Header from './components/Header'
import TaskContainer from './components/TaskContainer'
import TagsFooter from './components/TagsFooter';
import { ToastContainer } from './components/Toasts';

import './App.css';

console.log(`This is a ${process.env.NODE_ENV} environment`)

const App = () => {

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])

  const toast = useRef(null)  // This ref allows us to access functions in the ToastContainer

  const context = new Context()
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)
  context.setNotify(() => toast.current.notify)


  // Run once after initial rendering
  useEffect(() => {
    context.fetchTags()  // For now, the tags must be fetched first
    context.fetchTasks()
  }, [])


  // Function for testing purposes
  const magic = async () => {
    context.notify("You can make lwidth, height...", "lightgreen", 2000)
  }
  context.setMagic(magic)


  return (
    <div className="App">
      <ToastContainer ref={toast} />
      <Header />
      <TaskContainer context={context} />
      <TagsFooter context={context} />
      <button onClick={context.magic}>Magic!</button>
    </div>
  )
}

export default App
