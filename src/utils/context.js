import { 
  fetchTasksCallback,
  fetchTagsCallback,
  addTaskCallback,
  addTagCallback,
  deleteTaskCallback,
  deleteTagCallback,
  editTaskCallback,
  editTagCallback
} from './resource.js'

class Context {
  
  #prepState = (stateName) => (getState, setState) => {
    const name = stateName.charAt(0).toUpperCase() + stateName.slice(1);
    this[`get${name}`] = getState
    this[`set${name}`] = setState
  }

  setUserCallbacks = this.#prepState("user")
  setTasksCallbacks = this.#prepState("tasks")
  setTagsCallbacks = this.#prepState("tags")
  setHtmlCallbacks = this.#prepState("html")

  setNotify = (notifyCallback) => {
    this.notify = (...args) => notifyCallback()(...args)
  }

  setMagic = (callback) => {
    this.magic = callback
  }
  
  fetchTasks = () => fetchTasksCallback(this.setTasks)
  fetchTags = () => fetchTagsCallback(this.setTags)
  addTask = (data) => addTaskCallback(this.setTasks, data)
  addTag = (data) => addTagCallback(this.setTags, data)
  deleteTask = (id) => deleteTaskCallback(this.setTasks, id)
  deleteTag = (id) => deleteTagCallback(this.setTags, id)
  editTask = (id, data) => editTaskCallback(this.setTasks, id, data)
  editTag = (id, data) => editTagCallback(this.setTags, id, data)


}

export { Context }
