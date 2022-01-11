import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from 'utils/auth'
import TextField from 'material/TextField'
import Button from 'material/Button'
import Paper from 'material/Paper'

import 'pages/Auth.css'

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
    <Paper className="auth">
        <h1 id="auth__header">{headerText}</h1>
        <form className="auth__form">
          <TextField className="auth__input" type="text" label="Email" value={email} onChange={emailChanged} />
          <TextField className="auth__input" type="password" label="Password" value={password} onChange={passwordChanged} />
          <Button className="auth__submit" variant="contained" onClick={handleSubmit}>Let's go!</Button>
        </form>
      
    </Paper>
    </div>
  )
}

export default Auth
