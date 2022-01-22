import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BsClipboard, BsClipboardCheck } from 'react-icons/bs'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import {
  ImSortAlphaAsc,
  ImSortAlphaDesc,
  ImSortNumericAsc,
  ImSortNumbericDesc
} from 'react-icons/im'
import { IoShareSocial } from 'react-icons/io5'

import Header from 'components/Header'
import ListsSidebar from 'components/ListsSidebar'
import TagsSidebar from 'components/TagsSidebar'
import Task from 'components/Task'

import { attachListener } from 'utils/helpers'
import ResponsivePage from 'modules/ResponsivePage'
import SlidingDrawer from 'modules/SlidingDrawer'

import Button from 'material/Button'
import TextField from 'material/TextField'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import Tooltip from 'material/Tooltip'

import 'pages/Main.css'

import { httpGet, httpPost } from 'utils/network'

const Main = ({ context }) => {

  /***** Retrieve states from and set callbacks on context object *****/
  const tasks = context.getTasks()
  const lists = context.getLists()
  const tags = context.getTags()
  const [searchValue, setSearchValue] = useState("")
  context.setSearchValueCallbacks(() => searchValue, setSearchValue)
  const [searchBools, setSearchBools] = useState([])
  context.setSearchBoolsCallbacks(() => searchBools, setSearchBools)
  const [selectedListId, setSelectedListId] = [context.getSelectedListId(), context.setSelectedListId]




  const [shareLink, setShareLink] = useState(null)
  const [shareClipboardClicked, setShareClipboardClicked] = useState(false)
  const [imports, setImports] = useState(null)
  const { hash } = useParams()
  const navigate = useNavigate()


  // If URL is a share, retrieve the list and tasks, but only after component renders
  // (because we need to await)

  useEffect(() => {
    const asyncToDo = async () => {  // React's useEffect dislikes async functions
      if (hash) {
        const r = await httpGet(`/share/${hash}`)
        if (r.status !== 200) {
          context.toasts.error("Invalid link")
          navigate('/')
          return
        }
        const output = await r.json()
        setImports(output)
      }
    }
    asyncToDo()
  }, [selectedListId])


  let currentList, currentListTasks
  if (imports) {
    currentList = imports.list
    currentListTasks = imports.tasks
  } else {
    currentList = (context.getLists().find((list) => list.id === selectedListId))
    currentListTasks = (tasks.filter((task) => task.list_id === selectedListId))
  }





  /***** Create states for use within this file (exclude search; that's below) *****/
  const [nextPage, setNextPage] = useState(false)
  const [editListOpen, setEditListOpen] = useState(false)


  /***** Define some useful variables *****/
  let currentListName = null
  if (currentList) {
    currentListName = currentList.text
  }
  let getTasksFromList = (list) => tasks.filter((task) => (task.list_id) === list.id)


  /***** Event handlers - Editing list data *****/
  const changePageClicked = (e) => setNextPage(!nextPage)  // This state is for the SlidingDrawer

  // Opens menu for user to make changes to the list.
  const dotsIconClicked = (e) => {
    if (!editListOpen) {
      attachListener({
        target: window,
        postRemoval: () => setEditListOpen(false),
      })
    }
    setEditListOpen(!editListOpen)
  }

  const editListClicked = (e) => {
    const userInput = prompt("Please enter name of list", currentListName)
    if (userInput) {
      context.editList(selectedListId, {
        "text": userInput
      })
    }
  }

  const deleteListClicked = (e) => {
    if (currentListTasks.length !== 0) {
      const prompt = `You are about to permenantly delete this list containing ${currentListTasks.length} tasks. Continue?`
      if (!window.confirm(prompt)) {
        return
      }
    }
    context.deleteList(selectedListId)
    setSelectedListId(null)
    // Also delete tasks locally?
  }


  /***** Event handlers - Sharing and importing lists *****/
  const acceptShareClicked = async (e) => {
    const r = await httpPost(`/share/${hash}`)
    context.toasts.delayedSuccess("Imported!")
    navigate('/')
    document.location.reload()
  }

  const shareClicked = async (e) => {
    if (!shareLink) {
      attachListener({
        target: window,
        postRemoval: () => setShareLink(null),
        exclusionSelector: ".main__share-popup"
      })
    }

    const r = await httpPost(`/lists/${selectedListId}/share`)
    const hash = await r.text()
    setShareLink(`${process.env.REACT_APP_FRONTEND_URL}/share/${hash}`)
    setShareClipboardClicked(false)
  }

  const onShareClipboardClicked = (e) => {
    setShareClipboardClicked(true)
    navigator.clipboard.writeText(shareLink)
  }

  /***** Search/Filter/Sort - Prepare states and sort/filtering functions *****/
  const [SORT_AZ_ASC, SORT_AZ_DSC, SORT_TIME_ASC, SORT_TIME_DSC] = [1, 2, 3, 4]
  const [sortMethod, setSortMethod] = useState(SORT_AZ_ASC)

  const tasksComparerAzAsc = (task1, task2) => task1.text > task2.text
  const tasksComparerAzDsc = (task1, task2) => task1.text < task2.text
  const tasksComparerTimeAsc = (task1, task2) => task1.day > task2.day
  const tasksComparerTimeDsc = (task1, task2) => task1.day < task2.day

  const allTasksComparers = {
    [SORT_AZ_ASC]: tasksComparerAzAsc,
    [SORT_AZ_DSC]: tasksComparerAzDsc,
    [SORT_TIME_ASC]: tasksComparerTimeAsc,
    [SORT_TIME_DSC]: tasksComparerTimeDsc
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

  /***** Search/Filter/Sort - Helpers functions and event handlers *****/
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

  const sortAZClicked = (e) => {
    if (sortMethod === SORT_AZ_ASC) {
      setSortMethod(SORT_AZ_DSC)
    } else if (sortMethod === SORT_AZ_DSC) {
      setSortMethod(SORT_AZ_ASC)
    } else {
      setSortMethod(SORT_AZ_ASC)
    }
  }
  const sortTimeClicked = (e) => {
    if (sortMethod === SORT_TIME_ASC) {
      setSortMethod(SORT_TIME_DSC)
    } else if (sortMethod === SORT_TIME_DSC) {
      setSortMethod(SORT_TIME_ASC)
    } else {
      setSortMethod(SORT_TIME_ASC)
    }
  }


  /***** Search/Filter/Sort - Compute tasks to show after sorting and filtering *****/
  let tasksContents

  if (!searchValue) {
    if (!currentList || !currentListTasks) {
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
      if (list.id === selectedListId) {
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
        ? <span>
          No results from other lists
        </span>
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
      drawer={
        <SlidingDrawer
          drawer1={<ListsSidebar context={context} />}
          drawer2={<TagsSidebar context={context} />}
          label1="Tags"
          label2="Lists"
          nextPage={nextPage} changePageClicked={changePageClicked}
        />
      }
    >
      <>
        <span>
          {context.getUser()
            ? null
            : "You're not logged in!"
          }
        </span>
        <div>
          {
            !currentList
              ? <span>Pick a list!</span>
              : <>
                {
                  hash ? (
                    <div className="main__import-notice">
                      <span>Import this list?</span>
                      <Button variant="contained" onClick={acceptShareClicked}>Yes</Button>

                    </div>
                  ) : null
                }
                <div>
                  <span className="main__list-name">{currentListName}</span>
                  <div className="main__menu">
                    <div className="main__share">
                      <Tooltip text="Generate a unique URL to share with other users!">
                        <IconButton onClick={shareClicked}>
                          <IoShareSocial size="22" />
                        </IconButton>
                      </Tooltip>
                      <Paper className={`main__share-popup${shareLink ? "" : " hidden"}`}>
                        <TextField className="main__share-link" value={shareLink} />
                        <Tooltip text={shareClipboardClicked ? "Copied!" : "Copy to clipboard"}>
                          <IconButton onClick={onShareClipboardClicked}>
                            {
                              shareClipboardClicked
                                ? <BsClipboardCheck size="18" />
                                : <BsClipboard size="18" />
                            }
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </div>
                    <Tooltip text="More options">
                      <IconButton onClick={dotsIconClicked}>
                        <HiOutlineDotsVertical size="22" />
                      </IconButton>
                    </Tooltip>
                    <Paper className={`main__float${editListOpen ? " main__float--show" : ""}`}>
                      <SelectableList>
                        <SelectableListItem onClick={editListClicked}>
                          Edit
                        </SelectableListItem>
                        <SelectableListItem onClick={deleteListClicked}>
                          Delete
                        </SelectableListItem>
                      </SelectableList>
                    </Paper>
                  </div>
                </div>
                <div>
                  <Button
                    variant={[SORT_AZ_ASC, SORT_AZ_DSC].includes(sortMethod) ? "contained" : "outlined"}
                    startIcon={sortMethod !== SORT_AZ_DSC ? <ImSortAlphaAsc /> : <ImSortAlphaDesc />}
                    onClick={sortAZClicked}
                  >
                    Sort: AZ
                  </Button>
                  <Button
                    variant={[SORT_TIME_ASC, SORT_TIME_DSC].includes(sortMethod) ? "contained" : "outlined"}
                    startIcon={sortMethod !== SORT_TIME_DSC ? <ImSortNumericAsc /> : <ImSortNumbericDesc />}
                    onClick={sortTimeClicked}
                  >
                    Sort: Time
                  </Button>
                </div>
                <div id="task-container">
                  {tasksContents}
                </div>
              </>
          }
        </div>
      </>
    </ResponsivePage>
  )
}

export default Main
