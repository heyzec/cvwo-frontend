import 'material/SelectableList.css'

const SelectableList = ({ className, children, ...otherProps }) => {
  return (
    <div className={`list${className ? " " + className : ""}`} {...otherProps}>
      {children}
    </div>
  )
}
export default SelectableList
