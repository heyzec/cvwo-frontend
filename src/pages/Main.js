import { useState } from 'react'
import TagsSidebar from 'components/TagsSidebar';
import ListsSidebar from 'components/ListsSidebar';
import Task from 'components/Task'
import ResponsivePage from "components/ResponsivePage"
import Header from "components/Header"


import 'pages/Main.css'


const Main = ({ context }) => {

  const tasks = context.getTasks()

  const [currentList, setCurrentList] = useState(null)

  context.setCurrentListCallbacks(() => currentList, setCurrentList)


  const editListClicked = (e) => {
    context.editList(currentList, {
      "text": prompt("Please enter name of list")
    })

  }
  const deleteListClicked = (e) => {
    context.deleteList(currentList)
    setCurrentList(null)
    // Also delete tasks locally?
  }

  return (

    <ResponsivePage
      header={<Header context={context} />}
      drawer={<ListsSidebar context={context} />}
    >
      <>
        <span>
          {context.getUser()
            ? (<>
              Welcome {context.getUser()}
            </>)
            : "You're not logged in!"
          }
        </span>
        <div>
          {
            currentList
              ?
              <>
                <div>
                  <span>{context.getLists().find((list) => list.id === currentList).text}</span>
                  <button onClick={editListClicked}>Edit name</button>
                  <button onClick={deleteListClicked}>Delete</button>
                </div>
                <div id="task-container">
                  {
                    tasks.filter((task) => task.list_id === currentList).map(
                      ((task) => <Task context={context} key={task.id} task={task} isCreated={true} />)
                    )
                  }
                  <Task context={context} isCreated={false} />
                </div>
              </>
              : <span>Pick a list!</span>
          }
        </div>
      </>
      {
        /* <TagsSidebar context={context} /> */
      }
    </ResponsivePage>
  )
}

export default Main
