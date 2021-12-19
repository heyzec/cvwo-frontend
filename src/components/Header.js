import {useState} from 'react'
import { GoSearch } from 'react-icons/go'
import { AiOutlineMenu } from 'react-icons/ai'

const Header = () => {
  
  const [active, setActive] = useState(false)

  const toggleMenu = () => {
    console.log("CALLED")
    setActive(!active)
  }

  return (
    <header id="header">
      <div id="header-title">
        <h1>
          Your To Dos
        </h1>
      </div>
      <AiOutlineMenu id="header-toggle" size={25} onClick={toggleMenu} className="clickable" />
      <div id="header-spacer"></div>
      <div id="header-search">
        <GoSearch />
      </div>
      <div id="header-date" className="header-elem">
        <span>Sem 1 Vacation 1</span>
      </div>
      <div id="header-nav" className={active ? "active" : null}>
        <div id="header-example" className="header-elem">
          <span>Example</span>
        </div>
        <div id="header-login" className="header-elem">
          <span>Sign up!</span>
        </div>
      </div>

    </header>
  )
}

  export default Header
