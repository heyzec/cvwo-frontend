import { useState, useEffect } from 'react'
import './App.css';
import Header from './components/Header'
import Task from './components/Task'
import NextTask from './components/NextTask'
import dayjs from 'dayjs'

function App() {
  const [tasks, setTasks] = useState([])
  const [datetime, setDatetime] = useState(dayjs())

  // READ from db - Run once after initial rendering
  useEffect(() => {
    console.log("HTTP GET")
    const f = async () => {
      const res = await fetch("http://localhost:5000/tasks")
      setTasks(await res.json())
    }
    f()
  }, [])

  // CREATE task and insert into db
  const addTask = async (newTask) => {
    console.log("HTTP POST")
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
    setTasks([...tasks, newTask])
  }

  // DELETE task from db
  const deleteTask = async (id) => {
    console.log("HTTP DELETE")
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // UPDATE task in db
  const editTask = async (id, data) => {
    console.log("HTTP PATCH")
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data)
    })
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
        <NextTask addTaskCallback={addTask} />
        <button onClick={magic}>Magic!</button>
      </div>
    </div>
  );
}

export default App;
