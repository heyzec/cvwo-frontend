const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


export const httpGet = async (dir) => {
  const endpoint = `${BACKEND_URL}${dir}`
  const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include'
  })
  return res
  return {status: res.status, raw: await res.text()}
  if (res.status === 401) {
    console.log("Unauthorized")
    return
  }
  // if (res.status !== 200) {
  //   alert("An error has occured :(")
  //   return
  // }
  return await res.text()
}

export const httpPost = async (dir, data) => {
  const endpoint = `${BACKEND_URL}${dir}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  return res
  return {status: res.status, raw: await res.text()}
  if (res.status !== 201) {
    alert("An error has occured :(")
    return
  }
  return await res.text()
}

export const httpDelete = async (dir) => {
  const endpoint = `${BACKEND_URL}${dir}`
  const res = await fetch(endpoint, {
    method: 'DELETE',
    credentials: 'include'
  })
  return res
  return {status: res.status, raw: await res.text()}
  if (res.status !== 200 && res.status !== 204) {
    alert("An error has occured :(")
    return
  }
  return true
}

export const httpPatch = async (dir, data) => {
  const endpoint = `${BACKEND_URL}${dir}`
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  return res
  return {status: res.status, raw: await res.text()}
  if (res.status !== 200) {
    alert("An error has occured")
    return
  }
  return await res.text()
}
