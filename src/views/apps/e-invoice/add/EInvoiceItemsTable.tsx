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
  MenuItem,
  InputAdornment,
  Tooltip,
  useTheme,
  Checkbox,
  Menu,
  useMediaQuery
} from '@mui/material'
import { Icon } from '@iconify/react'

import { kdvTevkifatOrnekleri } from '../shared/kdvWithholdingExamples'
import CustomSelectCell from '../shared/CustomSelectCell'

const unitOptions = ['Adet', 'Kilogram', 'Litre', 'Metre']
const vatOptions = ['0', '1', '8', '10', '18', '20']

const unitOptionsForSelect = unitOptions.map(opt => ({ value: opt, label: opt }))
const vatOptionsForSelect = vatOptions.map(opt => ({ value: opt, label: opt }))

const tevkifatOptions = [
  { value: 'Tevkifat Yok', label: 'Tevkifat Yok' },
  ...kdvTevkifatOrnekleri.map(opt => ({
    value: opt.kod.toString(),
    label: (
      <span className='flex flex-row items-right gap-2'>
        <span className='inline-block min-w-[25px] font-variant-numeric tabular-nums'>{opt.kod}</span> -{' '}
        <span className='inline-block min-w-[25px] font-variant-numeric tabular-nums'>{opt.oran / 10}/10</span>
        <span className='flex-1'>{opt.hizmet}</span>
      </span>
    )
  }))
]

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
  tevkifatType?: string
}
type ManualFieldKey = 'unitPrice' | 'vatAmount' | 'total'

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
  note: '',
  tevkifatType: ''
}

// Para birimi sembolünü döndüren fonksiyon
const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'GBP':
      return '£'
    case 'TRY':
      return '₺'
    default:
      return currency
  }
}

interface InvoiceItemsTableProps {
  includesVAT: boolean
  currency: string
  currentInvoiceType: string
  isWithholdingTax: boolean
  bulkWithholdingType?: string
}

