import {
  fetchObjCallback,
  addObjCallback,
  deleteObjCallback,
  editObjCallback
} from 'utils/resource'


class Context {

  #prepState = (stateName) => (getState, setState) => {
    const name = stateName.charAt(0).toUpperCase() + stateName.slice(1)
    this[`get${name}`] = getState
    this[`set${name}`] = setState
  }

  setUserCallbacks = this.#prepState("user")
  setTasksCallbacks = this.#prepState("tasks")
  setTagsCallbacks = this.#prepState("tags")
  setListsCallbacks = this.#prepState("lists")
  setSelectedListIdCallbacks = this.#prepState("selectedListId")
  setSearchValueCallbacks = this.#prepState("searchValue")
  setSearchBoolsCallbacks = this.#prepState("searchBools")
  setUserIdCallbacks = this.#prepState("userId")
  setInternetCallbacks = this.#prepState("internet")
  setDarkModeCallbacks = this.#prepState("darkMode")
  setShowLoadingCallbacks = this.#prepState("showLoading")
  setKeyMappingsCallbacks = this.#prepState("keyMappings")

  setToastRef = (toastRefCallback) => {
    this.toastRefCallback = toastRefCallback
  }
  get toasts() {
    return this.toastRefCallback().current
  }

  setMagic = (callback) => {
    this.magic = callback
  }


  /** Check if need to update both server and local, or just locally */
  updateServer = () => this.getInternet() && !!this.getUser()


  fetchLists = async () => {
    await fetchObjCallback("lists", this.updateServer(), this.setLists)()
  }
  fetchTasks = async () => {
    await fetchObjCallback("tasks", this.updateServer(), this.setTasks)()
  }
  fetchTags = async () => {
    await (fetchObjCallback("tags", this.updateServer(), this.setTags))()
  }

  addList = async (data) => {
    return await addObjCallback("lists", this.updateServer(), this.setLists)(data)
  }
  addTask = async (list_id, data) => {
    return await addObjCallback("tasks", this.updateServer(), this.setTasks)(
      { list_id, ...data }
    )
  }
  addTag = async (data) => {
    return await addObjCallback("tags", this.updateServer(), this.setTags)(data)
  }

  deleteList = async (id) => {
    await deleteObjCallback("lists", this.updateServer(), this.setLists)(id)
  }
  deleteTask = async (id) => {
    await deleteObjCallback("tasks", this.updateServer(), this.setTasks)(id)
  }
  deleteTag = async (id) => {
    await deleteObjCallback("tags", this.updateServer(), this.setTags)(id)
  }

  editList = async (id, data) => {
    await editObjCallback("lists", this.updateServer(), this.setLists)(id, data)
  }
  editTask = async (id, data) => {
    await editObjCallback("tasks", this.updateServer(), this.setTasks)(id, data)
  }
  editTag = async (id, data) => {
    await editObjCallback("tags", this.updateServer(), this.setTags)(id, data)
  }

}

export default Context
