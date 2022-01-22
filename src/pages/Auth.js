import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { BsGithub } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

import { signIn, signUp, authGithubRedirect, authGoogleRedirect } from 'utils/user'
import { Spinner } from 'modules/Loading'
import TextField from 'material/TextField'
import Button from 'material/Button'
import Paper from 'material/Paper'
import Main from 'pages/Main'

import 'pages/Auth.css'
import { httpGet } from 'utils/network'

const Auth = ({ type, context }) => {

  const [buttonLoading, setButtonLoading] = useState(false)
  const [showLoading, setShowLoading] = [context.getShowLoading(), context.setShowLoading]

  const { provider } = useParams()
  const location = useLocation()
  const navigate = useNavigate()


  useEffect(() => {
    const asyncToDo = async () => {  // React's useEffect dislikes async functions
      if (type === 'callback') {
        navigate(`/auth/callback/${provider}`)
        setShowLoading(true)
        context.toasts.info("Please hold on, logging you in...", 3000)
        const params = location.search.substring(1)
        const r = await httpGet(`/auth/${provider}?${params}`)

        let data
        if (r.ok) {
          data = await r.json()
        } else {
          data = { success: false, message: "An error has occurred." }
        }

        if (data.success) {
          if (data.message) {
            context.toasts.delayedSuccess(data.message)
          } else {
            context.toasts.delayedSuccess("Logged in successfully.")
          }
          navigate('/')
          window.location.reload()
        } else {
          context.toasts.error(data.message)
          setShowLoading(false)
          navigate('/signin')
        }
      }
    }
    asyncToDo()
  }, [])



  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const emailChanged = (e) => setEmail(e.target.value)
  const passwordChanged = (e) => setPassword(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setButtonLoading(true)

    if (type === "signin") {
      await signIn(context, navigate, email, password)
    } else if (type === "signup") {
      await signUp(context, navigate, email, password)
    }
    setButtonLoading(false)
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
              buttonLoading
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
