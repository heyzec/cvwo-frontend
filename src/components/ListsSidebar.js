import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton  from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import InboxIcon from '@mui/icons-material/MoveToInbox'

import './ListsSidebar.css'

const drawerWidth = 240;
const headerHeight = 75

const ListsSidebar = ({ context, mobileOpen, setMobileOpen }) => {
  
  const lists = context.getLists()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Typography variant="h5">
        Your Lists
      </Typography>
      <Divider />
      <List>
        {
          lists.map(((list) => {
            const listClicked = (e) => {
              context.setCurrentList(list.id)
            }
            return (
              <ListItem disablePadding onClick={listClicked}>
                <ListItemButton selected={list.id === context.getCurrentList()}>
                  <ListItemIcon>
                    {<MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={list.text} />
                </ListItemButton>
              </ListItem>
            )
          }))
        }

      </List>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box',
          width: drawerWidth, height: `calc(100% - ${drawerWidth}px)` ,
          position: 'relative',
          top: headerHeight,
          bottom: '0'
        },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
export default ListsSidebar
