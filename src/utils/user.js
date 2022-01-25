import { httpGet, httpPost } from 'utils/network.js'

const githubAuthoriseUrl = 'https://github.com/login/oauth/authorize'
const googleAuthoriseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'


/** Returns an object with user details if user session data is in cookies. If error occurs, returns undefined. */
export const getUser = async () => {
  const r = await httpGet("/user")
  if (r.ok) {
    return await r.json()
  }
  return undefined
}

export const signUp = async (context, navigate, email, password) => {
  const r = await httpPost("/signup", { user: { email, password } })

  if (r.status !== 200) {
    const msg = r.status === 400 ? await r.text() : "Unknown error"
    context.toasts.error(msg)
    return
  }

  context.toasts.delayedSuccess("Successfully created your account!")
  context.setUser(await getUser())
  navigate("/")
  window.location.reload()
}

export const signIn = async (context, navigate, email, password) => {
  const r = await httpPost("/signin", { user: { email, password } })

  if (r.status !== 200) {
    const msg = r.status === 401 ? "Invalid email or password" : "Unknown error"
    context.toasts.error(msg)
    return
  }
  
  const user = await getUser()
  context.setUser(user)
  context.toasts.delayedSuccess(`Welcome back ${user.email}!`)
  navigate("/")
  window.location.reload()
}

export const signOut = async (context, navigate) => {
  await httpGet("/signout")
  window.localStorage.removeItem('user_data')
  navigate("/")
  context.setUser(null)
  context.toasts.delayedSuccess("Logged out!")
  window.location.reload()
}

export const deleteAccount = async (context, navigate) => {
  const r = await httpPost("/closeaccount", {})
  if (r.status !== 200) {
    const msg = r.status === 400 ? await r.text() : "Unknown error"
    return
  }
  context.setUser(null)
  const message = "Your account has been deleted. Goodbye!"
  context.toasts.delayedSuccess(message)
  navigate('/')
  window.location.reload()
}

export const authGithubRedirect = () => {
  const params = {
    scope: 'user:email',
    client_id: process.env.REACT_APP_AUTH_GITHUB_CLIENT_ID
  }
  window.location.href = `${githubAuthoriseUrl}?${new URLSearchParams(params).toString()}`
}

export const authGoogleRedirect = () => {
  const params = {
    response_type: 'code',
    scope: 'openid email',
    client_id: process.env.REACT_APP_AUTH_GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_FRONTEND_URL}/auth/callback/google`
  }
  window.location.href = `${googleAuthoriseUrl}?${new URLSearchParams(params).toString()}`
}
