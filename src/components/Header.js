import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'

import { GoSearch } from 'react-icons/go'
import { FaClipboardList } from 'react-icons/fa'

import Button from 'material/Button'
import IconButton from 'material/IconButton'
import { signOut } from 'utils/auth.js'

import 'components/Header.css'

const Header = ({ context }) => {

  const navigate = useNavigate()

  const [searchActive, setSearchActive] = useState(false)
  const [nowString, setNowString] = useState(dayjs().format("dddd, DD MMMM YYYY, HH:mm"))

  useEffect(() => {
    const timerId = setInterval(() => setNowString(dayjs().format("dddd, DD MMMM YYYY, HH:mm")), 1000);
    // Return cleanup function when component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const refSearchBar = useRef(null)

  const clickedSearchIcon = (e) => {
    if (!searchActive) {
      refSearchBar.current.focus()
    }
    setSearchActive(!searchActive)
  }
  const searchIconBlurred = (e) => setSearchActive(false)


  const appIconClicked = (e) => navigate("/")
  const signinIconClicked = (e) => navigate("signin")
  const signupIconClicked = (e) => navigate("signup")

  const signoutIconClicked = (e) => {
    signOut()
    context.setUser("")
    navigate("/")
    context.notify("Logged out!", "lightgreen", 1000)
  }

  return (
    <header id="header">
      <FaClipboardList id="header__icon" className="clickable" size="25" onClick={appIconClicked}
        onContextMenu={(e) => { e.preventDefault(); context.magic() }} />
      <h1 id="header__title">Your To Dos</h1>
      <div id="header__spacer"></div>
      <div id="header__date" className={`header-elem${searchActive ? " header__date--hidden" : ""}`}>
        <span>{nowString}</span>
      </div>
      <div id="header__search">
        <IconButton className="header__search-icon">
          <GoSearch onClick={clickedSearchIcon} />
        </IconButton>
        <input ref={refSearchBar} id="header__input" className={`themed-input${searchActive ? " header__input--active" : ""}`} placeholder="Search here" onBlur={searchIconBlurred} />
      </div>
      <div id="header__nav">
        {context.getUser() ? (
          <Button className="header__signout" onClick={signoutIconClicked}>Sign out</Button>
        ) : (
          <>
            <Button className="header__signin" onClick={signinIconClicked}>Sign in</Button>
            <Button className="header__signup" variant="contained" onClick={signupIconClicked}>Sign up!</Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
