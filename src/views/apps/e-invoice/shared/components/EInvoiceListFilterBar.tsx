import React from 'react'
import { TextField, Button, useTheme, Box, Collapse } from '@mui/material'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type Filters = {
  invoiceNo: string
  customer: string
  invoiceStart: Date | null
  invoiceEnd: Date | null
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
  const [filterOpen, setFilterOpen] = React.useState(true)

  // Tarih alanları için otomatik başlangıç tarihi hesaplama
  const getInvoiceStartValue = () => {
    if (!filters.invoiceStart && filters.invoiceEnd) {
      const start = new Date(filters.invoiceEnd)
      start.setMonth(start.getMonth() - 1)
      return start
    }
    return filters.invoiceStart
  }

  return (
    <Box
      className='flex flex-col gap-3 p-4 rounded-md shadow-md'
      style={{ background: theme.palette.background.paper }}
    >
      <Button
        variant='contained'
        disableRipple
        onClick={() => setFilterOpen(val => !val)}
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        Filtrele
      </Button>
      <Collapse in={filterOpen}>
        <div className='flex flex-col gap-3'>
          {/* Fatura Numarası ve Unvan/VKN-TCKN */}
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
          {/* Fatura Tarihi Başlangıç ve Bitiş */}
          <Box className='flex flex-row max-w-[70%]'>
            <div className='flex flex-col sm:flex-col md:flex-row gap-3'>
              <AppReactDatepicker
                selected={getInvoiceStartValue() || undefined}
                onChange={date => setFilters({ ...filters, invoiceStart: date })}
                dateFormat='dd.MM.yyyy'
                customInput={<TextField size='small' label='Fatura Tarihi Başlangıç' fullWidth />}
                showPopperArrow={false}
                maxDate={filters.invoiceEnd || today}
                selectsStart
                startDate={getInvoiceStartValue() || undefined}
                endDate={filters.invoiceEnd || undefined}
              />
              <AppReactDatepicker
                selected={filters.invoiceEnd || undefined}
                onChange={date => setFilters({ ...filters, invoiceEnd: date })}
                dateFormat='dd.MM.yyyy'
                customInput={<TextField size='small' label='Fatura Tarihi Bitiş' fullWidth />}
                showPopperArrow={false}
                minDate={filters.invoiceStart || undefined}
                maxDate={today}
                selectsEnd
                startDate={filters.invoiceStart || undefined}
                endDate={filters.invoiceEnd || undefined}
              />
            </div>
          </Box>
          {/* Butonlar */}
          <Box className='flex gap-2 justify-start pt-2'>
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
        </div>
      </Collapse>
    </Box>
  )
}

export default EInvoiceListFilterBar
