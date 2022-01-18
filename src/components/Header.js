import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { FaClipboardList } from 'react-icons/fa'
import { BsFillGearFill } from 'react-icons/bs'

import { signOut } from 'utils/auth.js'
import Searchbar from 'components/Searchbar'
import IconButton from 'material/IconButton'
import Button from 'material/Button'

import 'components/Header.css'

const Header = ({ context }) => {

  const [searchActive, setSearchActive] = useState(false)

  const [nowString, setNowString] = useState(dayjs().format("dddd, DD MMMM YYYY, HH:mm"))

  const navigate = useNavigate()

  /***** Make the clock update itself every second *****/
  useEffect(() => {
    const timerId = setInterval(() => setNowString(dayjs().format("dddd, DD MMMM YYYY, HH:mm")), 1000);

    // Return cleanup function when component unmounts
    return () => {
      clearInterval(timerId);
    }
  }, [])


  /***** Other event handlers *****/
  const appIconClicked = (e) => navigate("/")
  const signinIconClicked = (e) => navigate("/signin")
  const signupIconClicked = (e) => navigate("/signup")

  const signoutIconClicked = (e) => {
    signOut()
    context.setUser("")
    navigate("/")
    context.notify("Logged out!", "lightgreen", 1000)
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
      <IconButton onClick={() => navigate('/settings')}>
        <BsFillGearFill />
      </IconButton>
      <div id="header__nav">
        {context.getUser()
          ? (
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
