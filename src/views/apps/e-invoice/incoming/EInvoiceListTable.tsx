'use client'
import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TablePagination from '@mui/material/TablePagination'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

type Invoice = {
  id: string
  sender: string
  receiver: string
  date: string
  amount: number
  status: string
}

type Props = {
  invoiceData: Invoice[]
}

const statusOptions = ['Kabul Edildi', 'Beklemede', 'Reddedildi']

const EInvoiceListTable = ({ invoiceData }: Props) => {
  const [orderBy, setOrderBy] = useState<keyof Invoice>('date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleSort = (property: keyof Invoice) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredData = useMemo(() => {
    return invoiceData
      .filter(inv => {
        // Durum ve arama filtreleri
        const statusMatch = !statusFilter || inv.status === statusFilter
        const searchMatch =
          inv.id.toLowerCase().includes(search.toLowerCase()) ||
          inv.sender.toLowerCase().includes(search.toLowerCase())
        // Tarih filtreleri
        const invoiceDate = new Date(inv.date)
        let dateMatch = true
        if (startDate && endDate) {
          dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
        } else if (startDate) {
          dateMatch = invoiceDate >= startDate
        } else if (endDate) {
          dateMatch = invoiceDate <= endDate
        }
        return statusMatch && searchMatch && dateMatch
      })
      .sort((a, b) => {
        if (orderBy === 'amount') {
          return order === 'asc' ? a.amount - b.amount : b.amount - a.amount
        } else if (orderBy === 'date') {
          return order === 'asc'
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date)
        } else {
          return order === 'asc'
            ? String(a[orderBy]).localeCompare(String(b[orderBy]))
            : String(b[orderBy]).localeCompare(String(a[orderBy]))
        }
      })
  }, [invoiceData, statusFilter, search, order, orderBy, startDate, endDate])

  const pagedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <TextField
            label='Ara (Fatura No, Gönderici)'
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
            >
              <MenuItem value=''>Tümü</MenuItem>
              {statusOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
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
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleSort('id')}
                  >Fatura No</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'sender'}
                    direction={orderBy === 'sender' ? order : 'asc'}
                    onClick={() => handleSort('sender')}
                  >Gönderici</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'date'}
                    direction={orderBy === 'date' ? order : 'asc'}
                    onClick={() => handleSort('date')}
                  >Tarih</TableSortLabel>
                </TableCell>
                <TableCell align='right'>
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleSort('amount')}
                  >Tutar</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >Durum</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedData.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.sender}</TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell align='right'>{row.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
              {pagedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align='center'>Kayıt bulunamadı.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mt: 2, flexWrap: 'wrap', gap: 2 }}>
          <TablePagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage='Satır / Sayfa'
            labelDisplayedRows={({ from, to, count, page }) => `${from}-${to} arası, toplam ${count !== -1 ? count : `>${to}`} kayıt (Sayfa ${page + 1})`}
            sx={{ minWidth: 300 }}
            style={{ border: 'none', boxShadow: 'none' }}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color='primary'
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            shape='rounded'
            size='medium'
            sx={{ '& .MuiPaginationItem-root': { fontWeight: 500 } }}
          />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default EInvoiceListTable 
