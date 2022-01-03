import { useState, useEffect, useRef } from 'react'

import TaskContainer from '../components/TaskContainer'
import TagsFooter from '../components/TagsFooter';
import Loading from '../components/Loading';


const Main = ({ context }) => {
  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [showSpinner, setShowSpinner] = useState(true)
  
  const [email, setEmail] = useState([])

  const loadingRef = useRef(null)

  context.setTasksCallbacks(() => tasks, setTasks)
  context.setTagsCallbacks(() => tags, setTags)

  // Run once after initial rendering
  useEffect(async () => {
    await Promise.all([context.fetchTags(), context.fetchTasks()])
    loadingRef.current.remove()
    
   setEmail(await getEmail()) 
  }, [])
  
  const getEmail = async () => {
    const endpoint = 'http://localhost:3000/status'
    
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include'
    })
    const output = await res.text()
    return output
  }
  
  const signout = async () => {
    const endpoint = 'http://localhost:3000/signout'
    
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include'
    })
    window.location.reload()
  }

  return (
    <>
      {email
        ? (<>
          Welcome {email}
          <button onClick={signout}>Sign out</button>
          </>)
        : "You're not logged in!"
      }
      <Loading ref={loadingRef} />
      <TaskContainer context={context} />
      <TagsFooter context={context} />
    </>

  )
}

export default Main
