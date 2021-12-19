import { useState, useEffect } from 'react'
import './App.css';
import Header from './components/Header'
import Task from './components/Task'
import dayjs from 'dayjs'

console.log(`This is a ${process.env.NODE_ENV} environment`)
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL

function App() {
  const [tasks, setTasks] = useState([])
  const [datetime, setDatetime] = useState(dayjs())

  // READ from db - Run once after initial rendering
  useEffect(() => {
    console.log("HTTP GET")
    const f = async () => {
      const res = await fetch(REACT_APP_BACKEND_URL)
      setTasks(await res.json())
    }
    f()
  }, [])

  // CREATE task and insert into db
  const addTask = async (data) => {
    console.log("HTTP POST")
    const res = await fetch(REACT_APP_BACKEND_URL, {
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
    setTasks([...tasks, newTask])
  }

  // DELETE task from db
  const deleteTask = async (id) => {
    console.log("HTTP DELETE")
    const res = await fetch(`${REACT_APP_BACKEND_URL}/${id}`, {
      method: 'DELETE'
    })
    if (res.status !== 200 && res.status !== 204) {
      alert("An error has occured :(")
      return
    }
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // UPDATE task in db
  const editTask = async (id, data) => {
    console.log("HTTP PATCH")
    const res = await fetch(`${REACT_APP_BACKEND_URL}/${id}`, {
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
    setTasks([...tasks.map((task) => {
      if (task.id !== id) {
        return task
      }
      return Object.assign({}, task, data)
    })])
  }

  // Function for testing purposes
  const magic = async () => {
    console.log(datetime)
    setDatetime(dayjs())
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        {tasks.map((task) => <Task key={task.id} task={task} isCreated={true} updateTask={editTask} deleteTask={deleteTask} />)}
        <Task isCreated={false} addTask={addTask} />
        <button onClick={magic}>Magic!</button>
      </div>
    </div>
  );
}

export default App;
