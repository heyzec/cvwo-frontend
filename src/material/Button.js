import Paper from 'material/Paper'
import 'material/Button.css'

const Button = ({ variant, startIcon, endIcon, children, className, onClick, ...otherProps }) => {

  // https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
  // Also refer to comment by Joao Rodrigues
  const createRipple = (e) => {
    const button = e.currentTarget
    const diameter = Math.max(button.clientWidth, button.clientHeight) / 2
    const radius = diameter / 2

    const rippleContainer = button.getElementsByClassName("button__ripple-container")[0]
    const btnRect = button.getBoundingClientRect()

    const circle = document.createElement("span")
    circle.classList.add("button__ripple")
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - (btnRect.left + radius)}px`
    circle.style.top = `${e.clientY - (btnRect.top + radius)}px`

    circle.addEventListener('animationend', () => rippleContainer.removeChild(circle))

    rippleContainer.appendChild(circle)
  }

  const buttonClicked = (e) => {
    createRipple(e)
    onClick && onClick(e)
  }

  const variantClass = ["text", "outlined", "contained"].includes(variant) ? ` button--${variant}` : ""
  
  const buttonDecorationContents = (
    <div className="button__container">
      {startIcon}
      {children}
      {endIcon}
    </div>
  )

  return (
    <button className={`button${variantClass}${className ? " " + className : ""}`}
      onClick={buttonClicked}
      {...otherProps}
    >
      {
        variant === "contained"
          ? (
            <Paper className="button__decoration">
              {buttonDecorationContents}
            </Paper>
          )
          : (
            <div className="button__decoration">
              {buttonDecorationContents}
            </div>
          )
      }
      <div className="button__ripple-container"></div>
    </button>
  )
}
export default Button
