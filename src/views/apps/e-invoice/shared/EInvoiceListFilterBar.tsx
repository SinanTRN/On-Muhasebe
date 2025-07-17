import React from 'react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useMediaQuery,useTheme } from '@mui/material'

const statusOptions = [
  'Alındı',
  'Yanıt bekliyor',
  'Kabul',
  'Kabul Başarısız',
  'Beklenen sürede tamamlanmadı',
  'Ret',
  'Ret - Başarısız'
]

type Props = {
  search: string
  setSearch: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  startDate: Date | null
  setStartDate: (val: Date | null) => void
  endDate: Date | null
  setEndDate: (val: Date | null) => void
  readFilter: string
  setReadFilter: (val: string) => void
}

const EInvoiceListFilterBar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  readFilter,
  setReadFilter
}: Props) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const theme=useTheme()
  return (
    <div className=' flex flex-col gap-4 sm:flex-row sm:gap-6 p-4 rounded-md shadow-md' style={{ background: theme.palette.background.paper }}>
      <TextField
        label='Ara (Fatura No, Unvan)'
        value={search}
        onChange={e => setSearch(e.target.value)}
        size='small'
      />
      <FormControl size='small' style={{ minWidth: 160 }}>
        <InputLabel>Durum</InputLabel>
        <Select
          value={statusFilter}
          label='Durum'
          onChange={e => setStatusFilter(e.target.value)}
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
        >
          <MenuItem value=''>Tümü</MenuItem>
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <AppReactDatepicker
        selected={startDate || undefined}
        onChange={date => setStartDate(date)}
        dateFormat='dd.MM.yyyy'
        customInput={<TextField size='small' label='Başlangıç Tarihi' placeholder='Başlangıç Tarihi' />}
        showPopperArrow={false}
        maxDate={endDate || undefined}
        selectsStart
        startDate={startDate || undefined}
        endDate={endDate || undefined}
      />
      <AppReactDatepicker
        selected={endDate || undefined}
        onChange={date => setEndDate(date)}
        dateFormat='dd.MM.yyyy'
        customInput={<TextField size='small' label='Bitiş Tarihi' placeholder='Bitiş Tarihi' />}
        showPopperArrow={false}
        minDate={startDate || undefined}
        selectsEnd
        startDate={startDate || undefined}
        endDate={endDate || undefined}
      />
      <FormControl size='small' style={{ minWidth: 150 }}>
        <InputLabel>Okundu Bilgisi</InputLabel>
        <Select
          value={readFilter}
          label='Okundu Bilgisi'
          onChange={e => setReadFilter(e.target.value)}
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
        >
          <MenuItem value=''>Tümü</MenuItem>
          <MenuItem value='okundu'>Okundu</MenuItem>
          <MenuItem value='okunmadi'>Okunmadı</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default EInvoiceListFilterBar 
