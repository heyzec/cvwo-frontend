import 'material/SelectableList.css'

const SelectableList = ({ className, children }) => {
  return (
    <div className={`list${className ? " " + className : ""}`}>
      {children}
    </div>
  )
}
export default SelectableList
