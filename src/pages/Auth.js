import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

import { signIn, signUp, authGithubRedirect, authGoogleRedirect } from 'utils/user'
import { Spinner } from 'modules/Loading'
import TextField from 'material/TextField'
import Button from 'material/Button'
import Paper from 'material/Paper'
import Main from 'pages/Main'

import 'pages/Auth.css'

const Auth = ({ type, context }) => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (type !== 'auth') {
      return
    }

    if (searchParams.get("success") === 'true') {
      if (searchParams.has("message")) {
        context.toasts.success(searchParams.get("message"))
      } else {
        context.toasts.success("Logged in successfully.")
      }
    } else {
      context.toasts.error(searchParams.get("message"))
    }
    navigate('/')

  }, [])



  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const emailChanged = (e) => setEmail(e.target.value)
  const passwordChanged = (e) => setPassword(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (type === "signin") {
      await signIn(context, navigate, email, password)
    } else if (type === "signup") {
      await signUp(context, navigate, email, password)
    }
    setLoading(false)
  }

  const shadowClicked = (e) => navigate('/')

  const extAuthGithubClicked = (e) => {
    e.preventDefault()  // This line is necessary
    authGithubRedirect()
  }

  const extAuthGoogleClicked = (e) => {
    e.preventDefault()
    authGoogleRedirect()
  }

  const headerText = type === "signin" ? "Sign in" : type === "signup" ? "Let's get started!" : null

  return (
    <>
      <Main context={context} />
      <div className="auth__drop-shadow" onClick={shadowClicked}></div>
      <Paper className="auth">
        <h1 id="auth__header">{headerText}</h1>
        <form className="auth__form">
          <TextField
            className="auth__input"
            type="text"
            label="Email"
            value={email}
            onChange={emailChanged}
          />
          <TextField
            className="auth__input"
            type="password"
            label="Password"
            value={password}
            onChange={passwordChanged}
          />
          <Button className="auth__submit" variant="contained" onClick={handleSubmit}>
            {
              loading
                ? <Spinner size="18" />
                : "Let's go!"
            }
          </Button>
          <div className="auth__external">
            <Button
              className="auth__ext-button"
              variant="outlined"
              startIcon={<BsGithub size="20" />}
              onClick={extAuthGithubClicked}
            >
              Login with GitHub
            </Button>
            <div className="auth__spacer"></div>
            <Button
              className="auth__ext-button"
              variant="outlined"
              startIcon={<FcGoogle size="20" />}
              onClick={extAuthGoogleClicked}
            >
              Login with Google
            </Button>
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Auth
