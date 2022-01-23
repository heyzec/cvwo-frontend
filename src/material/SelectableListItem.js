import Button from 'material/Button'
import 'material/SelectableListItem.css'

const SelectableListItem = ({ startIcon, endIcon, selected, onClick, children, ...otherProps }) => {

  const contents = (
    <div {...otherProps}>
      {startIcon}
      {children}
      {
        endIcon ?
          <>
            <span className="list__item__spacer"></span>
            {endIcon}
          </>
          : null
      }
    </div>
  )


  return (
    <div className={`list__item${selected ? " list__item__selected" : ""}`}>
      <Button onClick={onClick}>
        {contents}
      </Button>
      {
        selected
          ? <div className="list__item__overlay"> </div>
          : null
      }
    </div>
  )
}
export default SelectableListItem
