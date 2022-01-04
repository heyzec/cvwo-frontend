import TaskContainer from '../components/TaskContainer'
import TagsFooter from '../components/TagsFooter';


const Main = ({ context }) => {
  


  return (
    <>
      {context.getUser()
        ? (<>
          Welcome {context.getUser()}
          </>)
        : "You're not logged in!"
      }
      <TaskContainer context={context} />
      <TagsFooter context={context} />
    </>

  )
}

export default Main
