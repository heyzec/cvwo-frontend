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
  const [context, ] = useState(() => {
    const context = new Context()
    return context
  })

  const toast = useRef(null)  // This ref allows us to access functions in the ToastContainer


  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)

  // Run once after initial rendering
  useEffect(() => {
    context.fetchTags()  // For now, the tags must be fetched first
    context.fetchTasks()
    context.setNotify(toast.current.notify)
    window.addEventListener('online', () => {
      context.internetStatus = "online"
      context.notify("You're back online! We'll now sync with the server...", "lightgreen", 4000)
      context.syncResource('tasks')
    })

    window.addEventListener("offline", () => {
      context.notify("You are offline!", "firebrick", 4000)
      context.internetStatus = "offline"

    })
  }, [])


  const [counter, setCounter] = useState(0)





  // Function for testing purposes
  const magic = async () => {
    console.log(context.getTasks())
    console.log(context.getTags())
    context.notify("hi!!!", "lightgreen", 2000)
  }
  context.setMagic(magic)


  return (
    <div className="App">
      <ToastContainer ref={toast} />
      <Header />
      <TaskContainer context={context} />
      <TagsFooter context={context} />
      <button onClick={context.magic}>Magic!</button>
      <h1>{counter}</h1>
    </div>
  )
}

export default App
