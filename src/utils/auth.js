import { httpGet, httpPost } from 'utils/network.js'


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
