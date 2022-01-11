import Button from 'material/Button'

// Just a wrapper for the Button component
const IconButton = ({ children, className, onClick }) => {
  return (
    <Button className={`${className + " " || ""}button--icon`} onClick={onClick}>
      {children}
    </Button>
  )
}
export default IconButton
