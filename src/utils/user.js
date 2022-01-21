import { httpGet, httpPost } from 'utils/network.js'

const githubAuthoriseUrl = 'https://github.com/login/oauth/authorize'
const googleAuthoriseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'


export const getUser = async () => {
  const r = await httpGet("/user")
  return r.json()
}

export const signUp = async (context, navigate, email, password) => {
  const r = await httpPost("/signup", { user: { email, password } })

  if (r.status !== 200) {
    const msg = r.status === 400 ? await r.text() : "Unknown error"
    context.notify(msg, "pink", 2000)
    return
  }

  context.notify("Successfully created your account!!", "lightgreen", 1000)
  context.setUser(await getUser())
  navigate("/")
  window.location.reload()
}

export const signIn = async (context, navigate, email, password) => {
  const r = await httpPost("/signin", { user: { email, password } })

  if (r.status !== 200) {
    const msg = r.status === 401 ? "Invalid email or password" : "Unknown error"
    context.notify(msg, "pink", 2000)
    return
  }

  context.notify("Successfully logged in!", "lightgreen", 1000)
  context.setUser(await getUser())
  navigate("/")
  window.location.reload()
}

export const signOut = async (context, navigate) => {
  await httpGet("/signout")
  window.localStorage.removeItem('user_data')
  navigate("/")
  context.setUser(null)
  context.notify("Logged out!", "lightgreen", 1000)
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
    redirect_uri: `${process.env.REACT_APP_BACKEND_URL}/auth/google`
  }
  window.location.href = `${googleAuthoriseUrl}?${new URLSearchParams(params).toString()}`
}
