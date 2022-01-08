import { useState, useEffect, useRef } from 'react'
import { GoSearch } from 'react-icons/go'
import { AiOutlineMenu } from 'react-icons/ai'
import { FaClipboardList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import 'components/Header.css'

import { signOut } from 'utils/auth.js'

const Header = ({ context }) => {
  
  const navigate = useNavigate()

  const [active, setActive] = useState(false)
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

  const toggleMenu = () => setActive(!active)
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
    <header className="test" id="header">
      <FaClipboardList id="header__icon" className="clickable" size="25" onClick={appIconClicked}
        onContextMenu={(e) => {e.preventDefault(); context.magic()}} />
      <h1 id="header__title">Your To Dos</h1>
      <div id="header__spacer"></div>
      <div id="header__date" className={`header-elem${searchActive ? " header__date--hidden" : ""}`}>
        <span>{nowString}</span>
      </div>
      <div id="header__search">
        <GoSearch className="clickable" onClick={clickedSearchIcon} />
        <input ref={refSearchBar} id="header__input" className={`themed-input${searchActive ? " header__input--active" : ""}`} placeholder="Search here" onBlur={searchIconBlurred} />
      </div>
      <div id="header__nav" className={active ? "header__nav--active" : null}>
        {context.getUser() ? (
          <div id="header__signout" className="header-elem clickable" onClick={signoutIconClicked}>
            <span>Sign out</span>
          </div>
        ) : (
          <>
            <div id="header__signin" className="header-elem clickable" onClick={signinIconClicked}>
              <span>Sign in</span>
            </div>
            <div id="header__signup" className="header-elem clickable" onClick={signupIconClicked}>
              <span>Sign up!</span>
            </div>
          </>
        )}
      </div>
      <AiOutlineMenu id="header__toggle" size={25} onClick={toggleMenu} className="clickable" />
    </header>
  )
}

export default Header