const InvoiceItemsTable = ({
  includesVAT,
  currency,
  currentInvoiceType,
  isWithholdingTax,
  bulkWithholdingType = ''
}: InvoiceItemsTableProps) => {
  //State'ler
  const [rows, setRows] = useState<InvoiceRow[]>([{ ...defaultRow }])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [extraColumns, setExtraColumns] = useState<string[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [focusedIndex, setFocusedIndex] = useState<{ idx: number; field: string } | null>(null)

  const cellRefs = useRef<{ [rowIndex: number]: { [field: string]: HTMLElement | null } }>({})

  const theme = useTheme()
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // Cell referanslarını kaydeden fonksiyon
  const registerRef = (rowIndex: number, field: string, element: HTMLElement | null) => {
    if (!cellRefs.current[rowIndex]) cellRefs.current[rowIndex] = {}
    cellRefs.current[rowIndex][field] = element
  }

  // Klavye ile alanlar arasında geçiş yaparken Enter tuşuna basıldığında sonraki alana odaklanma
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      // Select bileşeni içinde miyiz kontrolü
      const isInSelect = (e.target as HTMLElement).closest('.MuiSelect-select')

      if (isInSelect) {
        return // Select bileşenindeki Enter işlemini CustomSelectCell halletsin
      }

      // Diğer alanlar için geçiş mantığı
      const fieldOrder: string[] = [
        'stockCode',
        'stockName',
        ...(extraColumns.includes('description') ? ['description'] : []),
        'quantity',
        'unit',
        'unitPrice',
        'vatRate',
        'vatAmount',
        ...(currentInvoiceType === 'TEVKIFAT' && !isWithholdingTax ? ['tevkifatType'] : []),
        ...(extraColumns.includes('discount') ? ['discount'] : []),
        ...(extraColumns.includes('note') ? ['note'] : []),
        'total'
      ]

      const currentIndex = fieldOrder.indexOf(field)
      const nextField = fieldOrder[currentIndex + 1]

      if (nextField) {
        const nextInput = cellRefs.current?.[rowIndex]?.[nextField]

        nextInput?.focus()
      }
    }
  }

  // Manuel alanların durumunu tutan state
  const [manualFields, setManualFields] = useState<{
    [key: number]: { unitPrice?: boolean; vatAmount?: boolean; total?: boolean }
  }>({})

  // Ekstra sütunların anahtarlarını ve etiketlerini tanımlıyoruz
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

  // Ekstra sütunları açıp kapatan fonksiyon
  const toggleColumn = (key: string) => {
    setExtraColumns(prev => (prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]))
  }

  // Türkçe formatta sayıları ayrıştırma ve formatlama
  const parseTurkishNumber = (val: string): number => {
    if (!val) return 0

    if (val.includes(',') && val.includes('.')) {
      if (val.lastIndexOf(',') > val.lastIndexOf('.')) {
        return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
      } else {
        return parseFloat(val.replace(/,/g, '')) || 0
      }
    }

    if (val.includes(',')) {
      return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
    }

    if (val.includes('.')) {
      return parseFloat(val.replace(/\./g, '')) || 0
    }

    return parseFloat(val) || 0
  }

  // Türkçe formatta sayıları biçimlendirme
  const formatTurkishNumber = (val: string | number): string => {
    const num = typeof val === 'string' ? parseTurkishNumber(val) : val

    if (isNaN(num)) return ''

    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Satırdaki değişiklikleri işleyen fonksiyon
  const handleChange = (idx: number, field: string, value: any) => {
    if (['unitPrice', 'total'].includes(field)) {
      const fieldKey = field as ManualFieldKey

      setManualFields(prev => ({
        ...prev,
        [idx]: { ...prev[idx], [fieldKey]: true }
      }))
    }

    const updated = rows.map((row, i) => {
      if (i !== idx) return row

      const updatedRow = { ...row, [field]: value }

      if (field === 'quantity') {
        updatedRow.quantity = value.replace(/[^0-9.,]/g, '')
      }

      const quantity = parseTurkishNumber(updatedRow.quantity)
      const vatRate = parseTurkishNumber(updatedRow.vatRate)
      let unitPrice = parseTurkishNumber(updatedRow.unitPrice)

      let vatAmount = 0
      let total = 0

      const manual = manualFields[idx] || {}

      if (!manual.vatAmount) {
        if (includesVAT) {
          const priceExclVAT = unitPrice / (1 + vatRate / 100)

          vatAmount = (unitPrice - priceExclVAT) * quantity
        } else {
          vatAmount = ((unitPrice * vatRate) / 100) * quantity
        }

        updatedRow.vatAmount = formatTurkishNumber(vatAmount)
      } else {
        vatAmount = parseTurkishNumber(updatedRow.vatAmount)
        manual.vatAmount = !manual.vatAmount
      }

      if (!manual.total) {
        total = unitPrice * quantity
        updatedRow.total = formatTurkishNumber(total)
      } else {
        total = parseTurkishNumber(updatedRow.total)
        unitPrice = quantity !== 0 ? total / quantity : 0
        updatedRow.unitPrice = formatTurkishNumber(unitPrice)
        manual.total = !manual.total
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
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table className='flex-1 '>
            <TableHead>
              <TableRow>
                <TableCell className='p-4 text-center align-center justify-center min-w-[10px]'>#</TableCell>
                {/* Menü */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[80px]'>
                  <IconButton onClick={handleMenuOpen} size='small'>
                    <Icon icon='mdi:dots-vertical' width={20} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {allOptionalColumns.map(col => (
                      <MenuItem disableRipple key={col.key} onClick={() => toggleColumn(col.key)}>
                        <Checkbox checked={extraColumns.includes(col.key)} />
                        {col.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
                <TableCell className='p-4 text-left align-center justify-center min-w-[120px] '>Stok Kodu</TableCell>
                <TableCell className='p-4 text-left align-center justify-center min-w-[300px] '>Stok Adı</TableCell>
                {extraColumns.includes('description') && (
                  <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>Açıklama</TableCell>
                )}
                <TableCell className='p-4 text-right align-center justify-end min-w-[120px]  '>Miktar</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px] '>Birim</TableCell>
                <TableCell className='p-4 text-right align-center justify-center min-w-[150px] '>Birim Fiyat</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px] '>KDV %</TableCell>
                <TableCell className='p-4 text-right align-center justify-center min-w-[150px]'>KDV Tutarı</TableCell>
                {currentInvoiceType === 'TEVKIFAT' && !isWithholdingTax && (
                  <TableCell className='p-4 text-center align-center justify-center min-w-[180px]'>Tevkifat</TableCell>
                )}
                {extraColumns.includes('discount') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto (%)</TableCell>
                )}
                {extraColumns.includes('note') && <TableCell className='p-4 text-center min-w-[200px]'>Not</TableCell>}

                <TableCell className='p-4 text-right align-center justify-center min-w-[150px]'>Toplam Fiyat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  {/* Satır Numarası */}
                  <TableCell className='p-4 text-center align-middle min-w-[10px] font-medium'>{idx + 1}</TableCell>
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
                        inputRef={el => registerRef(idx, 'stockCode', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'stockCode')}
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
                        inputRef={el => registerRef(idx, 'stockName', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'stockName')}
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
                  {/* Açıklama */}
                  {extraColumns.includes('description') && (
                    <TableCell className='p-2'>
                      <TextField
                        inputRef={el => registerRef(idx, 'description', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'description')}
                        value={row.description || ''}
                        onChange={e => handleChange(idx, 'description', e.target.value)}
                        size='small'
                        className='w-full'
                        placeholder='Açıklama'
                      />
                    </TableCell>
                  )}
                  {/* Miktar */}
                  <TableCell className='p-2 text-right align-middle justify-end min-w-[120px] '>
                    <TextField
                      type='text'
                      inputRef={el => registerRef(idx, 'quantity', el)}
                      onKeyDown={e => handleKeyDown(e, idx, 'quantity')}
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'quantity'
                          ? row.quantity
                          : formatTurkishNumber(row.quantity)
                      }
                      onFocus={() => setFocusedIndex({ idx, field: 'quantity' })}
                      onBlur={e => {
                        setFocusedIndex(null)
                        handleChange(idx, 'quantity', e.target.value)
                      }}
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
                    <CustomSelectCell
                      value={row.unit}
                      options={unitOptionsForSelect}
                      onChange={(value: string) => handleChange(idx, 'unit', value)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, idx, 'unit')}
                      inputRef={(el: HTMLInputElement | null) => registerRef(idx, 'unit', el)}
                    />
                  </TableCell>
                  {/* Birim Fiyat */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                    <TextField
                      type='text'
                      inputRef={el => registerRef(idx, 'unitPrice', el)}
                      onKeyDown={e => handleKeyDown(e, idx, 'unitPrice')}
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'unitPrice'
                          ? row.unitPrice
                          : formatTurkishNumber(row.unitPrice)
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
                        endAdornment: <InputAdornment position='end'>{getCurrencySymbol(currency)}</InputAdornment>,
                        readOnly: false
                      }}
                    />
                  </TableCell>
                  {/* KDV % */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                    <CustomSelectCell
                      value={row.vatRate}
                      options={vatOptionsForSelect}
                      onChange={(val: string) => handleChange(idx, 'vatRate', val)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, idx, 'vatRate')}
                      inputRef={(el: HTMLInputElement | null) => registerRef(idx, 'vatRate', el)}
                      align='center'
                    />
                  </TableCell>
                  {/* KDV Tutarı */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                    <TextField
                      type='text'
                      inputRef={el => registerRef(idx, 'vatAmount', el)}
                      onKeyDown={e => handleKeyDown(e, idx, 'vatAmount')}
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'vatAmount'
                          ? row.vatAmount
                          : formatTurkishNumber(row.vatAmount)
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
                      inputProps={{ style: { textAlign: 'right' }, 'aria-readonly': true }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>{getCurrencySymbol(currency)}</InputAdornment>
                      }}
                      placeholder='KDV Tutarı'
                    />
                  </TableCell>
                  {/* Tevkifat Türü */}
                  {currentInvoiceType === 'TEVKIFAT' && !isWithholdingTax && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[180px]'>
                      <CustomSelectCell
                        value={row.tevkifatType || 'Tevkifat Yok'}
                        options={tevkifatOptions}
                        renderValue={selected =>
                          typeof selected === 'string'
                            ? (() => {
                                const option = kdvTevkifatOrnekleri.find(o => o.kod.toString() === selected)

                                return option ? `${option.kod}-(${option.oran / 10}/10)` : selected
                              })()
                            : 'Tevkifat Yok'
                        }
                        onChange={val => handleChange(idx, 'tevkifatType', val)}
                        onKeyDown={e => handleKeyDown(e, idx, 'tevkifatType')}
                        inputRef={el => registerRef(idx, 'tevkifatType', el)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: isMobile ? 300 : 400,
                              maxWidth: isMobile ? 250 : 400,
                              overflow: 'auto'
                            }
                          },
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center'
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'center'
                          }
                        }}
                        placeholder='Tevkifat Yok'
                        align='center'
                      />
                    </TableCell>
                  )}
                  {/* İskonto */}
                  {extraColumns.includes('discount') && (
                    <TableCell className='p-2'>
                      <TextField
                        type='number'
                        inputRef={el => registerRef(idx, 'discount', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'discount')}
                        value={row.discount || ''}
                        onChange={e => handleChange(idx, 'discount', e.target.value)}
                        size='small'
                        className='w-full'
                        placeholder='İskonto'
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </TableCell>
                  )}
                  {/* Not */}
                  {extraColumns.includes('note') && (
                    <TableCell className='p-2'>
                      <TextField
                        value={row.note || ''}
                        inputRef={el => registerRef(idx, 'note', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'note')}
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
                      inputRef={el => registerRef(idx, 'total', el)}
                      onKeyDown={e => handleKeyDown(e, idx, 'total')}
                      value={
                        focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'total'
                          ? row.total
                          : formatTurkishNumber(row.total)
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
                        endAdornment: <InputAdornment position='end'>{getCurrencySymbol(currency)}</InputAdornment>
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
      {/* Özet Bilgiler Alanı */}
      <div className='flex flex-col items-end mt-4'>
        <div className='w-full max-w-md'>
          <Paper
            className='p-4 '
            sx={{ background: theme.palette.background.paper, borderRadius: 2, boxShadow: 'none' }}
          >
            {/* Hesaplamalar */}
            {(() => {
              // Mal/Hizmet Toplam Tutarı
              const totalAmount = rows.reduce((sum, row) => sum + parseTurkishNumber(row.total), 0)

              // Hesaplanan KDV
              const totalVAT = rows.reduce((sum, row) => sum + parseTurkishNumber(row.vatAmount), 0)

              // Vergiler Dahil Toplam Tutar
              const totalWithTaxes = includesVAT ? totalAmount : totalAmount + totalVAT

              // Hesaplanan Tevkifat hesaplama fonksiyonu
              let calculatedWithholding = 0
              let withholdingRate = 0
              const isBulkWithholding = isWithholdingTax // toplu tevkifat seçili mi?

              if (currentInvoiceType === 'TEVKIFAT') {
                if (isBulkWithholding) {
                  // Toplu tevkifat oranı: bulkWithholdingType prop'undan alınır
                  const bulkKdvOranObj = kdvTevkifatOrnekleri.find(o => o.kod.toString() === bulkWithholdingType)

                  withholdingRate = bulkKdvOranObj ? bulkKdvOranObj.oran / 10 : 0
                  calculatedWithholding = (totalVAT * withholdingRate) / 10
                } else {
                  // Her satır için ayrı ayrı hesapla
                  calculatedWithholding = rows.reduce((sum, row) => {
                    if (row.tevkifatType && row.tevkifatType !== 'Tevkifat Yok') {
                      const kdvOranObj = kdvTevkifatOrnekleri.find(o => o.kod.toString() === row.tevkifatType)
                      const oran = kdvOranObj ? kdvOranObj.oran / 10 : 0

                      return sum + (parseTurkishNumber(row.vatAmount) * oran) / 10
                    }

                    return sum
                  }, 0)
                }
              }

              // Ödenecek Tutar güncelle
              const payableAmountWithWithholding =
                currentInvoiceType === 'TEVKIFAT' ? totalWithTaxes - calculatedWithholding : totalWithTaxes

              // Temadan uygun renkler
              const valueBg = theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100]
              const valueBorder = theme.palette.divider

              // Kutular için ortak stil
              const valueBoxStyle = {
                display: 'flex',
                flexDirection: 'row' as const,
                alignItems: 'center',
                justifyContent: 'flex-end',
                minWidth: 140,
                width: '100%',
                background: valueBg,
                borderRadius: 8,
                padding: '6px 16px',
                fontWeight: 400,
                fontSize: '1rem',
                textAlign: 'right' as const,
                border: `1px solid ${valueBorder}`,
                boxSizing: 'border-box' as const,
                transition: 'width 0.2s'
              }

              const valueBoxBoldStyle = {
                ...valueBoxStyle,
                fontWeight: 700
              }

              return (
                <table className='w-full text-right'>
                  <colgroup>
                    <col style={{ width: '60%' }} />
                    <col style={{ width: '40%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className='py-1 pr-2 font-medium'>Mal/Hizmet Toplam Tutarı:</td>
                      <td>
                        <span style={valueBoxStyle}>
                          <span>{formatTurkishNumber(totalAmount)}</span>
                          <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className='py-1 pr-2 font-medium'>Net Tutar (Matrah):</td>
                      <td>
                        <span style={valueBoxStyle}>
                          <span>{formatTurkishNumber(totalAmount)}</span>
                          <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className='py-1 pr-2 font-medium'>Hesaplanan KDV:</td>
                      <td>
                        <span style={valueBoxStyle}>
                          <span>{formatTurkishNumber(totalVAT)}</span>
                          <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                        </span>
                      </td>
                    </tr>
                    {/* Hesaplanan Tevkifat Alanı */}
                    {currentInvoiceType === 'TEVKIFAT' && (
                      <tr>
                        <td className='py-1 pr-2 font-medium'>Hesaplanan Tevkifat:</td>
                        <td>
                          <span style={valueBoxStyle}>
                            <span>{formatTurkishNumber(calculatedWithholding)}</span>
                            <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className='py-1 pr-2 font-medium'>Vergiler Dahil Toplam Tutar:</td>
                      <td>
                        <span style={valueBoxStyle}>
                          <span>{formatTurkishNumber(totalWithTaxes)}</span>
                          <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className='py-1 pr-2 font-medium'>Ödenecek Tutar:</td>
                      <td>
                        <span style={valueBoxBoldStyle}>
                          <span>{formatTurkishNumber(payableAmountWithWithholding)}</span>
                          <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
            })()}
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default InvoiceItemsTable
