import { useState, useRef } from 'react'

import { GoSearch } from 'react-icons/go'
import { BsFillTagsFill } from 'react-icons/bs'

import TagsSelector from 'components/TagsSelector'
import IconButton from 'material/IconButton'
import TextField from 'material/TextField'

import 'components/Searchbar.css'

const Searchbar = ({ context, searchActive, setSearchActive }) => {

  /***** Retrieve states from context object *****/
  const tags = context.getTags()

  // Value of input elem in searchbar
  const [searchValue, setSearchValue] = [context.getSearchValue(), context.setSearchValue]
  // An array of bools to indicate which tags are selected (and hence which to filter)
  const [searchBools, setSearchBools] = [context.getSearchBools(), context.setSearchBools]

  const [isOpen, setIsOpen] = useState(false)

  const refSearchBar = useRef(null)
  const searchIconClicked = (e) => {

    if (!searchActive) {
      e.stopPropagation()

      refSearchBar.current.focus()

      window.addEventListener('click', function handler(e) {

        // Obtain the updated values of searchValue and searchBools via setters of useState
        let searchValue = null, searchBools = null;
        setSearchValue((value) => {
          searchValue = value
          return value
        })
        setSearchBools((value) => {
          searchBools = value
          return value
        })

        if (
          (searchValue || searchBools.some((x) => !!x)) ||
          (e.target.closest(".searchbar__box, .searchbar__dropdown-wrapper"))
        ) {
          return
        }

        setSearchActive(false)
        e.currentTarget.removeEventListener(e.type, handler)
      })
    }
    setSearchActive(!searchActive)

    setSearchBools(tags.map(() => false))
  }


  const genOnClick = (tagId) => {
    const index = tags.findIndex((tag) => tag.id === tagId)
    setSearchBools((bools) => {
      bools = [...bools]  // Create a new array first
      bools[index] = !bools[index]
      return bools
    })
  }

  const searchTagsChooser = (e) => {
    e.stopPropagation()

    window.addEventListener('click', function handler(e) {
      if (e.target.closest(".searchbar__dropdown-wrapper")) {
        return
      }
      setIsOpen(false)
      e.currentTarget.removeEventListener(e.type, handler)
    })

    setIsOpen(!isOpen)
  }


  return (
    <div className="searchbar">
      <IconButton className="searchbar__icon" onClick={searchIconClicked}>
        <GoSearch />
      </IconButton>
      <div className={`searchbar__box${searchActive ? " searchbar__box--active" : ""}`}>
        <TextField
          inputRef={refSearchBar}
          label="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`searchbar__input`}
        />
        <div className="searchbar__tags">
          <IconButton onClick={searchTagsChooser}>
            <BsFillTagsFill />
          </IconButton>
          <div className={`searchbar__dropdown-wrapper${isOpen ? "" : " remove"}`}>
            {
              isOpen
                ? <TagsSelector
                  tags={tags}
                  genOnClick={genOnClick}
                  bools={searchBools}
                />
                : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default Searchbar
