'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

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
import { ozelMatrahOptions } from '../shared/SpecialTaskBaseExamples'
import { unitOptions } from '../shared/UnitExamples'

import { vatOptions } from '../shared/VatExamples'
import CustomSelectCell from '../shared/CustomSelectCell'

const unitOptionsForSelect = unitOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))
const vatOptionsForSelect = vatOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))

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
  receiverStockCode?: string
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
  ozelMatrahType?: string
  discount1?: string
  discount2?: string
  discount3?: string
  discount4?: string
  netAmount?: string
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
  tevkifatType: '',
  discount1: '',
  discount2: '',
  discount3: '',
  discount4: '',
  netAmount: ''
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
  exchangeRate?: string // Döviz kuru eklendi (string)
}

const InvoiceItemsTable = ({
  includesVAT,
  currency,
  currentInvoiceType,
  isWithholdingTax,
  bulkWithholdingType = '',
  exchangeRate = ''
}: InvoiceItemsTableProps) => {
  //State'ler
  const [rows, setRows] = useState<InvoiceRow[]>([{ ...defaultRow }])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [extraColumns, setExtraColumns] = useState<string[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [focusedIndex, setFocusedIndex] = useState<{ idx: number; field: string } | null>(null)
  const [showDiscountMenu, setShowDiscountMenu] = useState(false)
  const [activeDiscounts, setActiveDiscounts] = useState<string[]>([])
  const [documentNote, setDocumentNote] = useState('')

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
        ...(currentInvoiceType === 'OZELMATRAH' ? ['ozelMatrahType'] : []),
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
  const [manualFields, setManualFields] = useState<
    Record<number, { unitPrice?: boolean; vatAmount?: boolean; total?: boolean; netAmount?: boolean }>
  >({})

  // Ekstra sütunların anahtarlarını ve etiketlerini tanımlıyoruz
  const allOptionalColumns = [
    { key: 'description', label: 'Açıklama' },
    { key: 'receiverStockCode', label: 'Alıcı Stok Kodu' }
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

  // İskonto sütunlarını açıp kapatan fonksiyon
  const toggleDiscountColumn = (key: string) => {
    setActiveDiscounts(prev => (prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]))
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
  const formatTurkishNumber = useCallback((val: string | number): string => {
    const num = typeof val === 'string' ? parseTurkishNumber(val) : val

    if (isNaN(num)) return ''

    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }, [])

  // Satırdaki değişiklikleri işleyen fonksiyon
  const handleChange = (idx: number, field: string, value: any) => {
    // Satırın mevcut halini alın
    const currentRow = rows[idx]

    // İskonto dizisini bir kez tanımlayın, odaklanmışsa inputtaki değeri kullan
    const discountKeys = ['discount1', 'discount2', 'discount3', 'discount4']

    const discounts = discountKeys.map(key => {
      if (!activeDiscounts.includes(key)) return 0

      if (focusedIndex && focusedIndex.idx === idx && focusedIndex.field === key) {
        // Eğer bu alan odakta ise, inputtaki değeri kullan
        if (field === key) {
          return parseTurkishNumber(value)
        } else {
          return parseTurkishNumber(currentRow[key as keyof InvoiceRow] ?? '0')
        }
      } else {
        return parseTurkishNumber(currentRow[key as keyof InvoiceRow] ?? '0')
      }
    })

    if (field === 'netAmount') {
      setManualFields(prev => ({
        ...prev,
        [idx]: { ...prev[idx], netAmount: !!value }
      }))
      setRows(prevRows =>
        prevRows.map((row, i) => {
          if (i !== idx) return row
          const quantity = parseTurkishNumber(row.quantity)

          const discounts = discountKeys.map(key => {
            if (!activeDiscounts.includes(key)) return 0

            if (focusedIndex && focusedIndex.idx === idx && focusedIndex.field === key) {
              if (field === key) {
                return parseTurkishNumber(value)
              } else {
                return parseTurkishNumber(row[key as keyof InvoiceRow] ?? '0')
              }
            } else {
              return parseTurkishNumber(row[key as keyof InvoiceRow] ?? '0')
            }
          })

          let calculatedUnitPrice = quantity !== 0 ? parseTurkishNumber(value) : 0

          discounts.forEach(d => {
            if (d > 0) {
              calculatedUnitPrice = calculatedUnitPrice / (1 - d / 100)
            }
          })

          // KDV tutarını da güncelle
          const vatRate = parseTurkishNumber(row.vatRate)
          const newNetAmount = parseTurkishNumber(value)
          let newVatAmount = 0

          if (includesVAT) {
            const priceExclVAT = newNetAmount / (1 + vatRate / 100)

            newVatAmount = newNetAmount - priceExclVAT
          } else {
            newVatAmount = (newNetAmount * vatRate) / 100
          }

          return {
            ...row,
            netAmount: value,
            unitPrice: formatTurkishNumber(quantity !== 0 ? calculatedUnitPrice / quantity : 0),
            vatAmount: formatTurkishNumber(newVatAmount)
          }
        })
      )

      return
    }

    if (['unitPrice', 'total'].includes(field)) {
      const fieldKey = field as ManualFieldKey

      setManualFields(prev => ({
        ...prev,
        [idx]: { ...prev[idx], [fieldKey]: true }
      }))
    }

    // Eğer birim fiyat, miktar, iskonto veya KDV oranı değişiyorsa manualFields.netAmount'ı sıfırla
    const autoNetAmountFields = ['unitPrice', 'quantity', 'vatRate', 'discount1', 'discount2', 'discount3', 'discount4']

    if (autoNetAmountFields.includes(field)) {
      setManualFields(prev => ({
        ...prev,
        [idx]: { ...prev[idx], netAmount: false }
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

      // Eğer netAmount elle girilmediyse otomatik hesapla
      if (!manual.netAmount) {
        // Toplam iskonto oranını uygula
        const grossTotal = unitPrice * quantity
        let discountMultiplier = 1

        discounts.forEach(d => {
          if (d > 0) {
            discountMultiplier *= 1 - d / 100
          }
        })
        const calculatedNetAmount = grossTotal * discountMultiplier

        updatedRow.netAmount = formatTurkishNumber(calculatedNetAmount)
      } else if (field === 'netAmount') {
        // Elle girilen değeri göster
        updatedRow.netAmount = value
      }

      // KDV net tutar üzerinden hesaplanacak
      if (!manual.vatAmount) {
        // KDV, net tutar (iskontolu ve miktarlı) üzerinden hesaplanmalı
        const grossTotal = unitPrice * quantity
        let discountMultiplier = 1

        discounts.forEach(d => {
          if (d > 0) {
            discountMultiplier *= 1 - d / 100
          }
        })
        const calculatedNetAmount = grossTotal * discountMultiplier

        if (includesVAT) {
          const priceExclVAT = calculatedNetAmount / (1 + vatRate / 100)

          vatAmount = calculatedNetAmount - priceExclVAT
        } else {
          vatAmount = (calculatedNetAmount * vatRate) / 100
        }

        updatedRow.vatAmount = formatTurkishNumber(vatAmount)
      } else {
        vatAmount = parseTurkishNumber(updatedRow.vatAmount)
        manual.vatAmount = !manual.vatAmount
      }

      // Toplam fiyat yine unitPrice * quantity olarak kalsın
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

  // activeDiscounts değiştiğinde tüm satırları ve manualFields'ı güncelle
  useEffect(() => {
    setRows(prevRows =>
      prevRows.map(row => {
        const quantity = parseTurkishNumber(row.quantity)
        const unitPrice = parseTurkishNumber(row.unitPrice)
        const vatRate = parseTurkishNumber(row.vatRate)

        // Yeni aktif iskontoları uygula, odaklanmışsa inputtaki değeri kullan
        const discountKeys = ['discount1', 'discount2', 'discount3', 'discount4']

        const discounts = discountKeys.map(key => {
          if (!activeDiscounts.includes(key)) return 0

          return parseTurkishNumber(row[key as keyof InvoiceRow] ?? '0')
        })

        const grossTotal = unitPrice * quantity
        let discountMultiplier = 1

        discounts.forEach(d => {
          if (d > 0) {
            discountMultiplier *= 1 - d / 100
          }
        })
        const calculatedNetAmount = grossTotal * discountMultiplier
        let vatAmount = 0

        if (includesVAT) {
          const priceExclVAT = calculatedNetAmount / (1 + vatRate / 100)

          vatAmount = calculatedNetAmount - priceExclVAT
        } else {
          vatAmount = (calculatedNetAmount * vatRate) / 100
        }

        return {
          ...row,
          netAmount: formatTurkishNumber(calculatedNetAmount),
          vatAmount: formatTurkishNumber(vatAmount)
        }
      })
    )
    setManualFields(prev => {
      const updated: typeof prev = {}

      Object.keys(prev).forEach(idx => {
        updated[Number(idx)] = {
          ...prev[Number(idx)],
          netAmount: false,
          vatAmount: false
        }
      })

      return updated
    })
  }, [activeDiscounts, includesVAT, formatTurkishNumber])

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
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => {
                      setShowDiscountMenu(false)
                      handleMenuClose()
                    }}
                    PaperProps={{
                      style: {
                        maxHeight: 200,
                        maxWidth: isMobile ? 250 : 400,
                        overflow: 'auto'
                      }
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    {!showDiscountMenu
                      ? [
                          <MenuItem disableRipple key='discount-main' onClick={() => setShowDiscountMenu(true)}>
                            <Checkbox checked={activeDiscounts.length > 0} />
                            İskonto
                          </MenuItem>,
                          ...allOptionalColumns.map(col => (
                            <MenuItem disableRipple key={col.key} onClick={() => toggleColumn(col.key)}>
                              <Checkbox checked={extraColumns.includes(col.key)} />
                              {col.label}
                            </MenuItem>
                          ))
                        ]
                      : [
                          <MenuItem disableRipple key='back' onClick={() => setShowDiscountMenu(false)}>
                            <Icon icon='mdi:arrow-left' style={{ marginRight: 8 }} /> Geri
                          </MenuItem>,
                          ...['discount1', 'discount2', 'discount3', 'discount4'].map((key, i) => (
                            <MenuItem disableRipple key={key} onClick={() => toggleDiscountColumn(key)}>
                              <Checkbox checked={activeDiscounts.includes(key)} />
                              {`İskonto${i + 1}`}
                            </MenuItem>
                          ))
                        ]}
                  </Menu>
                </TableCell>
                <TableCell className='p-4 text-left align-center justify-center min-w-[180px] '>Stok Kodu</TableCell>
                {extraColumns.includes('receiverStockCode') && (
                  <TableCell className='p-4 text-left align-center justify-center min-w-[180px]'>
                    Alıcı Stok Kodu
                  </TableCell>
                )}
                <TableCell className='p-4 text-left align-center justify-center min-w-[300px] '>Stok Adı</TableCell>
                {extraColumns.includes('description') && (
                  <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>Açıklama</TableCell>
                )}
                <TableCell className='p-4 text-right align-center justify-end min-w-[120px]  '>Miktar</TableCell>
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px] '>Birim</TableCell>
                <TableCell className='p-4 text-right align-center justify-center min-w-[150px] '>Birim Fiyat</TableCell>
                {activeDiscounts.includes('discount1') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto1 %</TableCell>
                )}
                {activeDiscounts.includes('discount2') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto2 %</TableCell>
                )}
                {activeDiscounts.includes('discount3') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto3 %</TableCell>
                )}
                {activeDiscounts.includes('discount4') && (
                  <TableCell className='p-4 text-center min-w-[120px]'>İskonto4 %</TableCell>
                )}
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px] '>KDV %</TableCell>
                <TableCell className='p-4 text-right align-center justify-center min-w-[150px]'>KDV Tutarı</TableCell>
                {currentInvoiceType === 'TEVKIFAT' && !isWithholdingTax && (
                  <TableCell className='p-4 text-center align-center justify-center min-w-[180px]'>Tevkifat</TableCell>
                )}
                {currentInvoiceType === 'OZELMATRAH' && !isWithholdingTax && (
                  <TableCell className='p-4 text-center align-center justify-center min-w-[180px]'>
                    Özel Matrah
                  </TableCell>
                )}
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
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[180px]'>
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
                  {/* Alıcı Stok Kodu */}
                  {extraColumns.includes('receiverStockCode') && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[180px]'>
                      <TextField
                        inputRef={el => registerRef(idx, 'receiverStockCode', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'receiverStockCode')}
                        value={row.receiverStockCode || ''}
                        onChange={e => handleChange(idx, 'receiverStockCode', e.target.value)}
                        size='small'
                        variant='outlined'
                        inputProps={{ maxLength: 100 }}
                        placeholder='Alıcı Stok Kodu'
                      />
                    </TableCell>
                  )}
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
                      value={row.unit || 'Adet'}
                      renderValue={selected =>
                        typeof selected === 'string'
                          ? (() => {
                              const option = unitOptions.find(o => o.value.toString() === selected)

                              return option ? option.label : selected
                            })()
                          : 'Adet'
                      }
                      options={unitOptionsForSelect}
                      onChange={(value: string) => handleChange(idx, 'unit', value)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, idx, 'unit')}
                      inputRef={(el: HTMLInputElement | null) => registerRef(idx, 'unit', el)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
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
                  {/* İskonto1 */}
                  {activeDiscounts.includes('discount1') && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                      <TextField
                        type='text'
                        inputRef={el => registerRef(idx, 'discount1', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'discount1')}
                        value={
                          focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'discount1'
                            ? (row.discount1 ?? '')
                            : formatTurkishNumber(row.discount1 ?? '')
                        }
                        onFocus={() => setFocusedIndex({ idx, field: 'discount1' })}
                        onBlur={e => {
                          setFocusedIndex(null)
                          handleChange(idx, 'discount1', e.target.value)
                        }}
                        onChange={e => handleChange(idx, 'discount1', e.target.value)}
                        size='small'
                        variant='outlined'
                        className='w-full'
                        inputProps={{ min: 0, max: 100, style: { textAlign: 'center' } }}
                        placeholder='İskonto1 %'
                      />
                    </TableCell>
                  )}
                  {/* İskonto2 */}
                  {activeDiscounts.includes('discount2') && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                      <TextField
                        type='text'
                        inputRef={el => registerRef(idx, 'discount2', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'discount2')}
                        value={
                          focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'discount2'
                            ? (row.discount2 ?? '')
                            : formatTurkishNumber(row.discount2 ?? '')
                        }
                        onFocus={() => setFocusedIndex({ idx, field: 'discount2' })}
                        onBlur={e => {
                          setFocusedIndex(null)
                          handleChange(idx, 'discount2', e.target.value)
                        }}
                        onChange={e => handleChange(idx, 'discount2', e.target.value)}
                        size='small'
                        variant='outlined'
                        className='w-full'
                        inputProps={{ min: 0, max: 100, style: { textAlign: 'center' } }}
                        placeholder='İskonto2 %'
                      />
                    </TableCell>
                  )}
                  {/* İskonto3 */}
                  {activeDiscounts.includes('discount3') && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                      <TextField
                        type='text'
                        inputRef={el => registerRef(idx, 'discount3', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'discount3')}
                        value={
                          focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'discount3'
                            ? (row.discount3 ?? '')
                            : formatTurkishNumber(row.discount3 ?? '')
                        }
                        onFocus={() => setFocusedIndex({ idx, field: 'discount3' })}
                        onBlur={e => {
                          setFocusedIndex(null)
                          handleChange(idx, 'discount3', e.target.value)
                        }}
                        onChange={e => handleChange(idx, 'discount3', e.target.value)}
                        size='small'
                        variant='outlined'
                        className='w-full'
                        inputProps={{ min: 0, max: 100, style: { textAlign: 'center' } }}
                        placeholder='İskonto3 %'
                      />
                    </TableCell>
                  )}
                  {/* İskonto4 */}
                  {activeDiscounts.includes('discount4') && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                      <TextField
                        type='text'
                        inputRef={el => registerRef(idx, 'discount4', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'discount4')}
                        value={
                          focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'discount4'
                            ? (row.discount4 ?? '')
                            : formatTurkishNumber(row.discount4 ?? '')
                        }
                        onFocus={() => setFocusedIndex({ idx, field: 'discount4' })}
                        onBlur={e => {
                          setFocusedIndex(null)
                          handleChange(idx, 'discount4', e.target.value)
                        }}
                        onChange={e => handleChange(idx, 'discount4', e.target.value)}
                        size='small'
                        variant='outlined'
                        className='w-full'
                        inputProps={{ min: 0, max: 100, style: { textAlign: 'center' } }}
                        placeholder='İskonto4 %'
                      />
                    </TableCell>
                  )}
                  {/* KDV % */}
                  <TableCell className='p-2 text-center align-middle justify-center min-w-[120px]'>
                    <CustomSelectCell
                      value={row.vatRate}
                      renderValue={selected =>
                        typeof selected === 'string'
                          ? (() => {
                              const option = vatOptions.find(o => o.value.toString() === selected)

                              return option ? option.label : selected
                            })()
                          : 'KDV %'
                      }
                      options={vatOptionsForSelect}
                      onChange={(val: string) => handleChange(idx, 'vatRate', val)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, idx, 'vatRate')}
                      inputRef={(el: HTMLInputElement | null) => registerRef(idx, 'vatRate', el)}
                      align='center'
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
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
                              maxHeight: 150,
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
                  {/* Özel Matrah Türü */}
                  {currentInvoiceType === 'OZELMATRAH' && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[250px]'>
                      <CustomSelectCell
                        value={row.ozelMatrahType || 'Seçiniz'}
                        options={ozelMatrahOptions}
                        renderValue={selected => {
                          const option = ozelMatrahOptions.find(o => o.value === selected)

                          return option ? option.value : 'Seçiniz'
                        }}
                        onChange={val => handleChange(idx, 'ozelMatrahType', val)}
                        onKeyDown={e => handleKeyDown(e, idx, 'ozelMatrahType')}
                        inputRef={el => registerRef(idx, 'ozelMatrahType', el)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
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
                        placeholder='Seçiniz'
                        align='center'
                      />
                    </TableCell>
                  )}
                  {/* Toplam Fiyat */}
                  {activeDiscounts.length === 0 && (
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
                  )}
                  {/* Net Tutar */}
                  {activeDiscounts.length > 0 && (
                    <TableCell className='p-2 text-center align-middle justify-center min-w-[150px]'>
                      <TextField
                        type='text'
                        inputRef={el => registerRef(idx, 'netAmount', el)}
                        onKeyDown={e => handleKeyDown(e, idx, 'netAmount')}
                        value={
                          focusedIndex && focusedIndex.idx === idx && focusedIndex.field === 'netAmount'
                            ? (row.netAmount ?? '')
                            : formatTurkishNumber(row.netAmount ?? '')
                        }
                        onFocus={() => setFocusedIndex({ idx, field: 'netAmount' })}
                        onBlur={e => {
                          setFocusedIndex(null)
                          handleChange(idx, 'netAmount', e.target.value)
                        }}
                        onChange={e => handleChange(idx, 'netAmount', e.target.value)}
                        size='small'
                        variant='outlined'
                        className='w-full'
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>{getCurrencySymbol(currency)}</InputAdornment>
                        }}
                        placeholder='Net Tutar'
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div className='flex flex-col md:flex-row gap-4 items-start p-2  w-full justify-between'>
        {/* Sol: Belge Açıklaması */}
        <div className='flex-1 w-full max-w-md'>
          <Paper
            className='p-4 h-full'
            sx={{
              background: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%'
            }}
          >
            <TextField
              label='Belge Açıklaması'
              multiline
              minRows={4}
              fullWidth
              variant='outlined'
              value={documentNote}
              onChange={e => setDocumentNote(e.target.value)}
            />
          </Paper>
        </div>
        {/* Sağ: Hesap Özeti (mevcut alanın olduğu yer) */}
        <div className='flex-1 w-full max-w-md'>
          {/* Özet Bilgiler Alanı */}
          <div className='flex flex-col items-end'>
            <div className='w-full max-w-md'>
              <Paper
                className='p-4 '
                sx={{ background: theme.palette.background.paper, borderRadius: 2, boxShadow: 'none' }}
              >
                {/* Hesaplamalar */}
                {(() => {
                  // Mal/Hizmet Toplam Tutarı
                  const totalAmount = rows.reduce((sum, row) => sum + parseTurkishNumber(row.total), 0)

                  // Toplam İskonto Hesaplama
                  let totalDiscount = 0

                  if (activeDiscounts.length > 0) {
                    totalDiscount = rows.reduce((sum, row) => {
                      const unitPrice = parseTurkishNumber(row.unitPrice)
                      const quantity = parseTurkishNumber(row.quantity)
                      const grossTotal = unitPrice * quantity
                      let discountMultiplier = 1
                      const discountKeys = ['discount1', 'discount2', 'discount3', 'discount4']

                      const discounts = discountKeys.map(key =>
                        activeDiscounts.includes(key) ? parseTurkishNumber(row[key as keyof InvoiceRow] ?? '0') : 0
                      )

                      discounts.forEach(d => {
                        if (d > 0) {
                          discountMultiplier *= 1 - d / 100
                        }
                      })
                      const netAmount = grossTotal * discountMultiplier

                      return sum + (grossTotal - netAmount)
                    }, 0)
                  }

                  // Hesaplanan KDV
                  const totalVAT = rows.reduce((sum, row) => sum + parseTurkishNumber(row.vatAmount), 0)

                  // Net Tutar (Matrah): Mal/Hizmet Toplam Tutarı - Toplam İskonto
                  const netTotal = totalAmount - totalDiscount

                  // Vergiler Dahil Toplam Tutar
                  const totalWithTaxes = includesVAT ? netTotal : netTotal + totalVAT

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

                  // TL karşılığı hesaplama (sadece döviz ise)
                  let payableAmountInTRY = payableAmountWithWithholding
                  const rate = parseFloat(exchangeRate)

                  if (currency !== 'TRY' && rate && !isNaN(rate)) {
                    payableAmountInTRY = payableAmountWithWithholding * rate
                  }

                  // Temadan uygun renkler
                  const valueBg =
                    theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100]

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
                      <tbody className='[&>tr>td]:py-1 [&>tr>td]:pr-2'>
                        <tr>
                          <td className=' font-medium'>Mal/Hizmet Toplam Tutarı:</td>
                          <td>
                            <span style={valueBoxStyle}>
                              <span>{formatTurkishNumber(totalAmount)}</span>
                              <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                            </span>
                          </td>
                        </tr>
                        {/* Toplam İskonto Alanı */}
                        {activeDiscounts.length > 0 && (
                          <tr>
                            <td className=' font-medium'>Toplam İskonto:</td>
                            <td>
                              <span style={valueBoxStyle}>
                                <span>{formatTurkishNumber(totalDiscount)}</span>
                                <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className=' font-medium'>Net Tutar (Matrah):</td>
                          <td>
                            <span style={valueBoxStyle}>
                              <span>{formatTurkishNumber(netTotal)}</span>
                              <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className=' font-medium'>Hesaplanan KDV:</td>
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
                            <td className=' font-medium'>Hesaplanan Tevkifat:</td>
                            <td>
                              <span style={valueBoxStyle}>
                                <span>{formatTurkishNumber(calculatedWithholding)}</span>
                                <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className=' font-medium'>Vergiler Dahil Toplam Tutar:</td>
                          <td>
                            <span style={valueBoxStyle}>
                              <span>{formatTurkishNumber(totalWithTaxes)}</span>
                              <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className=' font-medium'>Ödenecek Tutar:</td>
                          <td>
                            <span
                              style={{
                                ...valueBoxBoldStyle,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 2
                              }}
                            >
                              <span>
                                {formatTurkishNumber(payableAmountWithWithholding)}
                                <span style={{ marginLeft: 6 }}>{getCurrencySymbol(currency)}</span>
                              </span>
                            </span>
                          </td>
                        </tr>
                        {/* Eğer para birimi TRY değilse, TL karşılığını yeni bir satırda göster */}
                        {currency !== 'TRY' && rate && !isNaN(rate) && (
                          <tr>
                            <td className=' font-medium'>Ödenecek Toplam TL Tutarı:</td>
                            <td>
                              <span style={valueBoxBoldStyle}>{formatTurkishNumber(payableAmountInTRY)} ₺</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )
                })()}
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceItemsTable
