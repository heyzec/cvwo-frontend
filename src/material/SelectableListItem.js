import Button from 'material/Button'
import 'material/SelectableListItem.css'

const SelectableListItem = ({ selected, onClick, children }) => {
  return (
    <div className={`list__item${selected ? " list__item--selected" : ""}`}>
      <Button onClick={onClick}>
        {children}
      </Button>
      {
        selected
          ? <div className="list__item-overlay"> </div>
          : null
      }
    </div>
  )
}
export default SelectableListItem
