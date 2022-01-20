import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Main from 'pages/Main'
import Auth from 'pages/Auth'
import Settings from 'pages/Settings'
import Sandbox from 'pages/Sandbox'

import Loading from 'components/Loading'
import { ToastContainer } from 'components/Toasts'

import { Context } from 'utils/context'
import { getUser } from "utils/user"
import { syncResources } from 'utils/resource'
import { objectHashed } from 'utils/funcs'
import useStorageState from 'utils/useStorageState'

import 'App.css'

console.log(`This is a ${process.env.NODE_ENV} environment`)

if (!process.env.REACT_APP_FRONTEND_URL) {
  throw "No environmental variables found."
}

const App = () => {

  /***** Initialise context object and associated states *****/
  const context = new Context()

  const [lists, setLists] = useState([])                             // User data
  const [tasks, setTasks] = useState([])                             // User data
  const [tags, setTags] = useState([])                               // User data
  context.setListsCallbacks(() => lists, setLists)
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)


  const [user, setUser] = useStorageState("user", null)              // Stores object containing user details (kept in local storage)
  context.setUserCallbacks(() => user, setUser)

  const [selectedListId, setSelectedListId] = useState(null)         // The current list user is looking at
  context.setSelectedListIdCallbacks(
    () => selectedListId, setSelectedListId
  )

  const [internet, setInternet] = useState(navigator.onLine)         // Whether or not online - affects some behaviour of app
  context.setInternetCallbacks(() => internet, setInternet)



  /***** Initialise more states for use within this component *****/

  const [lastHash, setLastHash] = useStorageState('lasthash', null)  // A hash of variables lists, tasks, tags (kept in local storage)
  const [showLoading, setShowLoading] = useState(false)              // The Loading components requires a state too  


  const toast = useRef(null)                                         // Allows us to access functions in the components
  context.setNotify(() => toast.current.notify)



  /***** Helper functions ****/

  const fetchAllData = async () => {
    setShowLoading(true)
    await Promise.all([
      context.fetchTags(),
      context.fetchTasks(),
      context.fetchLists()
    ])
    setShowLoading(false)
  }

  const loadFromStorage = (user, setLists, setTasks, setTags) => {
    const storageDataKey = user ? "user_data" : "guest_data"
    let parsed
    try {
      const raw = window.localStorage.getItem(storageDataKey)
      if (raw) {
        parsed = JSON.parse(raw)
      } else {
        throw "error"
      }
    } catch (ex) {
      parsed = { lists: [], tasks: [], tags: [] }
    }
    setLists(parsed.lists)
    setTasks(parsed.tasks)
    setTags(parsed.tags)
  }

  const putIntoStorage = (user, lists, tasks, tags) => {
    if (lists.length + tasks.length + tags.length === 0) {
      return  // No need to store if there's no user data at all
    }
    const storageDataKey = user ? "user_data" : "guest_data"
    window.localStorage.setItem(storageDataKey, JSON.stringify(
      { lists, tasks, tags }
    ))
  }
  

  
  /***** useEffect hooks ****/

  // Run once only on component load
  useEffect(async () => {
    const userDetails = await getUser()
    setUser(userDetails)
    loadFromStorage(user, setLists, setTasks, setTags)
    if (!user) {
      return
    }

    fetchAllData()  // Async function but not awaiting
    window.addEventListener("offline", () => {
      setInternet(false)
      context.notify("You are offline!", "firebrick", 4000)
    })
  }, [])

  // On data changes, update local storage and check if need to sync with server
  useEffect(() => {
    if (internet) {
      setLastHash(objectHashed({ lists, tasks, tags }))
    }
    putIntoStorage(user, lists, tasks, tags)

    const handler = (e) => {
      if (!user) {
        return
      }
      setInternet(true)
      let msg = "You're back online!"
      if (lastHash !== objectHashed({ lists, tasks, tags })) {
        msg += " We'll now sync with the server."
        syncResources(setLists, setTasks, setTags)  // Async function but not awaiting
      }
      context.notify(msg, "lightgreen", 4000)
    }

    if (user) {
      window.addEventListener('online', handler)
      return () => window.removeEventListener('online', handler)
    }
  }, [internet, lists, tasks, tags])



  /***** Misc *****/
  // Function for testing purposes, triggered upon right clicking of app icon
  const magic = async (e) => {
    console.log("Lists")
    console.log([...lists])
    console.log("Tasks")
    console.log([...tasks])

    // setTest(test + 1)

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
