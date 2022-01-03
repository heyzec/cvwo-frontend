import { useState, useEffect, useRef } from 'react'

const Auth = ({ type, context }) => {
  

  const endpoint = `http://localhost:3000/${type}`
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [html, setHtml] = useState("")

  const emailChanged = (e) => {console.log("yay"); setEmail(e.target.value)}
  const passwordChanged = (e) => setPassword(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = {
      user: { email, password: password}
    }
    
    console.log(JSON.stringify(data))
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    const output = await res.text()
    if (res.headers.get("Content-Type").includes("html")) {
      context.setHtml(output)
    } else {
      context.notify(output, "lightgreen", 2000)
    }
    
  }

  return (
    <div>
     <h1>{type}</h1>
    <form action="http://localhost:5000/signin" method="post" onSubmit={handleSubmit}>
      
     <input type="text" name="user[email]" placeholder="email" value={email} onChange={emailChanged}/>
     <input type="password" placeholder="password" name="user[password_digest]" value={password} onChange={passwordChanged} /> 
    <input type="submit" value="Submit"/>
    </form>
    </div>
  
  )
}

export default Auth
