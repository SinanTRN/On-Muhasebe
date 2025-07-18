import type { ComponentProps } from 'react'
import React from 'react'

import TextField from '@mui/material/TextField'

interface CustomInputProps extends ComponentProps<typeof TextField> {
  label: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ label, ...props }, ref) => {
  return <TextField {...props} inputRef={ref} label={label} fullWidth />
})

CustomInput.displayName = 'CustomInput'

export default CustomInput
