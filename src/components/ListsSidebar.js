import Button from 'material/Button'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import 'components/ListsSidebar.css'

const ListsSidebar = ({ context }) => {

  const addListClicked = async (e) => {
    const userInput = prompt("Enter name of new list")
    if (userInput) {
      const newList = await context.addList({
        "text": userInput
      })
      context.setCurrentList(newList.id)
    }
  }

  return (
    <div id="lists-sidebar">
      <span id="lists-sidebar__label">Your Lists</span>
      <Button className="lists-sidebar__new-list" variant="contained" onClick={addListClicked}>
        Create a new list
      </Button>
      <SelectableList>
        {
          context.getLists().map((list) => (
            <SelectableListItem
              text={list.text}
              onClick={(e) => context.setCurrentList(list.id)}
              selected={list.id === context.getCurrentList()}
            />
          ))
        }
      </SelectableList>
    </div>
  )
}
export default ListsSidebar
