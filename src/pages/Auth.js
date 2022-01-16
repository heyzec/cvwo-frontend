import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signIn, signUp } from 'utils/auth'
import TextField from 'material/TextField'
import Button from 'material/Button'
import Paper from 'material/Paper'
import Main from 'pages/Main'
import { BsGithub } from 'react-icons/bs'

import 'pages/Auth.css'

const Auth = ({ type, context }) => {

  


  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();



  useEffect(() => {
    
    if (type !== 'auth') {
      return
    }


    if (searchParams.get("outcome") === 'success') {
      context.notify("Logged in successfully!")
    } else {
      context.notify(searchParams.get("message"), 'pink', 4000)

    }
    navigate('/')

    
  }, [])


const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const emailChanged = (e) => setEmail(e.target.value)
const passwordChanged = (e) => setPassword(e.target.value)

const handleSubmit = async (e) => {
  e.preventDefault()

  if (type === "signin") {
    await signIn(context, navigate, email, password)
  } else if (type === "signup") {
    await signUp(context, navigate, email, password)
  }
}

const shadowClicked = (e) => navigate('/')

const github = (e) => {
  e.preventDefault()  // This line is necessary
  window.location.href = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_AUTH_GITHUB_CLIENT_ID}`
}

const headerText = type === "signin" ? "Sign in" : type === "signup" ? "Let's get started!" : null

return (
  <>
    <Main context={context} />
    <div className="auth__drop-shadow" onClick={shadowClicked}></div>
    <Paper className="auth">
      <h1 id="auth__header">{headerText}</h1>
      <form className="auth__form">
        <TextField className="auth__input" type="text" label="Email" value={email} onChange={emailChanged} />
        <TextField className="auth__input" type="password" label="Password" value={password} onChange={passwordChanged} />
        <Button className="auth__submit" variant="contained" onClick={handleSubmit}>Let's go!</Button>
        <Button variant="outlined" startIcon={<BsGithub size="20"/>} onClick={github}>Login with GitHub</Button>
      </form>
    </Paper>
  </>
)
}

export default Auth
