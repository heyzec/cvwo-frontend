import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Auth from './pages/Auth';
import Header from './components/Header'
import Loading from './components/Loading';
import { ToastContainer } from './components/Toasts';
import { Context } from './utils/context'
import { getUser } from './utils/auth'

import './App.css';

console.log(`This is a ${process.env.NODE_ENV} environment`)

const App = () => {

  const toast = useRef(null)  // Allows us to access functions in the components

  const [user, setUser] = useState("")
  const [html, setHtml] = useState("")
  const [showLoading, setShowLoading] = useState(false)

  const context = new Context()
  context.setNotify(() => toast.current.notify)
  context.setUserCallbacks(() => user, setUser)
  context.setHtmlCallbacks(() => html, setHtml)


  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)



  // Function for testing purposes
  const magic = async (e) => {
    context.notify(`user is now ${user}`, "lightgreen", 2000)
  }
  // context.setMagic(magic)


  useEffect(() => {
    const asyncToDo = async () => {
      const user = await getUser()
      context.setUser(user)
    }
    asyncToDo()
  }, [])

  useEffect(() => {
    const doGivenUser = async (user) => {
      if (user) {
        setShowLoading(true)
        await Promise.all([context.fetchTags(), context.fetchTasks()])
        setShowLoading(false)
      } else {
        context.setTags([])
        context.setTasks([])
      }
    }
    setUser((user) => {
      doGivenUser(user)
      return user
    })
  }, [user])


  return (
    <div className="App">
      <Loading show={showLoading} />
      <ToastContainer ref={toast} />
      <Router>
        <Header context={context} />
    
        <div id="page">
        <Routes>
          <Route path="/" element={<Main context={context} />} />
          <Route path="signin" element={<Auth context={context} type="signin" />} />
          <Route path="signup" element={<Auth context={context} type="signup" />} />
          <Route path="*" element={<h1>Oops, page don't exist!</h1>} />
        </Routes>

          
        </div>
      </Router>


      {/* This element is only for testing; it shows the server response if an error occurs */}
      {
        // html ? <iframe title="debug" srcdoc={html} onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style={{ height: "500px", width: "100%", border: "none", overflow: "hidden" }} /> : null
      }
    {

      <button onClick={context.magic}>Magic!</button>
      
    }
    </div>
  )
}

export default App
