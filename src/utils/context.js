import { 
  fetchTasksCallback,
  fetchTagsCallback,
  fetchListsCallback,
  addTaskCallback,
  addTagCallback,
  addListCallback,
  deleteTaskCallback,
  deleteTagCallback,
  deleteListCallback,
  editTaskCallback,
  editTagCallback,
  editListCallback
} from './resource.js'
import { httpPost } from "./network"

class Context {
  
  #prepState = (stateName) => (getState, setState) => {
    const name = stateName.charAt(0).toUpperCase() + stateName.slice(1);
    this[`get${name}`] = getState
    this[`set${name}`] = setState
  }

  setUserCallbacks = this.#prepState("user")
  setTasksCallbacks = this.#prepState("tasks")
  setTagsCallbacks = this.#prepState("tags")
  setListsCallbacks = this.#prepState("lists")
  setCurrentListCallbacks = this.#prepState("currentList")
  setHtmlCallbacks = this.#prepState("html")

  setNotify = (notifyCallback) => {
    this.notify = (...args) => notifyCallback()(...args)
  }

  setMagic = (callback) => {
    this.magic = callback
  }
  
  fetchTasks = () => fetchTasksCallback(this.setTasks)
  fetchTags = () => fetchTagsCallback(this.setTags)
  fetchLists = () => fetchListsCallback(this.setLists)
  addTag = (data) => addTagCallback(this.setTags, data)
  addList = (data) => addListCallback(this.setLists, data)
  deleteTask = (id) => deleteTaskCallback(this.setTasks, id)
  deleteTag = (id) => deleteTagCallback(this.setTags, id)
  deleteList = (id) => deleteListCallback(this.setLists, id)
  editTask = (id, data) => editTaskCallback(this.setTasks, id, data)
  editTag = (id, data) => editTagCallback(this.setTags, id, data)
  editList = (id, data) => editListCallback(this.setLists, id, data)

  addTask = async (list_id, data) => {
    const r = await httpPost(`/lists/${list_id}/create`, data)
    if (r.ok) {
      const obj = await r.json()
      this.setTasks((state) => [...state, obj])
    }
  }

}

export { Context }
