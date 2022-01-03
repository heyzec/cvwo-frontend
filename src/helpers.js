const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


const httpGet = async (resource) => {
  const endpoint = `${BACKEND_URL}/${resource}`
  console.debug(`HTTP GET: ${endpoint}`)
  const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include'
  })
  if (res.status === 401) {
    console.log("Unauthorized")
    return
  }
  if (res.status !== 200) {
    alert("An error has occured :(")
    return
  }
  return await res.json()
}

const httpPost = async (resource, data) => {
  const endpoint = `${BACKEND_URL}/${resource}`
  console.debug(`HTTP POST: ${endpoint}`)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  if (res.status !== 201) {
    alert("An error has occured :(")
    return
  }
  return await res.json()
}

const httpDelete = async (resource, id) => {
  const endpoint = `${BACKEND_URL}/${resource}/${id}`
  console.debug(`HTTP DELETE: ${endpoint}`)
  const res = await fetch(endpoint, {
    method: 'DELETE',
    credentials: 'include'
  })
  if (res.status !== 200 && res.status !== 204) {
    alert("An error has occured :(")
    return
  }
  return true
}

const httpPatch = async (resource, id, data) => {
  const endpoint = `${BACKEND_URL}/${resource}/${id}`
  console.debug(`HTTP PATCH: ${endpoint}`)
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  if (res.status !== 200) {
    alert("An error has occured")
    return
  }
  return await res.json()
}


class Context {

  setTasksCallbacks = (getTasks, setTasks) => {
    this.getTasks = getTasks
    this.setTasks = setTasks
  }

  setTagsCallbacks = (getTags, setTags) => {
    this.getTags = getTags
    this.setTags = setTags
  }
  
  setHtmlCallbacks = (getHtml, setHtml) => {
    this.getHtml = getHtml
    this.setHtml = setHtml
  }

  setNotify = (notifyCallback) => {
    this.notify = (...args) => notifyCallback()(...args)
  }

  setMagic = (callback) => {
    this.magic = callback
  }


  // READ from db - Run once after initial rendering
  fetchTasks = async () => {
    const output = await httpGet("tasks")
    if (output) {
      this.setTasks(output)
    }
  }

  // CREATE task and insert into db
  addTask = async (data) => {
    const newTask = await httpPost("tasks", data)
    if (newTask) {
      this.setTasks([...this.getTasks(), newTask])
    }
  }

  // DELETE task from db
  deleteTask = async (id) => {
    const output = await httpDelete("tasks", id)
    if (output) {
      this.setTasks(this.getTasks().filter((task) => task.id !== id))
    }
  }

  // UPDATE task in db
  editTask = async (id, data) => {
    const output = await httpPatch("tasks", id, data)
    if (output) {
      this.setTasks([...this.getTasks().map((task) => {
        if (task.id !== id) {
          return task
        }
        return Object.assign({}, task, data)
      })])
    }
  }

  // READ tags from db
  fetchTags = async () => {
    const output = await httpGet("tags")
    if (output) {
      this.setTags(output)
    }
  }


  // CREATE tag and insert into db
  addTag = async (data) => {
    const newTag = await httpPost("tags", data)
    if (newTag) {
      this.setTags([...this.getTags(), newTag])
    }
  }

  // DELETE tag from db
  deleteTag = async (id) => {
    const output = await httpDelete("tags", id)
    if (output) {
      this.setTags(this.getTags().filter((tag) => tag.id !== id))
    }
  }

  // UPDATE tag in db
  editTag = async (id, data) => {
    const output = await httpPatch("tags", id, data)
    if (output) {
      this.setTags([...this.getTags().map((tag) => {
        if (tag.id !== id) {
          return tag
        }
        return Object.assign({}, tag, data)
      })])
    }
  }
}

export { Context }
