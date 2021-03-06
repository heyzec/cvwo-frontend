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
import { BsCircle, BsCheckCircle } from 'react-icons/bs'
import { IoShareSocial } from 'react-icons/io5'

import Header from 'components/Header'
import ListsSidebar from 'components/ListsSidebar'
import TagsSidebar from 'components/TagsSidebar'
import Task from 'components/Task'

import Context from 'utils/Context'  // For type hinting
import { attachListener, vimAddListener, vimRemoveListener } from 'utils/helpers'
import { keepWithinBounds } from 'utils/funcs'
import ResponsivePage from 'modules/ResponsivePage'
import SlidingDrawer from 'modules/SlidingDrawer'
import { Spinner } from 'modules/Loading'

import Button from 'material/Button'
import TextField from 'material/TextField'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import Tooltip from 'material/Tooltip'
import useStorageState from 'modules/useStorageState'

import 'pages/Main.css'

import { httpGet, httpPost } from 'utils/network'


/**
 * @param {Object} param
 * @param {Context} param.context
 */
const Main = ({ context }) => {

  // ---------------- Retrieve states from and set callbacks on context object  ----------------

  const tasks = context.getTasks()
  const lists = context.getLists()
  const tags = context.getTags()
  const user = context.getUser()

  const [keyMappings, setKeyMappings] = [context.getKeyMappings(), context.setKeyMappings]

  const [selectedTaskIndex, setSelectTaskIndex] = useState(null)

  // Save the selected list 
  const [selectedListId, setSelectedListId] = useStorageState('selectedListId', null, false)         // The current list user is looking at
  context.setSelectedListIdCallbacks(
    () => selectedListId, setSelectedListId
  )


  const [nextPage, setNextPage] = useState(false)                // This state is for the SlidingDrawer
  const changePageClicked = (e) => setNextPage(!nextPage)
  // ---------------- [Functionality 1] - Sharing and importing lists ----------------

  const [shareLink, setShareLink] = useState(false)  // False: Default, null: awaiting server, or share hash of list
  const [shareClipboardClicked, setShareClipboardClicked] = useState(false)
  const [imports, setImports] = useState(null)
  const { hash } = useParams()
  const navigate = useNavigate()

  // If URL is a share, retrieve the list and tasks, but only after component renders and lists is loaded
  // (because we need to await)
  useEffect(() => {
    if (!lists) {
      return
    }
    const asyncToDo = async () => {  // React's useEffect dislikes async functions
      if (hash) {
        const r = await httpGet(`/share/${hash}`)
        if (r.status !== 200) {
          context.toasts.error("That link is invalid!")
          navigate('/')
          return
        }
        const output = await r.json()
        if (lists.find((list) => list.id === output.list.id)) {
          context.toasts.info("You already have this list!", 2000)
          setSelectedListId(output.list.id)
          navigate('/')
          return
        }
        setImports(output)
      }
    }
    asyncToDo()
  }, [lists])

  // Event handlers required 
  const acceptShareClicked = async (e) => {
    if (user) {
      const r = await httpPost(`/share/${hash}`)  // Send a request to make this list available to user
    } else {
      const newList = await context.addList(currentList)
      currentTasks.forEach((task) => context.addTask(newList.id, task))
      const unseenImportTags = imports.tags.filter((importedTag) => tags.every((tag) => importedTag.text !== tag.text))
      unseenImportTags.forEach((tag) => context.addTag(tag))
    }
    context.toasts.delayedSuccess("Imported!")
    navigate('/')
    document.location.reload()
  }

  const shareClicked = async (e) => {
    if (!user) {
      context.toasts.info("You'll need an account for this, do consider signing up!", 3000)
      return
    }
    if (!shareLink) {
      attachListener({
        target: window,
        postRemoval: () => setShareLink(false),
        exclusionSelector: ".main__share-popup"
      })
    }

    setShareLink(null)
    const r = await httpPost(`/lists/${selectedListId}/share`)
    if (r.ok) {
      const hash = await r.text()
      setShareLink(`${process.env.REACT_APP_FRONTEND_URL}/share/${hash}`)
      setShareClipboardClicked(false)
    }
  }

  const onShareClipboardClicked = (e) => {
    setShareClipboardClicked(true)
    navigator.clipboard.writeText(shareLink)
  }


  // ---------------- [Functionality 2] - Editing list data ----------------

  const [editListOpen, setEditListOpen] = useState(false)


  // Define some useful variables
  let currentList, currentTasks, unseenImportTags
  if (imports) {
    currentList = imports.list
    currentTasks = imports.tasks
    unseenImportTags = imports.tags.filter((importedTag) => tags.every((tag) => importedTag.text !== tag.text))
  } else {
    currentList = (lists?.find((list) => list.id === selectedListId))
    currentTasks = (tasks?.filter((task) => task.list_id === selectedListId))
  }

  const currentListName = currentList?.text

  const getTasksFromList = (list) => tasks.filter((task) => (task.list_id) === list.id)


  // Event handlers required 
  /** Opens menu for user to make changes to the list */
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
        text: userInput
      })
    }
  }

  const deleteListClicked = (e) => {
    if (currentTasks.length !== 0) {
      const prompt = `You are about to permenantly delete this list containing ${currentTasks.length} tasks. Continue?`
      if (!window.confirm(prompt)) {
        return
      }
    }
    context.deleteList(selectedListId)
    setSelectedListId(null)
    // Also delete tasks locally?
  }

  // ---------------- [Functionality 3] - Keyboard shortcuts ----------------
  useEffect(() => {
    const arr = []

    arr.push(vimAddListener(keyMappings, 'j', () => {
      setSelectTaskIndex((index) => (
        index === null ? 0 : keepWithinBounds(index + 1, 0, currentTasks.length)
      ))
    }))
    arr.push(vimAddListener(keyMappings, 'k', () => {
      setSelectTaskIndex((index) => (
        index === null ? currentTasks.length - 1 : keepWithinBounds(index - 1, 0, currentTasks.length)
      ))
    }))
    arr.push(vimAddListener(keyMappings, 'Escape', () => setSelectTaskIndex(null)))

    const incDecSelectedListId = (inc) => {
      setSelectedListId((lid) => {
        if (lid === null) {
          return lists[0].id
        }
        const index = lists.findIndex((list) => list.id === lid)
        return lists[keepWithinBounds(inc ? index + 1 : index - 1, 0, lists.length, true)].id
      })
    }

    arr.push(vimAddListener(keyMappings, 'Tab', () => incDecSelectedListId(true)))
    arr.push(vimAddListener(keyMappings, 'h', () => incDecSelectedListId(false)))
    arr.push(vimAddListener(keyMappings, 'l', () => incDecSelectedListId(true)))

    return () => arr.forEach(vimRemoveListener)
  }, [lists, selectedListId])



  // ---------------- [Functionality 4] - Search, filter, and sort ----------------

  // Prepare states and sort/filtering functions
  const [searchValue, setSearchValue] = useState("")
  context.setSearchValueCallbacks(() => searchValue, setSearchValue)
  const [searchBools, setSearchBools] = useState([])
  context.setSearchBoolsCallbacks(() => searchBools, setSearchBools)

  const [SORT_DONE_LAST, SORT_DONE_FIRST, SORT_AZ_ASC, SORT_AZ_DSC, SORT_TIME_ASC, SORT_TIME_DSC] = [...Array(6).keys()]
  const [sortMethod, setSortMethod] = useState(SORT_AZ_ASC)

  // Must return number not boolean! (else will fail on Chrome)
  const tasksComparerDoneLast = (task1, task2) => task1.done > task2.done ? 1 : -1
  const tasksComparerDoneFirst = (task1, task2) => task1.done < task2.done ? 1 : -1
  const tasksComparerAzAsc = (task1, task2) => task1.text > task2.text ? 1 : -1
  const tasksComparerAzDsc = (task1, task2) => task1.text < task2.text ? 1 : -1
  const tasksComparerTimeAsc = (task1, task2) => task1.day > task2.day ? 1 : -1
  const tasksComparerTimeDsc = (task1, task2) => task1.day < task2.day ? 1 : -1


  const allTasksComparers = {
    [SORT_DONE_LAST]: tasksComparerDoneLast,
    [SORT_DONE_FIRST]: tasksComparerDoneFirst,
    [SORT_AZ_ASC]: tasksComparerAzAsc,
    [SORT_AZ_DSC]: tasksComparerAzDsc,
    [SORT_TIME_ASC]: tasksComparerTimeAsc,
    [SORT_TIME_DSC]: tasksComparerTimeDsc
  }

  const filtSearch = (task) => task.text.toLowerCase().includes(searchValue.toLowerCase())

  const filtTags = (task) => {
    for (let i = 0; i < tags.length; i++) {
      if (searchBools[i] && !task.tags.includes(tags[i].text)) {
        return false
      }
    }
    return true
  }


  const filt = (task) => filtSearch(task) && filtTags(task)   // The combined filter function
  const sor = allTasksComparers[sortMethod]                   // The combined sorting function


  // Helpers functions and event handlers

  /** Maps an array of task objects to an array of instantiated task components */
  const tasksMapper = (array, selectedFunc) => {
    const output = []
    for (let i = 0; i < array.length; i++) {
      const task = array[i]
      output.push(
        <Task
          context={context}
          key={task.id}
          task={task}
          isCreated={true}
          isSelected={selectedFunc && selectedFunc(i)}
          importedTags={imports?.tags}        // All tags associated to the imported task
        />
      )
    }
    return output
  }

  const createGroup = (group, text) => (
    <>
      {text}
      {group}
    </>
  )

  const genSortButton = (key, state1, state2, getIcon, onClick, text, getTooltipText) => {
    // null if not selected, 
    const status = ![state1, state2].includes(sortMethod) ? null : sortMethod === state1 ? 0 : 1

    return (
      <Tooltip key={key} text={getTooltipText(status)}>
        <Button
          variant={status !== null ? "contained" : "outlined"}
          className={status !== null ? "main__sort-btn--themed" : ""}
          startIcon={getIcon(status)}
          onClick={onClick}
        >
          {text}
        </Button>
      </Tooltip>
    )
  }


  const genSortMethodClicked = (state1, state2) => (e) => {

    const func = (sortMethod) => {
      if (sortMethod === state1) {
        return state2
      } else if (sortMethod === state2) {
        return state1
      } else {
        return state1
      }
    }

    setSortMethod(func)
  }

  const sortDoneClicked = genSortMethodClicked(SORT_DONE_LAST, SORT_DONE_FIRST)
  const sortAZClicked = genSortMethodClicked(SORT_AZ_ASC, SORT_AZ_DSC)
  const sortTimeClicked = genSortMethodClicked(SORT_TIME_ASC, SORT_TIME_DSC)


  // Compute tasks to show after sorting and filtering
  let tasksContents

  if (!searchValue && searchBools.every((bool) => !bool)) {  // This is the normal state of the app, simply render the tasks in current list
    if (!currentList || !currentTasks) {
      tasksContents = null
    } else {
      tasksContents = <>
        {tasksMapper(currentTasks.sort(sor),
          (i) => i === selectedTaskIndex
        )}                                             {/* Created tasks */}
        <Task context={context} isCreated={false} />   {/* Uncreated task (for user to input new task) */}
      </>
    }
  } else {                   // This is when the user is searching for something
    tasksContents = []

    let fromCurrent = tasksMapper(currentTasks.filter(filt).sort(sor))

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

  // ---------------- Generate subcomponents to render ----------------
  const mainMenu = (
    <div className="main__menu">
      <div className="main__share">
        <Tooltip text="Generate a unique URL to share with other users!">
          <IconButton onClick={shareClicked}>
            <IoShareSocial size="22" />
          </IconButton>
        </Tooltip>
        {
          shareLink === false ? null
            : <Paper className={`main__share-popup`}>
              {
                shareLink !== null
                  ? (
                    <>
                      <TextField className="main__share-link" value={shareLink} readOnly />
                      <Tooltip text={shareClipboardClicked ? "Copied!" : "Copy to clipboard"}>
                        <IconButton onClick={onShareClipboardClicked}>
                          {
                            shareClipboardClicked
                              ? <BsClipboardCheck size="18" />
                              : <BsClipboard size="18" />
                          }
                        </IconButton>
                      </Tooltip>
                    </>
                  )
                  : <Spinner size="14" />
              }
            </Paper>
        }
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
  )


  const sortButtons = (
    <div>
      {
        genSortButton(
          "Done",
          SORT_DONE_FIRST,
          SORT_DONE_LAST,
          (status) => !status ? <BsCheckCircle /> : <BsCircle />,
          sortDoneClicked,
          "Sort: Done",
          (status) => status !== 0 ? "Click to show undone first" : "Click to show done first"
        )
      }{
        genSortButton(
          "AZ",
          SORT_AZ_ASC,
          SORT_AZ_DSC,
          (status) => !status ? <ImSortAlphaAsc /> : <ImSortAlphaDesc />,
          sortAZClicked,
          "Sort: AZ",
          (status) => status !== 0 ? "Click to sort by text, ascending" : "Click to sort by text, descending"
        )
      }{
        genSortButton(
          "Time",
          SORT_TIME_ASC,
          SORT_TIME_DSC,
          (status) => !status ? <ImSortNumericAsc /> : <ImSortNumbericDesc />,
          sortTimeClicked,
          "Sort: Time",
          (status) => status !== 0 ? "Click to sort by time, earlier first" : "Click to sort by time, later first"
        )
      }
    </div>
  )


  const notice = (() => {
    if (hash) {
      return (
        <>
          <span>
            Import this list
            {unseenImportTags && unseenImportTags.length ? ` and ${unseenImportTags.length} tags` : ""}
            ?
          </span>
          <Button
            className="main__import-btn"
            variant="contained"
            onClick={acceptShareClicked}
          >
            Yes
          </Button>
        </>
      )
    }

    if (!user) {
      return "You're not logged in!"
    }

    if (!currentList) {
      return "Pick a list!"
    }

    return null
  })()


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
      <div className="main">
        {
          !notice ? null
            : (
              <Paper className="main__notice">
                {notice}
              </Paper>
            )
        }
        {
          !currentList ? null
            : (
              <>
                <div>
                  <span className="main__list-name">{currentListName}</span>
                  {mainMenu}
                </div>
                {sortButtons}
                <div id="task-container">
                  {tasksContents}
                </div>
              </>
            )
        }
        <div className="main__spacer"></div>
        <footer>
          <a href="https://github.com/heyzec/cvwo-assignment">View source on GitHub</a>
          <span> ??? </span>
          <a href="https://github.com/heyzec/cvwo-assignment/wiki">User guide</a>
        </footer>
      </div>
    </ResponsivePage>
  )
}

export default Main
