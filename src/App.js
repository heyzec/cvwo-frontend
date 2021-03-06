import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Main from 'pages/Main'
import Auth from 'pages/Auth'
import Settings from 'pages/Settings'
import Sandbox from 'pages/Sandbox'

import Context from 'utils/Context'
import { getUser } from 'utils/user'
import { syncResources } from 'utils/resource'
import { objectHashed } from 'utils/funcs'
import { vimAddListener, vimRemoveListener, vimDispatcher } from 'utils/helpers'

import useStorageState from 'modules/useStorageState'
import Loading from 'modules/Loading'
import { ToastContainer } from 'modules/Toasts'

import 'App.css'

if (!process.env.REACT_APP_FRONTEND_URL) {
  throw new Error("No environmental variables found.")
}

const App = () => {

  // ---------------- Initialise context object and associated states ----------------
  const [context,] = useState(() => new Context())

  const [lists, setLists] = useState(null)                             // User data
  const [tasks, setTasks] = useState(null)                             // User data
  const [tags, setTags] = useState(null)                               // User data
  context.setListsCallbacks(() => lists, setLists)
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)


  const [user, setUser] = useStorageState("user", null)              // Stores object containing user details (kept in local storage)
  context.setUserCallbacks(() => user, setUser)


  const [internet, setInternet] = useState(navigator.onLine)         // Whether or not online - affects some behaviour of app
  context.setInternetCallbacks(() => internet, setInternet)

  const [showLoading, setShowLoading] = useState(true)              // The Loading components requires a state too  
  context.setShowLoadingCallbacks(() => showLoading, setShowLoading)

  const [darkMode, setDarkMode] = useStorageState("darkMode", false)
  context.setDarkModeCallbacks(() => darkMode, setDarkMode)

  const [keyMappings, setKeyMappings] = useState([])
  context.setKeyMappingsCallbacks(() => keyMappings, setKeyMappings)

  // ---------------- Initialise more states for use within this component  ----------------

  const [lastHash, setLastHash] = useStorageState('lasthash', null)  // A hash of variables lists, tasks, tags (kept in local storage)
  const toastRef = useRef(null)                                      // Allows us to access functions in the Toasts component
  context.setToastRef(() => toastRef)





  /***** Helper functions ****/

  const loadFromStorage = (user, setLists, setTasks, setTags) => {
    const storageDataKey = user ? "user_data" : "guest_data"
    let parsed
    try {
      const raw = window.localStorage.getItem(storageDataKey)
      if (raw) {
        parsed = JSON.parse(raw)
      } else {
        throw new Error()
      }
    } catch (ex) {
      parsed = { lists: [], tasks: [], tags: [] }
    }
    setLists(parsed.lists)
    setTasks(parsed.tasks)
    setTags(parsed.tags)
  }

  const putIntoStorage = (user, lists, tasks, tags) => {
    if (!(lists?.length + tasks?.length + tags?.length)) {  // If all are length 0 or any is null
      return  // No need to store if there's no user data at all
    }
    const storageDataKey = user ? "user_data" : "guest_data"
    window.localStorage.setItem(storageDataKey, JSON.stringify(
      { lists, tasks, tags }
    ))
  }



  // Run once only on component load
  useEffect(() => {
    if (window.location.href.includes('auth/callback')) {
      return
    }
    const asyncToDo = async () => {  // React's useEffect dislikes async functions
      const t = setTimeout(() => context.toasts.info("Backend is waking up from hibernation, please hold on...", 6000), 8000)
      const userDetails = await getUser()
      clearTimeout(t)
      if (userDetails === undefined) {
        // A bad request/network error occurred.
        context.toasts.error("Unable to connect to server. You are in offline mode.")
        loadFromStorage(user, setLists, setTasks, setTags)
        setInternet(false)
        setShowLoading(false)
        return
      }

      setUser(userDetails)
      loadFromStorage(user, setLists, setTasks, setTags)
      if (!user) {
        setShowLoading(false)
        return
      }
      await Promise.all([
        context.fetchTags(),
        context.fetchTasks(),
        context.fetchLists()
      ])
      setShowLoading(false)
      
      
      window.addEventListener("offline", () => {
        setInternet(false)
        context.toasts.error("You are offline!")
      })
    }
    asyncToDo()
  }, [])
  

  
  // useEffect(() => {
  //   const timerId = setInterval(
  //     () => setNowString(dayjs().format("dddd, DD MMMM YYYY, HH:mm")),
  //     1000
  //   )

  //   // Return cleanup function when component unmounts
  //   return () => clearInterval(timerId)
  // }, [])

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
      let duration = 2000
      if (lastHash !== objectHashed({ lists, tasks, tags })) {
        msg += " We'll now sync changes with the server."
        duration = 4000
        setShowLoading(true)
        syncResources(setLists, setTasks, setTags).then(
          () => setShowLoading(false)
        )
      }
      context.toasts.success(msg, duration)
    }

    if (user) {
      window.addEventListener('online', handler)
      return () => window.removeEventListener('online', handler)
    }
  }, [internet, lists, tasks, tags])


  // ---------------- Detect keypresses and let vimDispatcher handle ----------------

  const [keys, setKeys] = useState("")
  const [keyTimeout, setKeyTimeout] = useState(null)


  useEffect(() => {
    const arr = []
    arr.push(vimAddListener(keyMappings, 'x', () => {
      setDarkMode((mode) => !mode)
      context.toasts.info(`Dark mode ${darkMode ? "disabled." : "enabled!"}`)
    }))
    arr.push(vimAddListener(keyMappings, 'Control', () => {
      context.magic()
    }))
    return () => arr.forEach(vimRemoveListener)
  }, [darkMode])


  // This handles all (exclude when input is focused) key presses for shortcuts
  useEffect(() => {
    const keyPressed = (e) => {
      if (showLoading) {
        return
      }
      vimDispatcher(e, keyMappings, setKeys, setKeyTimeout, 800, context)
    }
    window.addEventListener('keydown', keyPressed)
  }, [showLoading])


  // ---------------- Misc  ----------------
  /** Function for testing purposes */
  const magic = async (e) => {
    context.toasts.success("You've created a delayed toast")
    context.toasts.delayedSuccess("I'm a delayed toast!")
  }
  context.setMagic(magic)



  return (
    <div className={`App${darkMode ? " dark" : ""}`} >
      <ToastContainer ref={toastRef} />
      <Loading show={showLoading} />
      <Router>
        <Routes>
          <Route path="/" element={<Main context={context} />} />
          <Route path="share/:hash" element={<Main context={context} />} />
          <Route path="auth" element={<Auth context={context} type="auth" />} />
          <Route path="auth/callback/:provider" element={<Auth context={context} type="callback" />} />
          <Route path="signin" element={<Auth context={context} type="signin" />} />
          <Route path="signup" element={<Auth context={context} type="signup" />} />
          <Route path="settings" element={<Settings context={context} />} />
          <Route path="sandbox" element={<Sandbox context={context} />} />
          <Route path="*" element={<h1>Oops, page don't exist!</h1>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
