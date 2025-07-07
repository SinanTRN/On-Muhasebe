'use client'

import React, { useState, useRef } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Autocomplete,
  useTheme,
  Checkbox,
  Menu
} from '@mui/material'
import { Icon } from '@iconify/react'

const unitOptions = ['Adet', 'Kilogram', 'Litre', 'Metre']
const vatOptions = ['1', '8', '10', '18', '20']

type InvoiceRow = {
  stockCode: string
  stockName: string
  quantity: string
  unit: string
  unitPrice: string
  vatRate: string
  vatAmount: string
  total: string
  dovizAmount: string
  description: string
  discount: string
  note: string
}

const defaultRow: InvoiceRow = {
  stockCode: '',
  stockName: '',
  quantity: '1',
  unit: 'Adet',
  unitPrice: '',
  vatRate: '20',
  vatAmount: '',
  total: '',
  dovizAmount: '',
  description: '',
  discount: '',
  note: ''
}

// Numeric inputlarda spin button ve clear ikonunu gizlemek için stil
// const numberInputStyle = {
//   '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
//   '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
//   '& input[type=number]': { MozAppearance: 'textfield' },
//   '& .MuiInputBase-root input[type=number]::-ms-clear': { display: 'none' },
//   '& .MuiInputBase-root input[type=number]::-ms-reveal': { display: 'none' }
// }

