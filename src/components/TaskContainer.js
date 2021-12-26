import Task from './Task'

const TaskContainer = ({ context }) => {
  const tasks = context.getTasks()

  return (
    <div>
      {tasks.map((task) => <Task context={context} key={task.id} task={task} isCreated={true} />)}
      <Task context={context} isCreated={false} />
    </div>
  )
}
export default TaskContainer
