import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Main from 'pages/Main'
import Auth from 'pages/Auth'
import Sandbox from 'pages/Sandbox'
import Loading from 'components/Loading'
import { ToastContainer } from 'components/Toasts'
import { Context } from 'utils/context'
import { getUser } from 'utils/auth'

import 'App.css'

console.log(`This is a ${process.env.NODE_ENV} environment`)

const App = () => {


  /***** Initialise context object *****/
  const context = new Context()

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [lists, setLists] = useState([])
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)
  context.setListsCallbacks(() => lists, setLists)
  
  const toast = useRef(null)  // Allows us to access functions in the components
  const [user, setUser] = useState("")
  const [html, setHtml] = useState("")
  context.setNotify(() => toast.current.notify)
  context.setUserCallbacks(() => user, setUser)
  context.setHtmlCallbacks(() => html, setHtml)


  /***** Update tasks, tags and lists whenever user changes *****/
  useEffect(() => {
    const doGivenUser = async (user) => {
      if (user) {
        setShowLoading(true)
        await Promise.all([
          context.fetchTags(),
          context.fetchTasks(),
          context.fetchLists()
        ])
        setShowLoading(false)
      } else {
        context.setTags([])
        context.setTasks([])
        context.setLists([])
        context.setCurrentList(null)
      }
    }
    setUser((user) => {
      doGivenUser(user)
      return user
    })
  }, [user])
  

  /***** Ask server what's the current user by sending cookies *****/
  useEffect(() => {
    const asyncToDo = async () => {
      const user = await getUser()
      context.setUser(user)
    }
    asyncToDo()
  }, [])


  /***** Misc *****/
  // The Loading components requires a state too  
  const [showLoading, setShowLoading] = useState(false)
  // Function for testing purposes, triggered upon right clicking of app icon
  const magic = async (e) => {
    context.notify(`lists is now ${lists}`, "lightgreen", 2000)
    console.log(lists)
    context.setCurrentList(1)
  }
  context.setMagic(magic)


  return (
    <div className="App">
      <Loading show={showLoading} />
      <ToastContainer ref={toast} />
      <Router>
        <Routes>
          <Route path="/" element={<Main context={context} />} />
          <Route path="sandbox" element={<Sandbox context={context} />} />
          <Route path="signin" element={<Auth context={context} type="signin" />} />
          <Route path="signup" element={<Auth context={context} type="signup" />} />
          <Route path="auth" element={<Auth context={context} type="auth" />} />
          <Route path="*" element={<h1>Oops, page don't exist!</h1>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
