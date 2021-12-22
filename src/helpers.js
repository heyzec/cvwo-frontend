const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


const httpGet = async (resource) => {
  console.log("HTTP GET")
  const res = await fetch(`${BACKEND_URL}/${resource}`)
  if (res.status !== 200) {
    alert("An error has occured :(")
    return
  }
  return await res.json()
}

const httpPost = async (resource, data) => {
  console.log("HTTP POST")
  const res = await fetch(`${BACKEND_URL}/${resource}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (res.status !== 201) {
    alert("An error has occured :(")
    return
  }
  return await res.json()
}

const httpDelete = async (resource, id) => {
  console.log("HTTP DELETE")
  const res = await fetch(`${BACKEND_URL}/${resource}/${id}`, {
    method: 'DELETE'
  })
  if (res.status !== 200 && res.status !== 204) {
    alert("An error has occured :(")
    return
  }
  return true
}

const httpPatch = async (resource, id, data) => {
  console.log("HTTP PATCH")
  const res = await fetch(`${BACKEND_URL}/${resource}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  if (res.status !== 200) {
    alert("An error has occured")
    return
  }
  return await res.json()
}

export class Helpers {

  setTasksCallbacks = (getTasks, setTasks) => {
    this.getTasks = getTasks
    this.setTasks = setTasks
  }

  setTagsCallbacks = (getTags, setTags) => {
    this.getTags = getTags
    this.setTags = setTags
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
    console.log("new tag to be added is")
    console.log(newTag)
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
    alert("huh")
    const output = await httpPatch("tags", id, data)
    if (output) {
      this.setTags([...this.getTags().map((tag) => {
        if (tag.id !== id) {
          return tag
        }
        return Object.assign({}, tag, data)
      })])
    } else {
      console.log("CONSIERED FALSE")
    }
  }
}