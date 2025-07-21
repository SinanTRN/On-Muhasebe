import React from 'react'

import { TextField, Button, useTheme, Box } from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

export type Filters = {
  invoiceNo: string
  customer: string
  referenceNo: string
  invoiceStart: Date | null
  invoiceEnd: Date | null
  receivedStart: Date | null
  receivedEnd: Date | null
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
        <div className='flex flex-col sm:flex-col md:flex-row gap-2'>
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
      {/* Fatura Tarihi */}
      <Box className='flex flex-row max-w-[70%]'>
        <div className='flex flex-col sm:flex-col md:flex-row gap-2'>
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
        <div className='flex flex-col sm:flex-col md:flex-row gap-2'>
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
      {/* Fatura Referans Numarası */}
      <Box className='flex flex-row max-w-[70%] '>
        <div className='flex flex-col sm:flex-col md:flex-row gap-2'>
          <TextField
            label='Fatura referans numarası'
            value={filters.referenceNo}
            onChange={e => setFilters({ ...filters, referenceNo: e.target.value })}
            size='small'
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
