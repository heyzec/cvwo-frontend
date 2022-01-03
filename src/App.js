import { useState, useEffect, useRef } from 'react'

import { Context } from './helpers'
import Main from './pages/Main';
import Auth from './pages/Auth';
import Header from './components/Header'
import { ToastContainer } from './components/Toasts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

console.log(`This is a ${process.env.NODE_ENV} environment`)

const App = () => {


  // This ref allows us to access functions in the components
  const toast = useRef(null)

  const [html, setHtml] = useState("")

  const context = new Context()
  context.setNotify(() => toast.current.notify)
  context.setHtmlCallbacks(() => html, setHtml)

  // Function for testing purposes
  // const magic = async () => {
  //   context.notify("This button is for testing purposes", "lightgreen", 2000)
  // }
  const magic = async (e) => {
    e.preventDefault()
    const endpoint = 'http://localhost:3000/status'
    
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include'
    })
    const output = await res.text()
    if (res.headers.get("Content-Type").includes("html")) {
      setHtml(output)
    } else {
      context.notify(output, "lightgreen", 2000)
    }
  }
  context.setMagic(magic)


  return (
    <div className="App">
      <ToastContainer ref={toast} />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main context={context} />} />
          <Route path="signin" element={<Auth context={context} type="signin" />} />
          <Route path="signup" element={<Auth context={context} type="signup" />} />
          <Route path="*" element={<h1>Oops, page don't exist!</h1>} />
        </Routes>
      </Router>
    

    
    {// This element is only for testing; it shows the server response if an error occurs
      html ? <iframe srcdoc={html} onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style={{height: "500px", width:"100%", border:"none", overflow:"hidden"}} /> : null
    }
      <button onClick={context.magic}>Magic!</button>
    </div>
  )
}

export default App
