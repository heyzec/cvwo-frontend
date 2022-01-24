import { useState } from 'react'
import { TiTick } from 'react-icons/ti'

import Tag from 'components/Tag'
import Paper from 'material/Paper'
import TextField from 'material/TextField'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'

import 'components/TagsSelector.css'

const TagsSelector = ({ tags, bools, genOnClick }) => {

  // ---------------- Validate input props  ----------------
  if (
    (bools && !tags) ||
    (bools && bools.length !== 0 && tags.length !== bools.length)
  ) {
    console.warn("Invalid input received by TagsSelector component.")
  }

  const [searchValue, setSearchValue] = useState("")

  const valueChanged = (e) => setSearchValue(e.target.value)

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
          <TiTick className={bools && bools[i] ? "" : "hidden"} />
          <Tag
            key={tag.id}
            tag={tag}
          />
        </div>
      </SelectableListItem>
    )
  }


  return (
    <Paper elevation="4" className="tags-selector" >
      <TextField label="Search tags" value={searchValue} onChange={valueChanged} />
      <div className="tags-selector__tags">
        {
          tags.length !== 0 && tableContents.length !== 0
            ? (
              <>
                <SelectableList>
                  {tableContents}
                </SelectableList>
              </>
            )
            : "No tags available."
        }
      </div>
    </Paper>
  )
}
export default TagsSelector
