import { useState, useEffect, useRef } from 'react'

import { Context } from './helpers'
import Header from './components/Header'
import TaskContainer from './components/TaskContainer'
import TagsFooter from './components/TagsFooter';
import Loading from './components/Loading';
import { ToastContainer } from './components/Toasts';

import './App.css';

console.log(`This is a ${process.env.NODE_ENV} environment`)

const App = () => {

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [showSpinner, setShowSpinner] = useState(true)

  // This ref allows us to access functions in the components
  const toast = useRef(null)
  const loadingRef = useRef(null)

  const context = new Context()
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)
  context.setNotify(() => toast.current.notify)


  // Run once after initial rendering
  useEffect(async () => {
    await Promise.all([context.fetchTags(), context.fetchTasks()])
    loadingRef.current.remove()
  }, [])


  // Function for testing purposes
  const magic = async () => {
    context.notify("This button is for testing purposes", "lightgreen", 2000)
  }
  context.setMagic(magic)


  return (
    <div className="App">
      <Loading ref={loadingRef} />
      <ToastContainer ref={toast} />
      <Header />
      <TaskContainer context={context} />
      <TagsFooter context={context} />
      <button onClick={context.magic}>Magic!</button>
    </div>
  )
}

export default App
