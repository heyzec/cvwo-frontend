import { FaTimes } from 'react-icons/fa'


const Tag = ({ tag, color, className, passRef, clickables, value, onClick, onBlur }) => {

  const isBright = (rgb) => (
    (
      parseInt(rgb.substring(1, 3), 16) * 0.299 +
      parseInt(rgb.substring(3, 5), 16) * 0.587 +
      parseInt(rgb.substring(5, 7), 16) * 0.114
    ) > 186 - 40
  )

  const bgColor = (color !== undefined) ? color : (tag ? tag.color : "#888888")

  const fontColor = isBright(bgColor) ? "#000000" : "#FFFFFF"
  const text2 = value !== undefined ? value : (tag ? tag.text : "undefined")
  const displayText = text2 || "Tag preview"


  const style = {
    backgroundColor: bgColor,
    color: fontColor
  }


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <div data-tag-id={tag ? tag.id : null} className={`tag ${className}`} style={style} onClick={onClick}>
      <div className="tag-clickables">
        {clickables}
      </div>
      <span onKeyDown={handleKeyDown} ref={passRef} onBlur={onBlur}>
        {displayText}
      </span>
    </div>
  )
}

export default Tag