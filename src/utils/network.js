const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


export const httpGet = async (dir) => {
  const endpoint = `${BACKEND_URL}${dir}`
  try {
    const r = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include'
    })
    return r
  } catch (ex) {
    return { ok: false }
  }
}

export const httpPost = async (dir, data) => {
  const endpoint = `${BACKEND_URL}${dir}`
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return r
  } catch {
    return { ok: false }
  }
}


export const httpPostFile = async (dir, file) => {
  const data = new FormData()
  data.append('photo', file)

  const endpoint = `${BACKEND_URL}${dir}`
  console.log(file)
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: {
      // 'Content-type': 'application/json',
    },
    body: data,
    credentials: 'include'

  })
  return r
}

export const httpDelete = async (dir) => {
  const endpoint = `${BACKEND_URL}${dir}`
  try {
    const r = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include'
    })
    return r
  } catch {
    return { ok: false }
  }
}

export const httpPatch = async (dir, data) => {
  const endpoint = `${BACKEND_URL}${dir}`
  try {
    const r = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return r
  } catch {
    return { ok: false }
  }
}
