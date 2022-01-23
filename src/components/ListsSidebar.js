import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import Button from 'material/Button'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import 'components/ListsSidebar.css'

const ListsSidebar = ({ context }) => {

  // ---------------- Retrieve states from context object  ----------------
  const lists = context.getLists()
  const [selectedListId, setSelectedListId] = [context.getSelectedListId(), context.setSelectedListId]
  
  const navigate = useNavigate()


  // ---------------- Event handlers  ----------------
  const addListClicked = async (e) => {
    const userInput = prompt("Enter name of new list")
    if (!userInput) {
      return
    }
    const newList = await context.addList({
      "text": userInput
    })
    setSelectedListId(newList.id)
  }
  
  const genListClicked = (list) => (e) => {
    setSelectedListId(list.id)
    navigate('/')
  }


  return (
    <div id="lists-sidebar">
      <div className="lists-sidebar__head">
        <span>Your lists</span>
        <hr />
      </div>
      <Button
        className="lists-sidebar__add-list"
        variant="contained"
        startIcon={<FaPlus />}
        onClick={addListClicked}
      >
        New list
      </Button>
      <SelectableList className="lists-sidebar__lists">
        {
          lists?.map((list) => (
            <SelectableListItem
              key={list.id}
              onClick={genListClicked(list)}
              selected={list.id === selectedListId}
            >
              {list.text}
            </SelectableListItem>
          ))
        }
      </SelectableList>
    </div>
  )
}
export default ListsSidebar
