import './ListsSidebar.css'

const ListsSidebar = ({ context }) => {

  const ListButton = ({ list }) => {
    const listClicked = (e) => {
      context.setCurrentList(list.id)
    }
    return <div className="lists-sidebar__list clickable" onClick={listClicked}>{list.text}</div>
  }
  
  const addListClicked = (e) => {
    context.addList({
      "text": prompt("Enter name of new list")
    })
  }

  return (
    <div id="lists-sidebar">
      <span id="lists-sidebar__label">Your Lists</span>
      <button onClick={addListClicked}>Add</button>
      <div>
        {
          context.getLists().map(list => <ListButton list={list} />)
        }
      </div>
    </div>
  )
}
export default ListsSidebar
