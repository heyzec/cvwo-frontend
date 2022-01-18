import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { FaClipboardList } from 'react-icons/fa'

import { signOut } from 'utils/auth.js'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'
import Button from 'material/Button'

import Searchbar from 'components/Searchbar'
import Identicon from 'components/Identicon'

import 'components/Header.css'

const Header = ({ context }) => {

  const [searchActive, setSearchActive] = useState(false)

  const [nowString, setNowString] = useState(dayjs().format("dddd, DD MMMM YYYY, HH:mm"))

  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navigate = useNavigate()


  const userImageClicked = (e) => {
    if (!userMenuOpen) {
      window.addEventListener('click', function handler(ev) {
        if (e.nativeEvent === ev || ev.target.closest(".header__user-menu")) {
          return
        }
        setUserMenuOpen(false)
        ev.currentTarget.removeEventListener(ev.type, handler)
      }, { capture: true })  // Use capture so that the window's event listener fires first
    }
    setUserMenuOpen(!userMenuOpen)
  }


  /***** Make the clock update itself every second *****/
  useEffect(() => {
    const timerId = setInterval(() => setNowString(dayjs().format("dddd, DD MMMM YYYY, HH:mm")), 1000);

    // Return cleanup function when component unmounts
    return () => {
      clearInterval(timerId);
    }
  }, [])


  const settingsClicked = (e) => navigate('/settings')


  /***** Other event handlers *****/
  const appIconClicked = (e) => navigate("/")
  const signinIconClicked = (e) => navigate("/signin")
  const signupIconClicked = (e) => navigate("/signup")

  const signoutIconClicked = async (e) => {
    await signOut()
    context.setUser("")
    context.notify("Logged out!", "lightgreen", 1000)
    setUserMenuOpen(false)
    navigate("/")
  }


  return (
    <header id="header">
      <FaClipboardList id="header__icon" className="clickable" size="25" onClick={appIconClicked}
        onContextMenu={(e) => { e.preventDefault(); context.magic() }}
      />
      <h1 id="header__title">Your To Dos</h1>
      <div id="header__spacer"></div>
      <div id="header__date" className={`header-elem${searchActive ? " header__date--hidden" : ""}`}>
        <span>{nowString}</span>
      </div>
      {
        // Removed temporarily
        // <Searchbar context={context} searchActive={searchActive} setSearchActive={setSearchActive} />
      }
      <div id="header__nav">
        {context.getUser()
          ? (
            <IconButton onClick={userImageClicked}>
              <Identicon className="header__avatar" context={context} size="30" />
            </IconButton>
          ) : (
            <>
              <Button className="header__signin" onClick={signinIconClicked}>Sign in</Button>
              <Button className="header__signup" variant="contained" onClick={signupIconClicked}>Sign up!</Button>
            </>
          )}
      </div>
      <Paper className={`header__user-menu${userMenuOpen ? " header__user-menu--active" : ""}`}>
        <Identicon className="header__avatar" context={context} size="60" />
        <div className="header__email">
          {context.getUser()}
        </div>
        <Button variant="outlined" onClick={settingsClicked}>Settings</Button>
        <Button variant="outlined" onClick={signoutIconClicked}>Sign out</Button>
      </Paper>
    </header>
  )
}

export default Header
