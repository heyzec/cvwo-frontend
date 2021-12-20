const Tag = ({ tag }) => {
  const bgColor = tag.color
  const fontColor = (
    (
      parseInt(bgColor.substring(1, 3), 16) * 0.299 +
      parseInt(bgColor.substring(3, 5), 16) * 0.587 +
      parseInt(bgColor.substring(5, 7), 16) * 0.114
    ) > 186 -40 ? "#000000" : "#FFFFFF"
  )
  
  const style = {
    backgroundColor: bgColor,
    color: fontColor
  }

  return (
    <div className="tag" style={style}>
      <span>{tag.text}</span>
    </div>
  )
}

export default Tag