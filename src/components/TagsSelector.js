import { useState } from 'react'
import { TiTick } from 'react-icons/ti'

import { caseInsensitiveMatch, caseInsensitivePartial } from 'utils/funcs'
import Tag from 'components/Tag'
import Paper from 'material/Paper'
import TextField from 'material/TextField'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'

import 'components/TagsSelector.css'

const TagsSelector = ({ tags, bools, genOnClick, enterMatched, enterNoMatch }) => {

  // ---------------- Validate input props  ----------------
  if (
    (!tags) ||
    (bools && bools.length !== 0 && tags.length !== bools.length)
  ) {
    console.error("Invalid input received by TagsSelector component.")
  }

  const [searchValue, setSearchValue] = useState("")

  const valueChanged = (e) => setSearchValue(e.target.value)



  let tableContents = []
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]

    if (!caseInsensitivePartial(tag.text, searchValue)) {
      continue
    }

    tableContents.push(
      <SelectableListItem
        key={tag.id}
        onClick={(e) => {
          genOnClick(tag.text)
          setSearchValue("")
        }}
      >
        <div className="tags-selector__item">
          <TiTick className={bools && bools[i] ? "" : "hidden"} />
          <Tag
            tag={tag}
          />
        </div>
      </SelectableListItem>
    )
  }


  const keyDowned = async (e) => {
    if (e.key !== "Enter") {
      return
    }

    if (tags.every((tag) => !caseInsensitiveMatch(tag.text, searchValue))) {
      enterNoMatch && enterNoMatch(searchValue)
    } else if (tags.filter((tag) => caseInsensitiveMatch(tag.text, searchValue)).length === 1) {
      const index = tags.findIndex((tag) => caseInsensitiveMatch(tag.text, searchValue))
      enterMatched && enterMatched(tags[index].text)
    }
  }

  return (
    <Paper elevation="3" className="tags-selector" >
      <TextField label="Search tags" value={searchValue} onChange={valueChanged} onKeyDown={keyDowned} />
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
