/* import TaskContainer from '../components/TaskContainer' */
import TagsSidebar from '../components/TagsSidebar';
import Task from '../components/Task'

import './Main.css'


const Main = ({ context }) => {
  
  const tasks = context.getTasks()

  return (
    <div id="main">
      <div id="center">
        <span>
          {context.getUser()
            ? (<>
              Welcome {context.getUser()}
            </>)
            : "You're not logged in!"
          }
        </span>
        <div id="task-container">
          {tasks.map((task) => <Task context={context} key={task.id} task={task} isCreated={true} />)}
          <Task context={context} isCreated={false} />
        </div>
      </div>
      <TagsSidebar context={context} />
    </div>
  )
}

export default Main
