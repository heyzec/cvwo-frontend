import { useState } from 'react'

import AdapterDayjs from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import TimePicker from '@mui/lab/TimePicker'

import TextField from 'material/TextField'
import 'components/MuiPickers.css'

export const MuiDatePicker = () => {
  const [value, setValue] = useState(new Date())

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <div className="picker__wrap">
            <div ref={inputRef}>
              <TextField label="Date" {...inputProps} />
            </div>
            {InputProps?.endAdornment}
          </div>
        )}
      />
    </LocalizationProvider>
  )
}

export const MuiTimePicker = () => {
  const [value, setValue] = useState(null)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        ampm={false}
        inputFormat="HH:mm"
        mask="__:__"
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => {
          return <div className="picker__wrap">
            <div ref={inputRef}>
              <TextField label="Time" {...inputProps} />
            </div>
            {InputProps?.endAdornment}
          </div>
        }}
      />
    </LocalizationProvider>
  )
}