const InvoiceItemsTable = ({
  includesVAT,
  currency,
  exchangeRate
}: {
  includesVAT: boolean
  currency: string
  exchangeRate: string
}) => {
  const [rows, setRows] = useState<InvoiceRow[]>([{ ...defaultRow }])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [extraColumns, setExtraColumns] = useState<string[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [manualFields, setManualFields] = useState<{
    [key: number]: { unitPrice?: boolean; vatAmount?: boolean; total?: boolean }
  }>({})

  const allOptionalColumns = [
    { key: 'description', label: 'Açıklama' },
    { key: 'discount', label: 'İskonto' },
    { key: 'note', label: 'Not' }
  ]

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const toggleColumn = (key: string) => {
    setExtraColumns(prev => (prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]))
  }

  const parseTurkishNumber = (val: string): number => {
    if (!val) return 0

    return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
  }

  const formatTurkishNumber = (val: string | number): string => {
    const num = typeof val === 'string' ? parseTurkishNumber(val) : val

    if (isNaN(num)) return ''

    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleChange = (idx: number, field: string, value: any) => {
    if (['unitPrice', 'vatAmount', 'total'].includes(field)) {
      setManualFields(prev => ({
        ...prev,
        [idx]: { ...prev[idx], [field]: true }
      }))
    }

    const updated = rows.map((row, i) => {
      if (i !== idx) return row

      const updatedRow = { ...row, [field]: value }

      const quantity = parseTurkishNumber(updatedRow.quantity)
      const vatRate = parseTurkishNumber(updatedRow.vatRate)
      let unitPrice = parseTurkishNumber(updatedRow.unitPrice)
      const dovizAmount = parseTurkishNumber(updatedRow.dovizAmount)
      const exchange = parseTurkishNumber(exchangeRate)

      if (currency !== 'TRY' && dovizAmount && exchange) {
        unitPrice = dovizAmount * exchange
        updatedRow.unitPrice = unitPrice.toFixed(2).toString()
      }

      let vatAmount = 0
      let total = 0

      if (!manualFields[idx]?.vatAmount) {
        if (includesVAT) {
          const priceExclVAT = unitPrice / (1 + vatRate / 100)

          vatAmount = (unitPrice - priceExclVAT) * quantity
        } else {
          vatAmount = ((unitPrice * vatRate) / 100) * quantity
        }

        //updatedRow.vatAmount = vatAmount.toFixed(2)
        updatedRow.vatAmount = formatTurkishNumber(vatAmount)
      } else {
        vatAmount = parseTurkishNumber(updatedRow.vatAmount)
      }

      if (!manualFields[idx]?.total) {
        if (includesVAT) {
          total = unitPrice * quantity
        } else {
          total = unitPrice * quantity + vatAmount
        }

        //updatedRow.total = total.toFixed(2)
        updatedRow.total = formatTurkishNumber(total)
      }

      return updatedRow
    })

    setRows(updated)
  }

  const handleAddRow = () => {
    setRows(prev => [...prev, { ...defaultRow }])
    setTimeout(() => {
      const idx = rows.length

      inputRefs.current[idx]?.focus()
    }, 0)
  }

  const handleRemoveRow = (idx: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== idx))
  }

  const theme = useTheme()
  const [focusedIndex, setFocusedIndex] = useState<{ idx: number; field: string } | null>(null)

  return (
    <div className='p-4  rounded-md shadow-md' style={{ background: theme.palette.background.paper }}>
      <Paper
        className='relative flex flex-col gap-2 w-full overflow-x-auto m-b-2 rounded-md'
        sx={{
          width: '100%',
          overflowX: 'auto',
          mb: 2,
          background: theme => theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 'none',
          pt: 0,
          pb: 2
        }}
      >
        <IconButton onClick={handleMenuOpen} className='absolute top-2 left-2 z-10' size='small'>
          <Icon icon='mdi:dots-vertical' width={20} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {allOptionalColumns.map(col => (
            <MenuItem key={col.key} onClick={() => toggleColumn(col.key)}>
              <Checkbox checked={extraColumns.includes(col.key)} />
              {col.label}
            </MenuItem>
          ))}
        </Menu>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table className='flex-1 '>
            <TableHead>
              <TableRow>
                <TableCell className='p-4 text-center align-center justify-center min-w-[80px]'></TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px] '>Stok Kodu</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[300px] '>Stok Adı</TableCell>
                <TableCell className='p-4 text-right align-center justify-end min-w-[120px]  '>Miktar</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px] '>Birim</TableCell>
                {currency !== 'TRY' && (
                  <TableCell className='p-4 text-center align-center justify-center min-w-[150px] '>
                    Döviz Tutarı
                  </TableCell>
                )}
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px] '>
                  Birim Fiyat
                </TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px] '>KDV %</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px]'>KDV Tutarı</TableCell>
                {extraColumns.includes('description') && (
                  <TableCell className='p-4 text-center min-w-[200px]'>Açıklama</TableCell>
                )}
                {extraColumns.includes('discount') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto (%)</TableCell>
                )}
                {extraColumns.includes('note') && <TableCell className='p-4 text-center min-w-[200px]'>Not</TableCell>}

                <TableCell className='p-4 text-center align-center justify-center min-w-[150px]'>
                  Toplam Fiyat
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  {/* Butonlar */}
                  <TableCell className='p-4 text-center align-middle min-w-[80px]'>
                    <div className='flex items-center justify-center gap-2'>
                      {/* Sil Butonu */}
                      <IconButton onClick={() => handleRemoveRow(idx)} size='small' disabled={rows.length === 1}>
                        <Icon icon='ri:delete-bin-6-line' color='#f44336' width={18} />
                      </IconButton>

                      {/* Sadece son satırda gösterilecek Ekle Butonu */}
                      {idx === rows.length - 1 && (
                        <IconButton onClick={handleAddRow} size='small'>
                          <Icon icon='ri:add-fill' color={theme.palette.success.main} width={18} />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>

                  {/* Stok Kodu */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                    <div className='w-full flex items-center gap-1'>
                      <TextField
                        inputRef={el => (inputRefs.current[idx] = el)}
                        value={row.stockCode}
                        onChange={e => handleChange(idx, 'stockCode', e.target.value)}
                        size='small'
                        variant='outlined'
                        inputProps={{ maxLength: 100 }}
                        placeholder='Stok Kodu'
                      />
                    </div>
                  </TableCell>

                  {/* Stok Adı */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[300px] '>
                    <Tooltip title={row.stockName} placement='top' arrow disableInteractive>
                      <TextField
                        value={row.stockName}
                        onChange={e => handleChange(idx, 'stockName', e.target.value)}
                        size='small'
                        variant='outlined'
                        inputProps={{ maxLength: 100 }}
                        className='w-full'
                        placeholder='Stok Adı'
                      />
                    </Tooltip>
                  </TableCell>

                  {/* Miktar */}
                  <TableCell className='p-2 text-right align-middle justify-end min-w-[120px] '>
                    <TextField
                      type='number'
                      value={row.quantity}
                      onChange={e => handleChange(idx, 'quantity', e.target.value)}
                      size='small'
                      variant='outlined'
                      inputProps={{ min: 0, style: { textAlign: 'right' } }}
                      className='w-full text-right'
                      placeholder='Miktar'
                    />
                  </TableCell>

                  {/* Birim */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px] '>
                    <Select
                      value={row.unit}
                      onChange={e => handleChange(idx, 'unit', e.target.value as string)}
                      size='small'
                      className='w-full'
                    >
                      {unitOptions.map(opt => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* Döviz Tutarı */}
                  {currency !== 'TRY' && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[150px] '>
                      <TextField
                        type='number'
                        value={row.dovizAmount}
                        onChange={e => handleChange(idx, 'dovizAmount', e.target.value)}
                        size='small'
                        variant='outlined'
                        inputProps={{ min: 0, step: 'any' }}
                        className='w-full'
                        placeholder='Döviz Tutarı'
                      />
                    </TableCell>
                  )}

                  {/* Birim Fiyat */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                    <TextField
                      type='text'
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'unitPrice'
                          ? row.unitPrice
                          : row.unitPrice
                      }
                      onFocus={() => setFocusedIndex({ idx, field: 'unitPrice' })}
                      onBlur={e => {
                        setFocusedIndex(null)
                        handleChange(idx, 'unitPrice', e.target.value)
                      }}
                      onChange={e => {
                        const inputVal = e.target.value
                        const sanitized = inputVal.replace(/[^0-9.,]/g, '')

                        setRows(prev => prev.map((row, i) => (i === idx ? { ...row, unitPrice: sanitized } : row)))
                      }}
                      size='small'
                      variant='outlined'
                      className='w-full'
                      inputProps={{ style: { textAlign: 'right' } }}
                      placeholder='Birim Fiyat'
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>₺</InputAdornment>,
                        readOnly: currency !== 'TRY'
                      }}
                    />
                  </TableCell>

                  {/* KDV % */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                    <Select
                      value={row.vatRate}
                      onChange={e => handleChange(idx, 'vatRate', e.target.value as string)}
                      size='small'
                      className='w-full text-center'
                      inputProps={{ style: { textAlign: 'center' } }}
                    >
                      {vatOptions.map(opt => (
                        <MenuItem key={opt} value={opt} className='text-center'>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* KDV Tutarı */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                    <TextField
                      type='text'
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'vatAmount'
                          ? row.vatAmount
                          : row.vatAmount
                      }
                      onFocus={() => setFocusedIndex({ idx, field: 'vatAmount' })}
                      onBlur={e => {
                        setFocusedIndex(null)
                        handleChange(idx, 'vatAmount', e.target.value)
                      }}
                      onChange={e => {
                        const inputVal = e.target.value
                        const sanitized = inputVal.replace(/[^0-9.,]/g, '')

                        handleChange(idx, 'vatAmount', sanitized)
                      }}
                      size='small'
                      variant='outlined'
                      className='w-full'
                      inputProps={{ style: { textAlign: 'right' } }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>₺</InputAdornment>
                      }}
                      placeholder='KDV Tutarı'
                    />
                  </TableCell>
                  {extraColumns.includes('description') && (
                    <TableCell className='p-2'>
                      <TextField
                        value={row.description || ''}
                        onChange={e => handleChange(idx, 'description', e.target.value)}
                        size='small'
                        className='w-full'
                        placeholder='Açıklama'
                      />
                    </TableCell>
                  )}

                  {extraColumns.includes('discount') && (
                    <TableCell className='p-2'>
                      <TextField
                        type='number'
                        value={row.discount || ''}
                        onChange={e => handleChange(idx, 'discount', e.target.value)}
                        size='small'
                        className='w-full'
                        placeholder='İskonto'
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </TableCell>
                  )}

                  {extraColumns.includes('note') && (
                    <TableCell className='p-2'>
                      <TextField
                        value={row.note || ''}
                        onChange={e => handleChange(idx, 'note', e.target.value)}
                        size='small'
                        className='w-full'
                        placeholder='Not'
                      />
                    </TableCell>
                  )}

                  {/* Toplam Fiyat */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                    <TextField
                      type='text'
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'total'
                          ? row.total
                          : row.total
                      }
                      onFocus={() => setFocusedIndex({ idx, field: 'total' })}
                      onBlur={e => {
                        setFocusedIndex(null)
                        handleChange(idx, 'total', e.target.value)
                      }}
                      onChange={e => {
                        const inputVal = e.target.value
                        const sanitized = inputVal.replace(/[^0-9.,]/g, '')

                        handleChange(idx, 'total', sanitized)
                      }}
                      size='small'
                      variant='outlined'
                      className='w-full'
                      inputProps={{ style: { textAlign: 'right' } }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>₺</InputAdornment>
                      }}
                      placeholder='Toplam Fiyat'
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}

export default InvoiceItemsTable
