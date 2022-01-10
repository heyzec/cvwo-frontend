import ResponsivePage from 'components/ResponsivePage'

import TextField from 'material/TextField'
import Tooltip from 'material/Tooltip'
import Button from 'material/Button'
import { HiPencil } from 'react-icons/hi'
import IconButton from 'material/IconButton'


const Sandbox = ({ context }) => {

  return (
    <>
      <ResponsivePage
        header={<h1>Header</h1>}
        drawer={<h3>Sidebar</h3>}
      >
        <h1>Hello</h1>
        <hr />
        <br />
        <TextField />
        <div style={{ display: "flex", "justify-content": "center" }}>
          <Tooltip text="Hello!">
            <Button startIcon={<HiPencil />}>Hi</Button>
          </Tooltip>
          <Button startIcon={<HiPencil />}>
            <HiPencil />
          </Button>
          <IconButton />
        </div>
      </ResponsivePage>
    </>
  )
}
export default Sandbox
