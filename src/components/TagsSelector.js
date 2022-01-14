import { useState } from 'react'
import { TiTick } from 'react-icons/ti'

import Tag from 'components/Tag'
import Paper from 'material/Paper'
import TextField from 'material/TextField'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'

import 'components/TagsSelector.css'

const TagsSelector = ({ tags, bools, genOnClick }) => {

  /***** Validate input props *****/

  if (
    (bools && !tags) ||
    (bools && bools.length !== 0 && tags.length !== bools.length)
  ) {
    console.warn("Invalid input")
  }

  const [searchValue, setSearchValue] = useState("")


  let tableContents = []
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]

    if (!tag.text.toLowerCase().includes(searchValue.toLowerCase())) {
      continue
    }

    tableContents.push(
      <SelectableListItem
        onClick={(e) => {
          genOnClick(tag.id)
          setSearchValue("")
        }}
      >
        <div>
          {
            bools && bools[i]
              ? <TiTick />
              : null
          }
          <Tag
            className="clickable"
            key={tag.id}
            tag={tag}
          />
        </div>
      </SelectableListItem>
    )
  }

  const valueChanged = (e) => setSearchValue(e.target.value)

  return (
    <Paper elevation="4" className="tags-selector" >
      <TextField value={searchValue} onChange={valueChanged} />
      <SelectableList>
        {tableContents}
      </SelectableList>
    </Paper>
  )
}
export default TagsSelector
