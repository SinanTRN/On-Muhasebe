import React, { useState, useRef } from 'react'

import { TextField, Button, useTheme, Box, Grid, Popover, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

export type Filters = {
  invoiceNo: string
  customer: string
  invoiceStart: Date | null
  invoiceEnd: Date | null
  receivedStart: Date | null
  receivedEnd: Date | null
  status: string // Fatura durumu eklendi
  readStatus: string // Okundu bilgisi eklendi
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
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined)
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)
  const [readAnchorEl, setReadAnchorEl] = useState<null | HTMLElement>(null)
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined)
  const [readPopoverWidth, setReadPopoverWidth] = useState<number | undefined>(undefined)

  const statusOptions = [
    { value: '', label: 'Tümü' },
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

  const handleStatusSelect = (value: string) => {
    setFilters({ ...filters, status: value })
    setStatusAnchorEl(null)
  }
  const handleReadSelect = (value: string) => {
    setFilters({ ...filters, readStatus: value })
    setReadAnchorEl(null)
  }

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
      <Box className='flex flex-row sm:flex-col max-w-[70%]'>
        <div className='flex flex-col sm:flex-col md:flex-row gap-3'>
          <TextField
            label='Fatura Numarası'
            value={filters.invoiceNo}
            onChange={e => setFilters({ ...filters, invoiceNo: e.target.value })}
            size='small'
          />
          <TextField
            label='Unvanı veya VKN/TCKN'
            value={filters.customer}
            onChange={e => setFilters({ ...filters, customer: e.target.value })}
            size='small'
          />
        </div>
      </Box>
      {/* Fatura Referans Numarası */}
      <Grid container className='flex flex-row max-w-[70%] gap-3'>
        <Grid item>
          {/* Fatura Durumu Alanı */}
          <TextField
            label='Fatura Durumu'
            value={statusOptions.find(opt => opt.value === filters.status)?.label || ''}
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
              {statusOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={filters.status === option.value}
                    onClick={() => handleStatusSelect(option.value)}
                  >
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        </Grid>
        <Grid item>
          {/* Okundu Bilgisi Alanı */}
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
      </Grid>
      {/* Fatura Tarihi */}
      <Box className='flex flex-row max-w-[70%]'>
        <div className='flex flex-col sm:flex-col md:flex-row gap-3'>
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
        </div>
      </Box>
      {/* Alınma Tarihi */}
      <Box className='flex flex-row max-w-[70%]'>
        <div className='flex flex-col sm:flex-col md:flex-row gap-3'>
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
        </div>
      </Box>
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
