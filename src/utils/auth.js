import { httpGet, httpPost } from 'utils/network.js'

const githubAuthoriseUrl = 'https://github.com/login/oauth/authorize'
const googleAuthoriseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'


export const getUser = async () => {
  const r = await httpGet("/status")
  return r.text()
}

export const signUp = async (context, navigate, email, password) => {
  const r = await httpPost("/signup", { user: { email, password } })

  // For testing only
  /* if (r.status >= 500) { */
  /*   context.setHtml(await r.text()) */
  /*   return */
  /* } */

  if (r.status !== 200) {
    const msg = r.status === 400 ? await r.text() : "Unknown error"
    context.notify(msg, "pink", 2000)
    return
  }

  context.notify("Successfully created your account!!", "lightgreen", 1000)
  context.setUser(await getUser())
  navigate("/")
}

export const signIn = async (context, navigate, email, password) => {
  const r = await httpPost("/signin", { user: { email, password } })

  // For testing only
  /* if (r.status >= 500) { */
  /*   context.setHtml(await r.text()) */
  /*   return */
  /* } */

  if (r.status !== 200) {
    const msg = r.status === 401 ? "Invalid email or password" : "Unknown error"
    context.notify(msg, "pink", 2000)
    return
  }

  context.notify("Successfully logged in!", "lightgreen", 1000)
  context.setUser(await getUser())
  navigate("/")
}

export const signOut = async () => {
  const dir = "/signout"
  await httpGet(dir)
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
