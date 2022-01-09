import ResponsivePage from "components/ResponsivePage"
import ListsSidebar from "components/ListsSidebar"
import Header from "components/Header"


const ResponsiveTest = ({ context }) => {

  return (
    <>
      <ResponsivePage
        header={<h1>Header</h1>}
        drawer={<h3>Sidebar</h3> }
      >
        {[...Array(19).keys()].map((n) => {
          return <h1>Hello I'm a div</h1>
        })}
      </ResponsivePage>
    </>
  )
}
export default ResponsiveTest
