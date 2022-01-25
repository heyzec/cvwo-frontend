import 'material/TextField.css'

const TextField = ({ type, label, className, value, onChange, inputRef, fixedLabel, ...otherProps }) => {
  return (
    <div className={`textfield${className ? " " + className : ""}`}>
      <input
        ref={inputRef}
        className="textfield__input"
        type={type}
        autoComplete="off"
        value={value}
        onChange={onChange}
        {...otherProps}
      />
      <div className="textfield__outline"></div>
      <div className="textfield__text-wrapper">
        <span className={`textfield__text${fixedLabel ? " textfield--fixed" : ""}`}>{label}</span>
      </div>
    </div>
  )
}
export default TextField
