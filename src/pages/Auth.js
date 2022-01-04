import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../utils/auth';

import './Auth.css'

const Auth = ({ type, context }) => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const emailChanged = (e) => setEmail(e.target.value)
  const passwordChanged = (e) => setPassword(e.target.value)


  const headerText = type === "signin" ? "Sign in" : type === "signup" ? "Let's get started!" : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (type === "signin") {
      await signIn(context, navigate, email, password)
    } else if (type === "signup") {
      await signUp(context, navigate, email, password)
    }
  }

  return (
    <div>
      <div id="auth">
        <h1 id="auth__header">{headerText}</h1>
        <input className="themed-input auth__input" type="text" placeholder="Email" value={email} onChange={emailChanged} />
        <input className="themed-input auth__input" type="password" placeholder="Password" value={password} onChange={passwordChanged} />
        <button id="auth__submit" type="submit" onClick={handleSubmit}>Let's go!</button>
      </div>
    </div>
  )
}

export default Auth
