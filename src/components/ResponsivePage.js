import { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import Paper from 'material/Paper'
import 'components/ResponsivePage.css'

const ResponsivePage = ({ header, drawer, children }) => {
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  

  const menuIconClicked = (e) => {
    e.stopPropagation()
    setMobileDrawerOpen(true)
  }
  
  const pageClicked = (e) => {
    if (e.target.closest(".page__drawer")) {  // Ignore clicks within the drawer
      return
    }
    setMobileDrawerOpen(false)
  }

  return (
    <div className="page" onClick={pageClicked}>
      <Paper className="page__header">
        <AiOutlineMenu className="page__menu-icon" size="25" onClick={menuIconClicked} />
        {header}
      </Paper>
      <Paper className={`page__drawer${mobileDrawerOpen ? " page__drawer--open" : ""}`}>
    {drawer}
      </Paper>
      <div className="page__content">
        {children}
      </div>
      <div className={`page__overlay${mobileDrawerOpen ? " page__drawer--open" : ""}`}></div>
    </div>
  )
}
export default ResponsivePage
