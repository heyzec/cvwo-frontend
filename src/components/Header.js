import { useState, useEffect, useRef } from 'react'
import { GoSearch } from 'react-icons/go'
import { AiOutlineMenu } from 'react-icons/ai'
import { FaClipboardList } from 'react-icons/fa'
import dayjs from 'dayjs'
import './Header.css'

const Header = () => {

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

  return (
    <header className="test" id="header">
      <FaClipboardList id="header-icon" size="25" />
      <h1 id="header-title">Your To Dos</h1>
      <div id="header-spacer"></div>
      <div id="header-date" className={`header-elem${searchActive ? " active" : ""}`}>
        <span>{nowString}</span>
      </div>
      <div id="header-search">
        <GoSearch className="icon" onClick={clickedSearchIcon} />
        <input ref={refSearchBar} id="header-search-input" className={searchActive ? "active" : ""} placeholder="Search here" onBlur={searchIconBlurred} />
      </div>
      <div id="header-nav" className={active ? "active" : null}>
        <div id="header-nav-signin" className="header-elem">
          <span>Sign in</span>
        </div>
        <div id="header-nav-signup" className="header-elem">
          <span>Sign up!</span>
        </div>
      </div>
      <AiOutlineMenu id="header-toggle" size={25} onClick={toggleMenu} className="clickable" />
    </header>
  )
}

export default Header
