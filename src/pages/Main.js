import { useState } from 'react'

import ResponsivePage from "components/ResponsivePage"
import Header from "components/Header"
import ListsSidebar from 'components/ListsSidebar';
import TagsSidebar from 'components/TagsSidebar';
import Task from 'components/Task'
import Button from 'material/Button'

import 'pages/Main.css'

const Main = ({ context }) => {

  const tasks = context.getTasks()
  const [currentList, setCurrentList] = useState(null)

  context.setCurrentListCallbacks(() => currentList, setCurrentList)

  const editListClicked = (e) => {
    const userInput = prompt("Please enter name of list")
    if (userInput) {
      context.editList(currentList, {
        "text": userInput
      })
    }
  }

  const deleteListClicked = (e) => {
    const prompt = `You are abou to delete this list permenantly. Continue?`
    if (!window.confirm(prompt)) {
      return
    }
    context.deleteList(currentList)
    setCurrentList(null)
    // Also delete tasks locally?
  }
  const currentListName = currentList ? context.getLists().find((list) => list.id === currentList).text : null

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
                  <span>{currentListName}</span>
                  <Button onClick={editListClicked}>
                    Edit name
                  </Button>
                  <Button onClick={deleteListClicked}>
                    Delete
                  </Button>
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
