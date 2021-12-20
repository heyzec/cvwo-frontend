const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


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
    console.log("HTTP GET")
    const res = await fetch(`${BACKEND_URL}/tasks`)
    if (res.status !== 200) {
      alert("An error has occured :(")
      return
    }
    this.setTasks(await res.json())
  }

  // CREATE task and insert into db
  addTask = async (data) => {
    console.log("HTTP POST")
    const res = await fetch(`${BACKEND_URL}/tasks`, {
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
    const newTask = await res.json()
    this.setTasks([...this.getTasks(), newTask])
  }

  // DELETE task from db
  deleteTask = async (id) => {
    console.log("HTTP DELETE")
    const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: 'DELETE'
    })
    if (res.status !== 200 && res.status !== 204) {
      alert("An error has occured :(")
      return
    }
    this.setTasks(this.getTasks().filter((task) => task.id !== id))
  }

  // UPDATE task in db
  editTask = async (id, data) => {
    console.log("HTTP PATCH")
    const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (res.status !== 200) {
      alert("An error has occured :(")
      return
    }
    this.setTasks([...this.getTasks().map((task) => {
      if (task.id !== id) {
        return task
      }
      return Object.assign({}, task, data)
    })])
  }

  fetchTags = async () => {
    console.log("HTTP GET")
    const res = await fetch(`${BACKEND_URL}/tags`)
    this.setTags(await res.json())
  }
}