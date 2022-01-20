import { httpGet, httpPost, httpDelete, httpPatch } from 'utils/network'
import { equals, rand32 } from 'utils/funcs'


// verb      CRUD      HTTP      Rails action

// fetch  -> READ   -> GET    -> index
// add    -> CREATE -> POST   -> create
// edit   -> UPDATE -> PATCH  -> update
// delete -> DELETE -> DELETE -> destroy

/*** READ ****/

export const fetchObjCallback = (res, getInternet, setState) => async () => {
  if (getInternet()) {
    // "res" for resource, "r" for response
    const r = await httpGet(`/${res}`)
    if (r.ok) {
      const obj = await r.json()
      setState(obj)
    }
  }
}


/*** CREATE ****/

const addObjServer = async (res, data) => {
  const location = res === "tasks" ? `/lists/${data.list_id}/create` : `/${res}`
  return await httpPost(location, data)
}

export const addObjCallback = (res, getInternet, setState) => async (data) => {
  if (getInternet()) {

    // During normal operation, only update local if req was successful
    const r = await addObjServer(res, data)
    if (r.ok) {
      const obj = await r.json()
      setState((state) => [...state, obj])
      return obj
    }
    return
  }
  // If internet is down, create object locally with a randomised temp id.
  // We'll update the id with the server when internet is back.
  const obj = {
    ...data,
    id: rand32()
  }
  setState((state) => [...state, obj])
  return obj
}


/*** DELETE ****/

const deleteObjServer = async (res, id) => await httpDelete(`/${res}/${id}`)

const deleteObjLocal = (setState, id) => {
  setState((state) => state.filter((obj) => obj.id !== id))
}

export const deleteObjCallback = (res, getInternet, setState) => async (id) => {
  if (getInternet()) {
    const r = await deleteObjServer(res, id)
    if (r.ok) {
      deleteObjLocal(setState, id)
    }
  }
  deleteObjLocal(setState, id)
}


/*** UPDATE ****/

const editObjServer = async (res, id, data) => await httpPatch(`/${res}/${id}`, data)

const editObjLocal = (setState, id, data) => {
  setState((state) => [...state.map((obj) => (
    obj.id !== id ? obj : Object.assign({}, obj, data)
  ))])
}

export const editObjCallback = (res, getInternet, setState) => async (id, data) => {
  if (getInternet()) {
    // During normal operation, only update local if req was successful
    const r = editObjServer(res, id, data)
    if (r.ok) {
      editObjLocal(setState, id, data)
    }
    return
  }
  // If internet is down, just update local, we'll sync changes later
  editObjLocal(setState, id, data)
}


/*** Functions for syncing (local to server) after connection restored ****/

const objSortComparer = (task1, task2) => task1.id < task2.id ? -1 : 1

export const syncResource = async (res, setState) => {

  // Get array of objs from local state via useState's setter function
  let localData
  setState((state) => {
    localData = [...state]
    return state
  })

  // Get array of objs from server
  const r = await httpGet(`/${res}`)
  const serverData = await r.json()

  // Sort both arrays before starting the algorithm
  localData.sort(objSortComparer)
  serverData.sort(objSortComparer)


  let [iLocal, iServer] = [0, 0]
  while (iLocal < localData.length && iServer < serverData.length) {
    const idLocal = localData[iLocal].id
    const idServer = serverData[iServer].id

    if (idLocal < idServer) {
      // Found obj present in local but not server, need to add to server
      const r = await addObjServer(res, localData[iLocal])
      localData[iLocal] = await r.json()
      iLocal++
    } else if (idLocal > idServer) {
      // Found obj present in server but not local, need to delete from server
      deleteObjServer(res, idServer)
      iServer++
    } else {
      // Pointers point to two objects with same id, check if contents are equal
      if (!equals(localData[iLocal], serverData[iServer])) {
        // Contents are not equal, need to update server
        editObjServer(res, idServer, localData[iLocal])
      }
      iLocal++
      iServer++
    }
  }

  if (iLocal !== localData.length || iServer !== serverData.length) {
    if (iLocal !== localData.length) {
      // Excess elems in local array needs to be added to server
      for (let i = iLocal; i < localData.length; i++) {
        const r = await addObjServer(res, localData[i])
        localData[i] = await r.json()
      }
    } else {
      // Excess elems in server array needs to be deleted from server
      for (let i = iServer; i < serverData.length; i++) {
        deleteObjServer(res, serverData[i].id)
      }
    }
  }

  setState(localData)
}
