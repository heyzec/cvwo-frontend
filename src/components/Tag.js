import { isBright } from 'utils/funcs'
import 'components/Tag.css'


const Tag = ({ tag, className, passRef, clickables, onClick }) => {

  className = className ? ` ${className}` : ""  // If more caller wants to attach more classes to Tag obj

  const bgColor = (tag ? tag.color : "#888888")
  const fontColor = isBright(bgColor) ? "#000000" : "#FFFFFF"
  const displayText = tag.text || "Tag preview"

  const style = {
    backgroundColor: bgColor,
    color: fontColor
  }

  return (
    <div className={`tag${className}`} style={style} onClick={onClick}>
      <div className="tag__clickables">
        {clickables}
      </div>
      <span ref={passRef}>{displayText}</span>
    </div>
  )
}

export default Tag
