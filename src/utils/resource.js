import { httpGet, httpPost, httpDelete, httpPatch } from 'utils/network'
import { equals, rand32 } from 'utils/funcs'
import { getUpdatedValue } from 'utils/helpers'


// verb      CRUD      HTTP      Rails action

// fetch  -> READ   -> GET    -> index
// add    -> CREATE -> POST   -> create
// edit   -> UPDATE -> PATCH  -> update
// delete -> DELETE -> DELETE -> destroy

// ---------------- READ  ----------------

export const fetchObjCallback = (res, updateServer, setState) => async () => {
  if (updateServer) {
    // "res" for resource, "r" for response
    const r = await httpGet(`/${res}`)
    if (r.ok) {
      const obj = await r.json()
      setState(obj)
    }
  }
}


// ---------------- CREATE  ----------------

const addObjServer = async (res, data, list_id) => {
  // Adding tasks is the exception - need to access the specific list's resource and post to it instead.
  const location = list_id ? `/lists/${list_id}/create` : `/${res}`
  return await httpPost(location, data)
}

const addObjLocal = (setState, data, list_id) => {
  // Create object locally with a randomised temp id.
  const tempId = rand32()
  const tempObj = {
    ...data,
    id: tempId,
  }
  if (list_id) {
    tempObj.list_id = list_id
  }
  setState((state) => [...state, tempObj])
  return tempObj
}


export const addObjCallback = (res, updateServer, setState) => async (data) => {
  const list_id = res === "tasks" ? data.list_id : null

  const oldState = getUpdatedValue(setState, list_id)

  // A temp obj is received. We'll update the id with the server later.
  const tempObj = addObjLocal(setState, data, list_id)

  if (!updateServer) {
    return tempObj
  }

  const r = await addObjServer(res, data, list_id)
  if (!r.ok) {
    // If req fails, revert state locally
    setState(oldState)
    return
  }

  const serverObj = await r.json()
  setState((state) => state.map((obj) => obj.id === tempObj.id ? serverObj : obj))  // Updating the temp obj's id
  return serverObj
}



// ---------------- DELETE  ----------------

const deleteObjServer = async (res, id) => await httpDelete(`/${res}/${id}`)

const deleteObjLocal = (setState, id) => {
  setState((state) => state.filter((obj) => obj.id !== id))
}

export const deleteObjCallback = (res, updateServer, setState) => async (id) => {
  const oldState = getUpdatedValue(setState)

  deleteObjLocal(setState, id)

  if (!updateServer) {
    return
  }

  const r = await deleteObjServer(res, id)
  if (!r.ok) {
    setState(oldState)
    return r
  }
  return r
}


// ---------------- UPDATE  ----------------

const editObjServer = async (res, id, data) => await httpPatch(`/${res}/${id}`, data)

const editObjLocal = (setState, id, data) => {
  setState((state) => [...state.map((obj) => (
    obj.id !== id ? obj : Object.assign({}, obj, data)
  ))])
}

export const editObjCallback = (res, updateServer, setState) => async (id, data) => {
  const oldState = getUpdatedValue(setState)

  // If internet is down, just update local, we'll sync changes later
  editObjLocal(setState, id, data)

  if (!updateServer) {
    return
  }

  const r = await editObjServer(res, id, data)
  if (!r.ok) {
    // If req fails, revert state locally
    setState(oldState)
  }
  return r
}


// ---------------- Functions for syncing (local to server) after connection restored  ----------------

const objSortComparer = (obj1, obj2) => obj1.id < obj2.id ? -1 : 1

const addObjServerSync = async (res, data, mappings) => {
  const oldId = data.id
  const r = await addObjServer(res, data)
  const newObj = await r.json()
  const newId = newObj.id
  if (oldId !== newId) {
    mappings.set(oldId, newId)
  }
  return newObj
}

export const syncResource = async (res, value, setValue, idMappings) => {

  // Get array of objs from local state via useState's setter function
  const localData = value

  for (let i = 0; i < localData.length; i++) {
    const obj = localData[i]
    if (idMappings.has(obj.id)) {
      obj.id = idMappings.get(obj.id)
    }
    if (idMappings.has(obj.list_id)) {
      obj.list_id = idMappings.get(obj.list_id)
    }
  }


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
      localData[iLocal] = await addObjServerSync(res, localData[iLocal], idMappings)
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
        localData[i] = await addObjServerSync(res, localData[i], idMappings)
      }
    } else {
      // Excess elems in server array needs to be deleted from server
      for (let i = iServer; i < serverData.length; i++) {
        deleteObjServer(res, serverData[i].id)
      }
    }
  }

  setValue(localData)
}

export const syncResources = async (setLists, setTasks, setTags) => {
  const lists = getUpdatedValue(setLists)
  const tasks = getUpdatedValue(setTasks)
  const tags = getUpdatedValue(setTags)

  // No clobber protection - refuse to sync if user data is empty
  if (lists.length + tasks.length + tags.length === 0) {
    return
  }

  const idMappings = new Map()  // A map to translate temp ids to final ids obtained from server
  // Lists before tasks because tasks have .list_id attr which needs to be mapped
  await syncResource('lists', lists, setLists, idMappings)
  await syncResource('tasks', tasks, setTasks, idMappings)
  await syncResource('tags', tags, setTags, idMappings)
}
