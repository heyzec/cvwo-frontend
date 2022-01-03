const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


const httpGet = async (resource) => {
  const endpoint = `${BACKEND_URL}/${resource}`
  const res = await fetch(endpoint)
  console.debug(`HTTP GET ${endpoint} ${res.status}`)
  if (res.status !== 200) {
    alert("An error has occured :(")
    console.log("BADD")
    return
  }
  return await res.json()
}

const httpPost = async (resource, data) => {
  const endpoint = `${BACKEND_URL}/${resource}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  console.debug(`HTTP GET ${endpoint} ${res.status}`)
  if (res.status !== 201) {
    alert("An error has occured :(")
    return
  }
  return await res.json()
}

const httpDelete = async (resource, id) => {
  const endpoint = `${BACKEND_URL}/${resource}/${id}`
  const res = await fetch(endpoint, {
    method: 'DELETE'
  })
  console.debug(`HTTP GET ${endpoint} ${res.status}`)
  if (res.status !== 200 && res.status !== 204) {
    alert("An error has occured :(")
    return
  }
  return true
}

const httpPatch = async (resource, id, data) => {
  const endpoint = `${BACKEND_URL}/${resource}/${id}`
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  console.debug(`HTTP GET ${endpoint} ${res.status}`)
  if (res.status !== 200) {
    alert("An error has occured")
    return
  }
  return await res.json()
}


class Context {
  
  constructor() {
    this.internetStatus = navigator.onLine
  }
  
  // Taken from: https://stackoverflow.com/a/2117523
  uuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  
  rand32 = () => {
    return crypto.getRandomValues(new Uint32Array(1))[0]
  }



  setTasksCallbacks = (getTasks, setTasks) => {
    this.getTasks = getTasks
    this.setTasks = setTasks
  }

  setTagsCallbacks = (getTags, setTags) => {
    this.getTags = getTags
    this.setTags = setTags
  }

  setNotify = (notifyCallback) => {
    // this.notify = (...args) => notifyCallback()(...args)
    this.notify = notifyCallback
  }


  setMagic = (callback) => {
    this.magic = callback
  }


  #wrapper = (validate, localUpdate, serverUpdate) => async (...args) => {
    if (!validate(...args)) {
      this.notify("Oops, something went wrong!", "pink", 1000)
      return
    }
    localUpdate(...args)
    if (this.internetStatus) {
      try {
        await serverUpdate(...args)
      } catch (err) {
        this.notify("OHNO", "pink", 1000)
      }
    }
  }


  // READ from db - Run once after initial rendering
  fetchTasks = async () => {
    const output = await httpGet("tasks")
    console.log("Output is")
    console.log(output)
    if (output) {
      this.setTasks(output)
    }
  }

  // CREATE task and insert into db
  #addTaskValidate = (tempId, data) => data.text && data.day
  #addTaskUpdateLocal = (tempId, data) => {
    const newTask = {
      "id": tempId,
      "text": data.text,
      "day": data.day,
      "tags": []
    }
    this.setTasks((tasks) => [...tasks, newTask])
  }
  #addTaskUpdateServer = async (tempId, data) => {
    const tagId = (await httpPost("tasks", data)).id
    this.setTasks((tasks) => tasks.map((task) => (
      task.id !== tempId ? task : Object.assign({}, task, { "id": tagId })
    )))
  }
  addTask = (data) => {
    const tempId = this.rand32()
    this.#wrapper(this.#addTaskValidate, this.#addTaskUpdateLocal, this.#addTaskUpdateServer)(tempId, data)
  }




  // DELETE task from db
  deleteTask = this.#wrapper((id) => {
    return true
  }, (id) => {
    this.setTasks((tasks) => tasks.filter((task) => task.id !== id))
  }, (id) => {
    httpDelete("tasks", id)
  })
  
  #deleteTaskValidate = (id) => true
  #deleteTaskUpdateLocal = (id) => {
    this.setTasks((tasks) => tasks.filter((task) => task.id !== id))
  }
  #deleteTaskUpdateServer = (id) => {
    httpDelete("tasks", id)
  }
  
  
  deleteTask = (id) => {
    this.#wrapper(this.#deleteTaskValidate, this.#deleteTaskUpdateLocal, this.#deleteTaskUpdateServer)(id)
  }

  // UPDATE task in db
  #editTaskValidate = (id, data) => true
  #editTaskUpdateLocal = (id, data) => {
    this.setTasks((tasks) => [...tasks.map((task) => (
      task.id !== id ? task : Object.assign({}, task, data)
    ))])
  }
  #editTaskUpdateServer = (id, data) => {
    httpPatch("tasks", id, data)
  
  }
  editTask = (id, data) => {
    this.#wrapper(this.#editTaskValidate, this.#editTaskUpdateLocal, this.#editTaskUpdateServer)(id, data)
  }


  // READ tags from db
  fetchTags = async () => {
    const output = await httpGet("tags")
    if (output) {
      this.setTags(output)
    }
  }

  #addTagValidate = (data) => data.text && data.color
  #addTagUpdateLocal = (data) => {
    const newTag = {
      "text": data.text,
      "color": data.color
    }
    this.setTags([...this.getTags(), newTag])
  }
  #addTagUpdateServer = (data) => {
    httpPost("tags", data)
  }

  
  // GOT PROBLEM TAKE A LOOK
  addTag = (data) => {
    this.#wrapper(this.#addTagValidate, this.#addTagUpdateLocal, this.#addTagUpdateServer)(data)
  }
  // CREATE tag and insert into db
  _addTag = this.#wrapper((data) => {
    return data.text && data.color
  }, (data) => {
    const newTag = {
      "text": data.text,
      "color": data.color
    }
    this.setTags([...this.getTags(), newTag])
  }, (data) => {
    httpPost("tags", data)
  })

  // DELETE tag from db
  deleteTag = this.#wrapper((id) => {
    return true
  }, (id) => {
    this.setTags(this.getTags().filter((tag) => tag.id !== id))
  }, (id) => {
    httpDelete("tags", id)
  })
  
  #deleteTagValidate = (id) => true
  #deleteTagUpdateLocal = (id) => {
    this.setTags((tags) => tags.filter((tag) => tag.id !== id))
  }
  #deleteTagUpdateServer = (id) => {
    httpDelete("tags", id)
  }

  // UPDATE tag in db
  editTag = this.#wrapper((id, data) => {
    return true
  }, (id, data) => {
    this.setTags([...this.getTags().map((tag) => {
      if (tag.id !== id) {
        return tag
      }
      return Object.assign({}, tag, data)
    })])
  }, (id, data) => {
    httpPatch("tags", id, data)
  })
  
  #editTagValidate = (id, data) => true
  #editTagUpdateLocal = (id, data) => {
    this.setTags((tags) => [...tags.map((tag) => (
      tag.id !== id ? tag : Object.assign({}. tag, data)
    ))])
  }
  #editTagUpdateServer = (id, data) => {
    httpPatch("tags", id, data)
  }
  

  syncResource = async (resource) => {
    const serverData = (await httpGet(resource)).sort((task) => task.id)
    const localData = this.getTasks().sort((task) => task.id)
    
    // Requires dictionaries to have the same order
    const compareObjects = (obj1, obj2) => JSON.stringify(obj1) == JSON.stringify(obj2)
    
    let [iServer, iLocal] = [0, 0]
    
    // Need to test this algorithm
    while (iLocal < localData.length || iServer < serverData.length) {
      const idLocal = localData[iLocal].id
      const idServer = serverData[iLocal].id
      if (idLocal < idServer) {
        httpPost(resource, localData[iLocal])
        iLocal++
      } else if (idLocal > idServer) {
        httpDelete(resource, idServer)
        iServer++
      } else {
        const bool = compareObjects(localData[iLocal], serverData[iServer])
        if (!bool) {
          httpPatch(resource, idServer, localData[iLocal])
        }
        iLocal++
        iServer++
      }
    }
  }
}



export { Context }
