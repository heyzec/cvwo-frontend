import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

import { signIn, signUp } from 'utils/auth'
import TextField from 'material/TextField'
import Button from 'material/Button'
import Paper from 'material/Paper'
import Main from 'pages/Main'

import 'pages/Auth.css'

const Auth = ({ type, context }) => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {

    if (type !== 'auth') {
      return
    }

    if (searchParams.get("success") === 'true') {
      if (searchParams.has("message")) {
        context.notify(searchParams.get("message"), 'lightgreen', 3000)
      } else {
        context.notify("Logged in successfully", 'lightgreen', 2000)
      }
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

  const extAuthGithubClicked = (e) => {
    const githubAuthoriseUrl = 'https://github.com/login/oauth/authorize'

    e.preventDefault()  // This line is necessary
    const params = {
      scope: 'user:email',
      client_id: process.env.REACT_APP_AUTH_GITHUB_CLIENT_ID
    }
    window.location.href = `${githubAuthoriseUrl}?${new URLSearchParams(params).toString()}`
  }

  const extAuthGoogleClicked = (e) => {
    const googleAuthoriseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    e.preventDefault()
    const params = {
      response_type: 'code',
      scope: 'openid email',
      client_id: process.env.REACT_APP_AUTH_GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.REACT_APP_BACKEND_URL}/auth/google`
    }
    window.location.href = `${googleAuthoriseUrl}?${new URLSearchParams(params).toString()}`
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
          <div className="auth__external">
            <Button className="auth__ext-button" variant="outlined" startIcon={<BsGithub size="20" />} onClick={extAuthGithubClicked}>Login with GitHub</Button>
            <div className="auth__spacer"></div>
            <Button className="auth__ext-button" variant="outlined" startIcon={<FcGoogle size="20" />} onClick={extAuthGoogleClicked}>Login with Google</Button>
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Auth
