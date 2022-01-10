import 'material/Button.css'

const Button = ({ startIcon, endIcon , children, className}) => {
  const buttonClicked = (e) => {
    const button = e.currentTarget
    const diameter = Math.max(button.clientWidth, button.clientHeight) / 2
    const radius = diameter / 2;

    const rippleContainer = button.getElementsByClassName("button__ripple-container")[0]
    const btnRect = button.getBoundingClientRect();

    const circle = document.createElement("span")
    circle.classList.add("ripple")
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - (btnRect.left + radius)}px`
    circle.style.top = `${e.clientY - (btnRect.top + radius)}px`;

    circle.addEventListener('animationend', () => rippleContainer.removeChild(circle))

    rippleContainer.appendChild(circle)
  }
  console.log(children)

  return (
    <button className={`button ${className}`} onClick={buttonClicked}>
      <div className="button__container">
    {startIcon}
      {children}
    {endIcon}
        
      </div>
      <div className="button__ripple-container"> </div>
    </button>
  )
}
export default Button
