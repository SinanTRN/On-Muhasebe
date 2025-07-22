import React, { useState, useRef } from 'react'

import {
  TextField,
  Button,
  useTheme,
  Box,
  Grid,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'

import Checkbox from '@mui/material/Checkbox'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

export type Filters = {
  invoiceNo: string
  customer: string
  invoiceStart: Date | null
  invoiceEnd: Date | null
  receivedStart: Date | null
  receivedEnd: Date | null
  status: string[] // Çoklu seçim için güncellendi
  invoiceScript: string[] // Fatura Senaryosu için çoklu seçim
  readStatus: string
  type: string // Fatura Tipi için tekli seçim
}

type Props = {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onSearch: () => void
  onReset: () => void
}

const EInvoiceListFilterBar = ({ filters, setFilters, onSearch, onReset }: Props) => {
  const theme = useTheme()
  const today = new Date()

  const statusFieldRef = useRef<HTMLDivElement>(null)
  const readFieldRef = useRef<HTMLDivElement>(null)
  const typeFieldRef = useRef<HTMLDivElement>(null)
  const invoiceScriptFieldRef = useRef<HTMLDivElement>(null)

  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)
  const [readAnchorEl, setReadAnchorEl] = useState<null | HTMLElement>(null)
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null)
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined)
  const [readPopoverWidth, setReadPopoverWidth] = useState<number | undefined>(undefined)
  const [typePopoverWidth, setTypePopoverWidth] = useState<number | undefined>(undefined)
  const [invoiceScriptAnchorEl, setInvoiceScriptAnchorEl] = useState<null | HTMLElement>(null)
  const [invoiceScriptPopoverWidth, setInvoiceScriptPopoverWidth] = useState<number | undefined>(undefined)

  const statusOptions = [
    { value: 'Alındı', label: 'Alındı' },
    { value: 'Kabul', label: 'Kabul' },
    { value: 'Yanıt bekliyor', label: 'Yanıt bekliyor' },
    { value: 'Reddedildi', label: 'Reddedildi' },
    { value: 'İptal', label: 'İptal' }
  ]

  const readOptions = [
    { value: '', label: 'Tümü' },
    { value: 'okundu', label: 'Okundu' },
    { value: 'okunmadi', label: 'Okunmadı' }
  ]

  const typeOptions = [
    { value: '', label: 'Tümü' },
    { value: 'E-Arşiv', label: 'E-Arşiv' },
    { value: 'E-Fatura', label: 'E-Fatura' }
  ]

  const invoiceScriptOptions = [
    { value: 'TEMEL', label: 'TEMEL' },
    { value: 'TİCARİ', label: 'TİCARİ' },
    { value: 'KAMU', label: 'KAMU' },
    { value: 'İHRACAT', label: 'İHRACAT' }
  ]

  const handleStatusButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget)

    if (statusFieldRef.current) {
      setPopoverWidth(statusFieldRef.current.offsetWidth)
    }
  }

  const handleReadButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setReadAnchorEl(event.currentTarget)

    if (readFieldRef.current) {
      setReadPopoverWidth(readFieldRef.current.offsetWidth)
    }
  }

  const handleStatusClose = () => {
    setStatusAnchorEl(null)
  }

  const handleReadClose = () => {
    setReadAnchorEl(null)
  }

  const handleReadSelect = (value: string) => {
    setFilters({ ...filters, readStatus: value })
    setReadAnchorEl(null)
  }

  const handleTypeButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setTypeAnchorEl(event.currentTarget)

    if (typeFieldRef.current) {
      setTypePopoverWidth(typeFieldRef.current.offsetWidth)
    }
  }

  const handleTypeClose = () => {
    setTypeAnchorEl(null)
  }

  const handleInvoiceScriptButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setInvoiceScriptAnchorEl(event.currentTarget)

    if (invoiceScriptFieldRef.current) {
      setInvoiceScriptPopoverWidth(invoiceScriptFieldRef.current.offsetWidth)
    }
  }

  const handleInvoiceScriptClose = () => {
    setInvoiceScriptAnchorEl(null)
  }

  const allSelected = filters.status.length === statusOptions.length
  const noneSelected = filters.status.length === 0

  const statusLabel = noneSelected || allSelected ? 'Tümü' : `Seçildi (${filters.status.length})`

  const allInvoiceScriptSelected = filters.invoiceScript.length === invoiceScriptOptions.length
  const noneInvoiceScriptSelected = filters.invoiceScript.length === 0

  const invoiceScriptLabel =
    noneInvoiceScriptSelected || allInvoiceScriptSelected ? 'Tümü' : `Seçildi (${filters.invoiceScript.length})`

  const typeLabel = typeOptions.find(opt => opt.value === filters.type)?.label || 'Tümü'

  const addYears = (date: Date, years: number) => {
    const result = new Date(date)

    result.setFullYear(result.getFullYear() + years)

    return result
  }

  return (
    <Box
      className='flex flex-col gap-3 p-4 rounded-md shadow-md'
      style={{ background: theme.palette.background.paper }}
    >
      {/* Fatura Numarası */}
      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        <Grid item>
          <TextField
            label='Fatura No'
            value={filters.invoiceNo}
            onChange={e => setFilters({ ...filters, invoiceNo: e.target.value })}
            size='small'
          />
        </Grid>
        <Grid item>
          <TextField
            label='Unvanı veya VKN/TCKN'
            value={filters.customer}
            onChange={e => setFilters({ ...filters, customer: e.target.value })}
            size='small'
          />
        </Grid>
      </Grid>

      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        {/* Fatura Durumu */}
        <Grid item>
          <TextField
            label='Fatura Durumu'
            value={statusLabel}
            size='small'
            inputProps={{ readOnly: true }}
            onClick={handleStatusButtonClick}
            ref={statusFieldRef}
            sx={{ minWidth: 160, cursor: 'pointer' }}
          />
          <Popover
            open={Boolean(statusAnchorEl)}
            anchorEl={statusAnchorEl}
            onClose={handleStatusClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                width: popoverWidth || undefined,
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0
              }
            }}
          >
            <List disablePadding>
              {/* Tümü seçeneği */}
              <ListItem disablePadding>
                <ListItemButton
                  selected={noneSelected || allSelected}
                  onClick={() => {
                    setFilters({ ...filters, status: [] })
                  }}
                >
                  <Checkbox checked={noneSelected || allSelected} tabIndex={-1} disableRipple />
                  <ListItemText primary='Tümü' />
                </ListItemButton>
              </ListItem>
              {statusOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={filters.status.includes(option.value)}
                    onClick={() => {
                      let newStatus: string[]

                      if (filters.status.includes(option.value)) {
                        newStatus = filters.status.filter(v => v !== option.value)
                      } else {
                        newStatus = [...filters.status, option.value]
                      }

                      setFilters({ ...filters, status: newStatus })
                    }}
                  >
                    <Checkbox checked={filters.status.includes(option.value)} tabIndex={-1} disableRipple />
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </Grid>
        <Grid item>
          <TextField
            label='Fatura Senaryosu'
            value={invoiceScriptLabel}
            size='small'
            inputProps={{ readOnly: true }}
            onClick={handleInvoiceScriptButtonClick}
            ref={invoiceScriptFieldRef}
            sx={{ minWidth: 160, cursor: 'pointer' }}
          />
          <Popover
            open={Boolean(invoiceScriptAnchorEl)}
            anchorEl={invoiceScriptAnchorEl}
            onClose={handleInvoiceScriptClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                width: invoiceScriptPopoverWidth || undefined,
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0
              }
            }}
          >
            <List disablePadding>
              {/* Tümü seçeneği */}
              <ListItem disablePadding>
                <ListItemButton
                  selected={noneInvoiceScriptSelected || allInvoiceScriptSelected}
                  onClick={() => {
                    setFilters({ ...filters, invoiceScript: [] })
                  }}
                >
                  <Checkbox
                    checked={noneInvoiceScriptSelected || allInvoiceScriptSelected}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary='Tümü' />
                </ListItemButton>
              </ListItem>
              {invoiceScriptOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={filters.invoiceScript.includes(option.value)}
                    onClick={() => {
                      let newInvoiceScript: string[]

                      if (filters.invoiceScript.includes(option.value)) {
                        newInvoiceScript = filters.invoiceScript.filter(v => v !== option.value)
                      } else {
                        newInvoiceScript = [...filters.invoiceScript, option.value]
                      }

                      setFilters({ ...filters, invoiceScript: newInvoiceScript })
                    }}
                  >
                    <Checkbox checked={filters.invoiceScript.includes(option.value)} tabIndex={-1} disableRipple />
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </Grid>
      </Grid>
      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        {/* Okundu Bilgisi*/}
        <Grid item>
          <TextField
            label='Okundu Bilgisi'
            value={readOptions.find(opt => opt.value === filters.readStatus)?.label || ''}
            size='small'
            inputProps={{ readOnly: true }}
            onClick={handleReadButtonClick}
            ref={readFieldRef}
            sx={{ minWidth: 160, cursor: 'pointer' }}
          />
          <Popover
            open={Boolean(readAnchorEl)}
            anchorEl={readAnchorEl}
            onClose={handleReadClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                width: readPopoverWidth || undefined,
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0
              }
            }}
          >
            <List disablePadding>
              {readOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={filters.readStatus === option.value}
                    onClick={() => handleReadSelect(option.value)}
                  >
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </Grid>
        {/* Fatura Tipi */}
        <Grid item>
          <TextField
            label='Fatura Tipi'
            value={typeLabel}
            size='small'
            inputProps={{ readOnly: true }}
            onClick={handleTypeButtonClick}
            ref={typeFieldRef}
            sx={{ minWidth: 160, cursor: 'pointer' }}
          />
          <Popover
            open={Boolean(typeAnchorEl)}
            anchorEl={typeAnchorEl}
            onClose={handleTypeClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                width: typePopoverWidth || undefined,
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0
              }
            }}
          >
            <List disablePadding>
              {typeOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={filters.type === option.value}
                    onClick={() => {
                      setFilters({ ...filters, type: option.value })
                      setTypeAnchorEl(null)
                    }}
                  >
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </Grid>
      </Grid>
      {/* Fatura Tarihi */}
      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        <Grid item>
          <AppReactDatepicker
            selected={filters.invoiceStart || undefined}
            onChange={date => setFilters({ ...filters, invoiceStart: date })}
            dateFormat='dd.MM.yyyy'
            customInput={<TextField size='small' label='Fatura Tarihi Başlangıç' fullWidth />}
            showPopperArrow={false}
            maxDate={filters.invoiceEnd || today}
            minDate={filters.invoiceEnd ? addYears(filters.invoiceEnd, -1) : undefined}
            selectsStart
            startDate={filters.invoiceStart || undefined}
            endDate={filters.invoiceEnd || undefined}
          />
        </Grid>
        <Grid item>
          <AppReactDatepicker
            selected={filters.invoiceEnd || undefined}
            onChange={date => setFilters({ ...filters, invoiceEnd: date })}
            dateFormat='dd.MM.yyyy'
            customInput={<TextField size='small' label='Fatura Tarihi Bitiş' fullWidth />}
            showPopperArrow={false}
            minDate={filters.invoiceStart || undefined}
            maxDate={
              filters.invoiceStart
                ? addYears(filters.invoiceStart, 1) < today
                  ? addYears(filters.invoiceStart, 1)
                  : today
                : today
            }
            selectsEnd
            startDate={filters.invoiceStart || undefined}
            endDate={filters.invoiceEnd || undefined}
          />
        </Grid>
      </Grid>
      {/* Alınma Tarihi */}
      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        <Grid item>
          <AppReactDatepicker
            selected={filters.receivedStart || undefined}
            onChange={date => setFilters({ ...filters, receivedStart: date })}
            dateFormat='dd.MM.yyyy'
            customInput={<TextField size='small' label='Alınma Tarihi Başlangıç' fullWidth />}
            showPopperArrow={false}
            maxDate={filters.receivedEnd || today}
            minDate={filters.receivedEnd ? addYears(filters.receivedEnd, -1) : undefined}
            selectsStart
            startDate={filters.receivedStart || undefined}
            endDate={filters.receivedEnd || undefined}
          />
        </Grid>
        <Grid item>
          <AppReactDatepicker
            selected={filters.receivedEnd || undefined}
            onChange={date => setFilters({ ...filters, receivedEnd: date })}
            dateFormat='dd.MM.yyyy'
            customInput={<TextField size='small' label='Alınma Tarihi Bitiş' fullWidth />}
            showPopperArrow={false}
            minDate={filters.receivedStart || undefined}
            maxDate={
              filters.receivedStart
                ? addYears(filters.receivedStart, 1) < today
                  ? addYears(filters.receivedStart, 1)
                  : today
                : today
            }
            selectsEnd
            startDate={filters.receivedStart || undefined}
            endDate={filters.receivedEnd || undefined}
          />
        </Grid>
      </Grid>
      {/* Butonlar */}
      <Box className='flex gap-2 justify-start  pt-2'>
        <div className='flex flex-row gap-2'>
          <div className='flex-1 max-w-full'>
            <Button variant='contained' color='success' onClick={onSearch} disableRipple>
              <i className='ri-search-line mr-1' />
              Ara
            </Button>
          </div>
          <div className='flex-1 max-w-full'>
            <Button variant='contained' color='primary' onClick={onReset} disableRipple>
              <i className='ri-eraser-line mr-1' />
              Temizle
            </Button>
          </div>
        </div>
      </Box>
    </Box>
  )
}

export default EInvoiceListFilterBar
