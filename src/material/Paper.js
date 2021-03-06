import 'material/Paper.css'

const Paper = ({ className, children, elevation, ...otherProps }) => {
  
  elevation = elevation ? parseInt(elevation) : 1  // Elevation defaults to 1
  
  if (![1, 2, 3, 4, 5].includes(elevation)) {
    console.warn("Paper component only accepts elevations 1 thru 5")
  }


  return (
    <div className={`paper paper--${elevation}${className ? " " + className : ""}`} {...otherProps} >
      {children}
    </div>
  )
}
export default Paper
