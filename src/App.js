import { useState, useEffect } from 'react'
import './App.css';
import Header from './components/Header'
import Task from './components/Task'

import { Helpers } from './helpers'

console.log(`This is a ${process.env.NODE_ENV} environment`)

function App() {
  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  // const [datetime, setDatetime] = useState(dayjs())

  const h = new Helpers()
  h.setTasksCallbacks(() => tasks, setTasks)
  h.setTagsCallbacks(() => tags, setTags)
  const fetchTasks = h.fetchTasks
  const addTask = h.addTask
  const editTask = h.editTask
  const deleteTask = h.deleteTask
  const fetchTags = h.fetchTags
  
  



  // Run once after initial rendering
  useEffect(() => {
    fetchTags()  // For now, the tags must be fetched first
    fetchTasks()
  }, [])
  


  // Function for testing purposes
  const magic = async () => {
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        {tasks.map((task) => <Task key={task.id} task={task} isCreated={true}
          updateTask={editTask} deleteTask={deleteTask} tags={tags}/>)}
        <Task isCreated={false} addTask={addTask} />
        <button onClick={magic}>Magic!</button>
      </div>
    </div>
  );
}

export default App;
