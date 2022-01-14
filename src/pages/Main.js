import { useState } from 'react'

import { HiOutlineDotsVertical } from 'react-icons/hi'

import ResponsivePage from 'components/ResponsivePage'
import Header from 'components/Header'
import ListsSidebar from 'components/ListsSidebar'
import TagsSidebar from 'components/TagsSidebar'
import Task from 'components/Task'
import Button from 'material/Button'
import IconButton from 'material/IconButton'

import 'pages/Main.css'

const Main = ({ context }) => {

  /***** Retrieve necessary data from and set callbacks on context object *****/
  const tasks = context.getTasks()
  const lists = context.getLists()
  const tags = context.getTags()
  const [currentList, setCurrentList] = useState(null)
  context.setCurrentListCallbacks(() => currentList, setCurrentList)
  const [searchBools, setSearchBools] = useState([])
  context.setSearchBoolsCallbacks(() => searchBools, setSearchBools)


  /***** Event handlers *****/
  const editListClicked = (e) => {
    const userInput = prompt("Please enter name of list")
    if (userInput) {
      context.editList(currentList, {
        "text": userInput
      })
    }
  }


  const deleteListClicked = (e) => {
    const prompt = `You are about to permenantly delete this list containing ${currentListTasks.length} tasks. Continue?`
    if (!window.confirm(prompt)) {
      return
    }
    context.deleteList(currentList)
    setCurrentList(null)
    // Also delete tasks locally?
  }

  const [searchValue, setSearchValue] = useState("")
  context.setSearchValueCallbacks(() => searchValue, setSearchValue)



  let currentListName = null;
  let currentListTasks = null;
  if (currentList) {
    currentListName = context.getLists().find((list) => list.id === currentList).text
    currentListTasks = tasks.filter((task) => task.list_id === currentList)
  }

  let getTasksFromList = (list) => tasks.filter((task) => (task.list_id) == list.id)


  /***** Prepare states and sort/filtering functions *****/

  const [SORT_AZ, SORT_TIME] = [1, 2]
  const [sortMethod, setSortMethod] = useState(SORT_AZ)

  const tasksComparerAZ = (task1, task2) => task1.text > task2.text
  const tasksComparerTime = (task1, task2) => task1.day > task2.day

  const allTasksComparers = {
    [SORT_AZ]: tasksComparerAZ,
    [SORT_TIME]: tasksComparerTime
  }


  const filtSearch = (task) => task.text.toLowerCase().includes(searchValue.toLowerCase())

  const filtTags = (task) => {
    for (let i = 0; i < tags.length; i++) {
      if (searchBools[i] && !task.tags.includes(tags[i].id)) {
        return false
      }
    }
    return true
  }


  const filt = (task) => filtSearch(task) && filtTags(task)
  const sor = allTasksComparers[sortMethod]

  /***** Helpers functions and event handlers *****/

  let tasksMapper = (array) => (
    array.map((task) =>
      <Task context={context} key={task.id} task={task} isCreated={true} />
    )
  )

  let createGroup = (group, text) => (
    <>
      {text}
      {group}
    </>
  )

  const sortAZClicked = (e) => setSortMethod(SORT_AZ)
  const sortTimeClicked = (e) => setSortMethod(SORT_TIME)


  /***** Compute tasks to show after sorting and filtering *****/

  let tasksContents

  if (!searchValue) {
    if (!currentList) {
      tasksContents = null
    } else {
      tasksContents = <>
        {tasksMapper(currentListTasks.sort(sor))}
        <Task context={context} isCreated={false} />
      </>
    }
  } else {
    tasksContents = []

    let fromCurrent = tasksMapper(currentListTasks.filter(filt).sort(sor))

    let fromOthers = []
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i]
      if (list.id === currentList) {
        continue
      }
      const theseTasks = getTasksFromList(list).filter(filt).sort(sor)
      if (theseTasks.length === 0) {
        continue
      }

      fromOthers.push(createGroup(
        tasksMapper(theseTasks),
        `From ${list.text}`
      ))
    }


    tasksContents.push(
      fromCurrent.length === 0
        ? <span>
          No results from current list
        </span>
        : createGroup(fromCurrent, "")
    )

    tasksContents.push(
      fromOthers.length === 0
        ? "No results from other lists"
        : (
          <>
            <span>From other lists</span>
            {fromOthers}
          </>
        )
    )
  }







  return (
    <ResponsivePage
      header={<Header context={context} />}
      drawer={<ListsSidebar context={context} />}
      drawer2={<TagsSidebar context={context} />}
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
                  <span className="list-name">{currentListName}</span>
                  <IconButton>
                    <HiOutlineDotsVertical size="22" />
                  </IconButton>
                  {
                    // <Button onClick={editListClicked}>Edit name</Button>
                    // <Button onClick={deleteListClicked}>Delete</Button>
                  }
                </div>
                <div>
                  <Button onClick={sortAZClicked}>Sort: AZj</Button>
                  <Button onClick={sortTimeClicked}>Sort: Time</Button>
                  {sortMethod}
                </div>
                <div id="task-container">
                  {tasksContents}
                </div>
              </>
              : <span>Pick a list!</span>
          }
        </div>
      </>
    </ResponsivePage>
  )
}

export default Main
