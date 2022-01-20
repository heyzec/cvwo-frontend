import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Main from 'pages/Main'
import Auth from 'pages/Auth'
import Settings from 'pages/Settings'
import Sandbox from 'pages/Sandbox'
import Loading from 'components/Loading'
import { ToastContainer } from 'components/Toasts'
import { Context } from 'utils/context'
import { getUser } from 'utils/auth'
import { getUserDetails } from "utils/settings"
import { syncResource } from 'utils/resource'

import 'App.css'

console.log(`This is a ${process.env.NODE_ENV} environment`)


if (!process.env.REACT_APP_FRONTEND_URL) {
  throw "No environmental variables found."
}

const App = () => {
  

  /***** Initialise context object *****/
  const context = new Context()

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [lists, setLists] = useState([])
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)
  context.setListsCallbacks(() => lists, setLists)
  const [selectedListId, setSelectedListId] = useState(null)
  context.setSelectedListIdCallbacks(() => selectedListId, setSelectedListId)
  
  const [internet, setInternet] = useState(navigator.onLine)
  context.setInternetCallbacks(() => internet, setInternet)

  
  const toast = useRef(null)  // Allows us to access functions in the components
  const [user, setUser] = useState("")
  const [userId, setUserId] = useState(null)
  context.setNotify(() => toast.current.notify)
  context.setUserCallbacks(() => user, setUser)
  context.setUserIdCallbacks(() => userId, setUserId)
  
  
  // The Loading components requires a state too  
  const [showLoading, setShowLoading] = useState(false)


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
        setUserId((await getUserDetails()).id)
      } else {
        context.setTags([])
        context.setTasks([])
        context.setLists([])
        context.setSelectedListId(null)
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
    window.addEventListener('online', () => {
      setInternet(true)
      context.notify("You're back online! We'll now sync with the server...", "lightgreen", 4000)
      syncResource('lists', context.setLists)
      syncResource('tasks', context.setTasks)
      syncResource('tags', context.setTags)
    })

    window.addEventListener("offline", () => {
      setInternet(false)
      context.notify("You are offline!", "firebrick", 4000)
      context.internetStatus = "offline"
    })
  }, [])


  /***** Misc *****/
  // Function for testing purposes, triggered upon right clicking of app icon
  const magic = async (e) => {
    context.notify(`internet is ${internet}`)
    console.log(lists)

  }
  context.setMagic(magic)


  return (
    <div className="App">
      <Loading show={showLoading} />
      <ToastContainer ref={toast} />
      <Router>
        <Routes>
          <Route path="/" element={<Main context={context} />} />
          <Route path="share/:hash" element={<Main context={context} />} />
          <Route path="signin" element={<Auth context={context} type="signin" />} />
          <Route path="signup" element={<Auth context={context} type="signup" />} />
          <Route path="settings" element={<Settings context={context} />} />
          <Route path="auth" element={<Auth context={context} type="auth" />} />
          <Route path="sandbox" element={<Sandbox context={context} />} />
          <Route path="*" element={<h1>Oops, page don't exist!</h1>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
