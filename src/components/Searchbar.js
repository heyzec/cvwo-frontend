import { useState, useRef, useEffect } from 'react'

import { GoSearch } from 'react-icons/go'
import { BsFillTagsFill } from 'react-icons/bs'

import { attachListener, getUpdatedValue, vimAddListener, vimRemoveListener } from 'utils/helpers'
import TagsSelector from 'components/TagsSelector'
import IconButton from 'material/IconButton'
import TextField from 'material/TextField'
import Tooltip from 'material/Tooltip'


import 'components/Searchbar.css'

const Searchbar = ({ context, searchActive, setSearchActive }) => {

  // ---------------- Retrieve states from context object  ----------------
  const tags = context.getTags()

  // Value of input elem in searchbar
  const [searchValue, setSearchValue] = [context.getSearchValue(), context.setSearchValue]
  // An array of bools to indicate which tags are selected (and hence which to filter)
  const [searchBools, setSearchBools] = [context.getSearchBools(), context.setSearchBools]

  const [isOpen, setIsOpen] = useState(false)

  const searchBarRef = useRef(null)
  
  const [keyMappings, setKeyMappings] = [context.getKeyMappings(), context.setKeyMappings]


  /** Opens the searchbar. Close it back only if the search params is empty and no tags were added. */
  const searchIconClicked = (e) => {

    if (!searchActive) {
      searchBarRef.current.focus()

      const preRemoval = () => {
        const searchValue = getUpdatedValue(setSearchValue)
        const searchBools = getUpdatedValue(setSearchBools)
        return !Boolean(searchValue || searchBools.some(((x) => !!x)))
      }
      attachListener({
        target: window,
        preRemoval,
        postRemoval: () => setSearchActive(false),
        exclusionSelector: ".searchbar__box, .searchbar__dropdown-wrapper"
      })
    }
    setSearchActive(!searchActive)
    setSearchBools(tags.map(() => false))
  }


  const genOnClick = (tagId) => {
    const index = tags.findIndex((tag) => tag.id === tagId)
    // Flip the index-th bool in the array
    setSearchBools((bools) => {
      bools = [...bools]  // Create a new array first
      bools[index] = !bools[index]
      return bools
    })
  }

  /** Opens menu for user to choose tags. Close it only if the user clicks elsewhere. */
  const tagsIconClicked = (e) => {
    attachListener({
      target: window,
      preRemoval: () => setIsOpen(false),
      exclusionSelector: ".searchbar__dropdown-wrapper"
    })
    setIsOpen(!isOpen)
  }

  const inputKeyDowned = (e) => {
    if (!searchActive) {
      return
    }
    if (['Esc', 'Escape'].includes(e.key)) {
      e.stopPropagation()
      setSearchValue("")
      setSearchBools(tags.map(() => false))
      setSearchActive(false)
      searchBarRef.current.blur()  // Remove focus so that keyboard shortcuts are available again
    }
  }

  // Pressing '/' also triggers search
  useEffect(() => {
    const obj = vimAddListener(keyMappings, '/', (e) => {
      e.preventDefault()
      searchIconClicked(true)
    })
    return () => vimRemoveListener(obj)
  }, [])

  // Pressing '/' also triggers search
  useEffect(() => {
    const obj = vimAddListener(keyMappings, '/', (e) => {
      e.preventDefault()
      searchIconClicked(true)
    })
    return () => vimRemoveListener(obj)
  }, [])

  return (
    <div className="searchbar">
    <Tooltip text="Search tasks">
      <IconButton className="searchbar__icon" onClick={searchIconClicked}>
        <GoSearch />
      </IconButton>
    </Tooltip>
      <div className={`searchbar__box${searchActive ? " searchbar__box--active" : ""}`}>
        <TextField
          inputRef={searchBarRef}
          label="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={inputKeyDowned}
          className={`searchbar__input`}
        />
        <div className="searchbar__tags">
          <IconButton onClick={tagsIconClicked}>
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
