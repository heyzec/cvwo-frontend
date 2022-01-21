import { useState } from 'react';
import ResponsivePage from 'modules/ResponsivePage'

import { HiPencil } from 'react-icons/hi'
import IconButton from 'material/IconButton'
import SelectableList from 'material/SelectableList'
import SelectableListItem from 'material/SelectableListItem'
import TextField from 'material/TextField'
import Tooltip from 'material/Tooltip'
import Button from 'material/Button'
import Paper from 'material/Paper'

import { MuiDatePicker, MuiTimePicker } from 'components/MuiPickers'
import 'pages/Sandbox.css'

const Box = ({ children }) => {
  return (
    <div className="sandbox__box">
      {children}
    </div>
  )
}

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
        <Box>
          <Tooltip text="Hello!" delay="500">
            <Button startIcon={<HiPencil />} color="green">Hi</Button>
          </Tooltip>
          <Button startIcon={<HiPencil />}>
            <HiPencil />
          </Button>
          <IconButton>
            <HiPencil />
          </IconButton>
        </Box>
        <Box>
          <Button variant="text" startIcon={<HiPencil />}>Hi</Button>
          <Button variant="outlined" startIcon={<HiPencil />}>Hi</Button>
          <Button variant="contained" startIcon={<HiPencil />}>Hi</Button>
        </Box>
        <Box>
          <SelectableList>
            <SelectableListItem selected={true} text="Testing" />
            <SelectableListItem text="Testing2" />
          </SelectableList>
        </Box>
        <Box>
          <Paper elevation="1">Hello</Paper>
          <Paper elevation="2">Hello</Paper>
          <Paper elevation="3">Hello</Paper>
          <Paper elevation="4">Hello</Paper>
          <Paper elevation="5">Hello</Paper>
        </Box>
        <Box>
          <MuiDatePicker />
        </Box>
        <Box>
          <MuiTimePicker />
        </Box>
      </ResponsivePage>
    </>
  )
}
export default Sandbox
