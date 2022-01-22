// Returns the most updated state from a setter of useState
// Useful when needed to access state from an attached event listener

const getUpdatedValue = (setValue) => {
  let output
  const func = (val) => {
    output = val
    return val
  }
  setValue(func)
  return output
}
export default getUpdatedValue
