import { useState, useRef, useEffect } from 'react'

import { MdSearch, MdSearchOff } from 'react-icons/md'
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

  const [selectedListId, setSelectedListId] = [context.getSelectedListId(), context.setSelectedListId]

  const [isOpen, setIsOpen] = useState(false)

  const searchBarRef = useRef(null)

  const [keyMappings, setKeyMappings] = [context.getKeyMappings(), context.setKeyMappings]


  /** Opens the searchbar. Close it back only if the search params is empty and no tags were added. */
  const searchIconClicked = (e) => {
    if (!selectedListId) {
      context.toasts.success("Please select a list first!")
      return
    }

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
        postRemoval: cancelSearch,
        exclusionSelector: ".searchbar"
      })
      setSearchActive(true)
      setSearchBools(tags.map(() => false))
    } else {
      cancelSearch()
    }
  }

  const cancelSearch = () => {
    setSearchValue("")
    setIsOpen(false)
    setSearchActive(false)
    setSearchBools((bools) => bools.map(() => false))
    searchBarRef.current.blur()  // Remove focus so that keyboard shortcuts are available again
  }


  const flipBoolByText = (tagText) => {
    const index = tags.findIndex((tag) => tag.text === tagText)
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
      cancelSearch()
    }
  }

  const enterMatched = (searchValue) => {
    flipBoolByText(searchValue)
  }


  // Pressing '/' also triggers search
  useEffect(() => {
    const arr = []
    arr.push(vimAddListener(keyMappings, '/', (e) => {
      e.preventDefault()
      searchIconClicked(true)
    }))
    arr.push(vimAddListener(keyMappings, 'Escape', (e) => {
      cancelSearch()
    }))
    return () => arr.forEach(vimRemoveListener)
  }, [selectedListId])


  const nBoolsTrue = searchBools.filter(Boolean).length

  return (
    <div className="searchbar">
      <Tooltip text={searchActive ? "Cancel" : "Search tasks"}>
        <IconButton className="searchbar__icon" onClick={searchIconClicked}>
          {
            searchActive
              ? <MdSearchOff size="20" />
              : <MdSearch size="20" />
          }
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
          <Tooltip text="Filter by tags">
            <IconButton onClick={tagsIconClicked}>
              <BsFillTagsFill />
            </IconButton>
          </Tooltip>
          {
            !nBoolsTrue ? null
              : <div className="searchbar__num">{nBoolsTrue}</div>
          }
          <div className={`searchbar__dropdown-wrapper${isOpen ? "" : " remove"}`}>
            {
              tags && isOpen
                ? <TagsSelector
                  context={context}
                  tags={tags}
                  genOnClick={flipBoolByText}
                  enterMatched={enterMatched}
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
