import { httpDelete, httpGet, httpPatch, httpPost } from 'utils/network'



// verb      HTTP      Rails action

// fetch  -> GET    -> index
// add    -> POST   -> create
// edit   -> PATCH  -> update
// delete -> DELETE -> destroy

const fetchObjCallback = (res) => async (setState) => {
  const r = await httpGet(`/${res}`)
  if (r.ok) {
    const objs = await r.json()
    setState(objs)
  }
}
export const fetchTasksCallback = fetchObjCallback("tasks")
export const fetchTagsCallback = fetchObjCallback("tags")
export const fetchListsCallback = fetchObjCallback("lists")

const addObjCallback = (res) => async (setState, data) => {
  const r = await httpPost(`/${res}`, data)
  if (r.ok) {
    const obj = await r.json()
    setState((state) => [...state, obj])
  }
}


export const addTagCallback = addObjCallback("tags")
export const addListCallback = addObjCallback("lists")


const deleteObjCallback = (res) => async (setState, id) => {
  const r = await httpDelete(`/${res}/${id}`)
  if (r.ok) {
    setState((state) => state.filter((obj) => obj.id !== id))
  }
}
export const deleteTaskCallback = deleteObjCallback("tasks")
export const deleteTagCallback = deleteObjCallback("tags")
export const deleteListCallback = deleteObjCallback("lists")


const editObjCallback = (res) => async (setState, id, data) => {
  const r = await httpPatch(`/${res}/${id}`, data)
  if (r.ok) {
    setState((state) => [...state.map((obj) => (
      obj.id !== id ? obj : Object.assign({}, obj, data)
    ))])
  }
}
export const editTaskCallback = editObjCallback("tasks")
export const editTagCallback = editObjCallback("tags")
export const editListCallback = editObjCallback("lists")
