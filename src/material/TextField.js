import 'material/TextField.css'

const TextField = ({ type, label, className, value, onChange, inputRef }) => {

  return (
    <div className={`textfield${className ? " " + className : ""}`}>
      <input ref={inputRef} className="textfield__input" type={type} autoComplete="off" value={value} onChange={onChange} />
        <div className="textfield__text-wrapper">
          <span className="textfield__text">{label}</span>
        </div>
    </div>
  )
}
export default TextField
