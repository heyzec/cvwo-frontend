import { FaTimes } from 'react-icons/fa'


const Tag = ({ tag, color, className, passRef, clickables, editable, value, onClick, onBlur }) => {



  const isBright = (rgb) => (
    (
      parseInt(rgb.substring(1, 3), 16) * 0.299 +
      parseInt(rgb.substring(3, 5), 16) * 0.587 +
      parseInt(rgb.substring(5, 7), 16) * 0.114
    ) > 186 - 40
  )


  const bgColor = (color !== undefined) ? color : (tag ? tag.color : "#888888")
  // const getC = () => {
  //   console.log()
  //   console.log(`this is tag`)
  //     console.log(tag)
  //   if (color !== undefined) {
  //     console.log("color is not undef")
  //     console.log(`returning ${color}`)
  //     return color
  //   }
  //   console.log("color is undef, check tag")
  //   if (tag) {
  //     console.log(`returning ${tag.color}`)
  //     return tag.color
  //   }
  //   console.log(`returning ${"#888888"}`)
  //   return "#888888"


  // }

  // const bgColor = getC()

  if (bgColor === undefined) {
    alert("OH NO BGCOLOR UNDEF")
  }
  const fontColor = isBright(bgColor) ? "#000000" : "#FFFFFF"
  const text = value !== undefined ? value : (tag ? tag.text : "undefined")

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
      {clickables}
      <span suppressContentEditableWarning={true} autoFocus={true} onKeyDown={handleKeyDown} ref={passRef} onBlur={onBlur} contentEditable={editable}>{text}</span>
    </div>
  )
}

export default Tag