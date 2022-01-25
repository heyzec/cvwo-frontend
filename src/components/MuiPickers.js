import AdapterDayjs from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import TimePicker from '@mui/lab/TimePicker'

import TextField from 'material/TextField'
import 'components/MuiPickers.css'

export const MuiDatePicker = ( { value, setValue }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        inputFormat="DD/MM/YYYY"
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <div className="picker__wrap">
            <div ref={inputRef}>
              <TextField label="Date" fixedLabel {...inputProps} />
            </div>
            {InputProps?.endAdornment}
          </div>
        )}
      />
    </LocalizationProvider>
  )
}

export const MuiTimePicker = ({ value, setValue }) => {
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
              <TextField label="Time" fixedLabel {...inputProps} />
            </div>
            {InputProps?.endAdornment}
          </div>
        }}
      />
    </LocalizationProvider>
  )
}
