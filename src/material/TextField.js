import 'material/TextField.css'

const TextField = ({ type, label, className, value, onChange }) => {

  return (
    <div className={`textfield${className ? " " + className : ""}`}>
      <input className="textfield__input" type={type} autocomplete="off" value={value} onChange={onChange} />
        <div className="textfield__text-wrapper">
          <span className="textfield__text">{label}</span>
        </div>
    </div>
  )
}
export default TextField
