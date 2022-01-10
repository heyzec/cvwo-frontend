import 'material/Tooltip.css'

const Tooltip = ({ text, children }) => {
  return (
    <div>
      <div className="tooltip__content">
        {children}
      </div>
      <div className="tooltip__text-wrapper">
        <span className="tooltip__text">{text}</span>
      </div>
    </div >
  )
}
export default Tooltip
