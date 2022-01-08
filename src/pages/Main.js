import { useState } from 'react'
import TagsSidebar from '../components/TagsSidebar'
import ListsSidebar from '../components/ListsSidebar'
import Task from '../components/Task'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import './Main.css'

const drawerWidth = 240
const headerHeight = 75

const Main = ({ context }) => {

  const tasks = context.getTasks()

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentList, setCurrentList] = useState(null)
  const [editingListName, setEditingListName] = useState(false)
  const [newListName, setNewListName] = useState("")

  context.setCurrentListCallbacks(() => currentList, setCurrentList)


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  };

  const editListClicked = (e) => {
    setEditingListName(true)
    setNewListName(context.getLists().find((list) => list.id === currentList).text)
    return

  }
  const deleteListClicked = (e) => {
    if (window.confirm("Are you sure to delete?")) {

      context.deleteList(currentList)
      setCurrentList(null)
    }
    // Also delete tasks locally?
  }


  const handleChange = (e) => {
    setNewListName(e.target.value)
  }

  const confirmClicked = (e) => {
    context.editList(currentList, {
      "text": newListName
    })
    setEditingListName(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          /* width: { sm: `calc(100% - ${drawerWidth}px)` }, */
          width: { sm: '100%' },
          ml: { sm: `${drawerWidth}px` },
          height: headerHeight
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
          <TextField color="secondary" variant="filled" label="Search" />
          <Button variant="contained" color="secondary">Sign In</Button>
          <Button variant="contained" color="secondary">Sign Up</Button>
        </Toolbar>
      </AppBar>
      <ListsSidebar context={context} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <div id="center">
          <span>
            {context.getUser()
              ? (<>
                Welcome {context.getUser()}
              </>)
              : "You're not logged in!"
            }
          </span>
        </div>
        {
          context.getLists() && currentList
            ?
            <>
              <div>
                <Box>
                  {
                    editingListName
                      ? <>
                        <TextField label="name" value={newListName} onChange={handleChange} />
                        <Button variant="contained" onClick={confirmClicked}> Confirm </Button>
                      </>
                      : <>
                        <Paper sx={{ display: "inline" }} display="inline">
                          <Typography display="inline" variant="h6">
                            {context.getLists().find((list) => list.id === currentList).text}
                          </Typography>

                        </Paper>
                        <Button variant="contained" onClick={editListClicked}> Edit </Button>
                      </>
                  }
                  <Button variant="contained" color="warning" onClick={deleteListClicked}> Delete </Button>
                </Box>
              </div>
              <div id="task-container">
                {
                  tasks.filter((task) => task.list_id === currentList).map(
                    ((task) => <Task context={context} key={task.id} task={task} isCreated={true} />)
                  )
                }
                <Task context={context} isCreated={false} />
              </div>
              <Paper><h3>Example Paper </h3></Paper>
            </>
            : <span>Pick a list!</span>
        }
        {
          /* <TagsSidebar context={context} /> */
        }
      </Box>
    </Box>
  )
}

export default Main
