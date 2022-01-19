import { FaPlus } from 'react-icons/fa'
import Button from 'material/Button'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import 'components/ListsSidebar.css'

const ListsSidebar = ({ context }) => {

  /***** Retrieve states from context object *****/
  const lists = context.getLists()
  const [currentList, setCurrentList] = [context.getCurrentList(), context.setCurrentList]


  /***** Event handlers *****/
  const addListClicked = async (e) => {
    const userInput = prompt("Enter name of new list")
    if (!userInput) {
      return
    }
    const newList = await context.addList({
      "text": userInput
    })
    setCurrentList(newList.id)
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
          lists.map((list) => (
            <SelectableListItem
              onClick={(e) => setCurrentList(list.id)}
              selected={list.id === currentList}
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
