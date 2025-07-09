import React from 'react'

import { TextField, MenuItem } from '@mui/material'
import type { SelectProps } from '@mui/material/Select'

interface OptionType {
  value: string
  label: React.ReactNode
}

interface CustomSelectCellProps {
  value: string
  options: OptionType[]
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  inputRef?: (el: HTMLInputElement | null) => void
  placeholder?: string
  align?: 'left' | 'center' | 'right'
  MenuProps?: SelectProps['MenuProps']
  renderValue?: SelectProps['renderValue']
}

const CustomSelectCell: React.FC<CustomSelectCellProps> = ({
  value,
  options,
  onChange,
  onKeyDown,
  inputRef,
  placeholder,
  align = 'center',
  MenuProps,
  renderValue
}) => {
  return (
    <TextField
      select
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      size='small'
      fullWidth
      placeholder={placeholder}
      inputProps={{ style: { textAlign: align } }}
      SelectProps={{ MenuProps: MenuProps, renderValue: renderValue }}
    >
      {options.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CustomSelectCell
