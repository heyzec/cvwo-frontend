import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

import { FaClipboardList } from 'react-icons/fa'
import { BsFillGearFill } from 'react-icons/bs'

import { signOut } from 'utils/user'
import { attachListener, vimAddListener, vimRemoveListener } from 'utils/helpers'
import IconButton from 'material/IconButton'
import Paper from 'material/Paper'
import Button from 'material/Button'

import Searchbar from 'components/Searchbar'
import Identicon from 'components/Identicon'

import 'components/Header.css'
import Tooltip from 'material/Tooltip'

const Header = ({ context }) => {

  const [searchActive, setSearchActive] = useState(false)
  const [nowString, setNowString] = useState(dayjs().format("dddd, DD MMMM YYYY, HH:mm"))
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [keyMappings, setKeyMappings] = [context.getKeyMappings(), context.setKeyMappings]

  const navigate = useNavigate()
  const location = useLocation()

  const user = context.getUser()


  /** Opens user profile menu. Close it only if the user clicks elsewhere. */
  const userImageClicked = (e) => {
    if (!userMenuOpen) {
      attachListener({
        target: window,
        postRemoval: () => setUserMenuOpen(false),
        exclusionSelector: ".header__user-menu"
      })
    }
    setUserMenuOpen(!userMenuOpen)
  }

  const showSearchIcon = location.pathname === '/'


  // ---------------- Make the clock update itself every second  ----------------
  useEffect(() => {
    const timerId = setInterval(
      () => setNowString(dayjs().format("dddd, DD MMMM YYYY, HH:mm")),
      1000
    )

    // Return cleanup function when component unmounts
    return () => {
      clearInterval(timerId)
    }
  }, [])



  // ---------------- Other event handlers  ----------------
  const appIconClicked = (e) => navigate("/")
  const signinButtonClicked = (e) => navigate("/signin")
  const signupButtonClicked = (e) => navigate("/signup")

  const signoutButtonClicked = async (e) => signOut(context, navigate)

  const settingsClicked = (e) => navigate('/settings')


  useEffect(() => {
    const helper = () => signOut(context, navigate)
    const arr = []
    arr.push(vimAddListener(keyMappings, ':qEnter', helper))
    arr.push(vimAddListener(keyMappings, 'ZZ', helper))
    arr.push(vimAddListener(keyMappings, 'ZQ', helper))
    return () => arr.forEach(vimRemoveListener)
  }, [])


  return (
    <header id="header">
      <Tooltip text="Go home">
        <FaClipboardList id="header__icon" className="clickable" size="25" onClick={appIconClicked} />
      </Tooltip>
      <h1 id="header__title">Your To Dos</h1>
      <div id="header__spacer"></div>
      <div id="header__date" className={`header-elem${searchActive ? " header__date--hidden" : ""}`}>
        <span>{nowString}</span>
      </div>
      {
        showSearchIcon
          ? <Searchbar context={context} searchActive={searchActive} setSearchActive={setSearchActive} />
          : null
      }
      <div id="header__nav">
        {user
          ? (
            <IconButton onClick={userImageClicked}>
              <Identicon className="header__avatar" context={context} size="30" />
            </IconButton>
          ) : (
            <>
              <Tooltip text="Personalisation">
                <IconButton onClick={settingsClicked}>
                  <BsFillGearFill size="16" />
                </IconButton>
              </Tooltip>
              <Button className="header__signin" onClick={signinButtonClicked}>
                Sign in
              </Button>
              <Button className="header__signup" variant="contained" onClick={signupButtonClicked}>
                Sign up!
              </Button>
            </>
          )}
      </div>
      <Paper className={`header__user-menu${userMenuOpen ? " header__user-menu--active" : ""}`}>
        <Identicon className="header__avatar" context={context} size="60" />
        <div className="header__email">
          {user ? user.email : null}
        </div>
        <Button variant="outlined" onClick={settingsClicked}>Settings</Button>
        <Button variant="outlined" onClick={signoutButtonClicked}>Sign out</Button>
      </Paper>
    </header>
  )
}

export default Header
