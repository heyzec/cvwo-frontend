import 'material/Paper.css'

const Paper = ({ className, children, elevation, style }) => {
  
  elevation = elevation || 1  // Elevation defaults to 1
  
  if (![1, 2, 3, 4, 5].includes(elevation)) {
    console.warn("Paper component only accepts elevations 1 thru 5")
  }


  return (
    <div className={`paper paper--${elevation}${className ? " " + className : ""}`} style={style}>
      {children}
    </div>
  )
}
export default Paper
