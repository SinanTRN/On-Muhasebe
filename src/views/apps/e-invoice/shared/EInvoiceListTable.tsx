'use client'
import { useState, useMemo, useEffect } from 'react'

import Card from '@mui/material/Card'
import { useMediaQuery } from '@mui/material'
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

import Pagination from '@mui/material/Pagination'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import './EInvoiceListTable.module.css'
import EInvoiceListFilterBar from './EInvoiceListFilterBar'

type Invoice = {
  id: string // Fatura No
  status: string // Durum
  vknTckn: string
  title: string // Unvan
  nameSurname: string // Ad Soyad
  type: string // Tip
  amount: number // Tutar
  unit: string // Birim
  receivedAt: string // Alınma Zamanı (ISO string)
  response: string // Yanıt
  envelopeStatus: string // Fatura Zarf Durumu
  read: boolean // Okundu bilgisi
}

type Props = {
  invoiceData: Invoice[]
}

const statusOptions = [
  'Alındı',
  'Yanıt bekliyor',
  'Kabul',
  'Kabul Başarısız',
  'Beklenen sürede tamamlanmadı',
  'Ret',
  'Ret - Başarısız'
]

const EInvoiceListTable = ({ invoiceData }: Props) => {
  const [orderBy, setOrderBy] = useState<keyof Invoice>('receivedAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [readFilter, setReadFilter] = useState('')

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleSort = (property: keyof Invoice) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0) // Sıralama değişince ilk sayfaya dön
  }

  const filteredData = useMemo(() => {
    return invoiceData
      .filter(inv => {
        // Arama ve filtreler (örnek: id, vknTckn, title, nameSurname, type, response, envelopeStatus)
        const searchMatch =
          inv.id.toLowerCase().includes(search.toLowerCase()) ||
          inv.vknTckn.toLowerCase().includes(search.toLowerCase()) ||
          inv.title.toLowerCase().includes(search.toLowerCase()) ||
          inv.nameSurname.toLowerCase().includes(search.toLowerCase())

        // Durum filtreleri (örnek: envelopeStatus)
        const statusMatch = !statusFilter || inv.status === statusFilter

        // Tarih filtreleri
        const invoiceDate = new Date(inv.receivedAt)
        let dateMatch = true

        if (startDate && endDate) {
          dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
        } else if (startDate) {
          dateMatch = invoiceDate >= startDate
        } else if (endDate) {
          dateMatch = invoiceDate <= endDate
        }

        let readMatch = true

        if (readFilter === 'okundu') readMatch = inv.read === true
        else if (readFilter === 'okunmadi') readMatch = inv.read === false

        return statusMatch && searchMatch && dateMatch && readMatch
      })
      .sort((a, b) => {
        if (orderBy === 'amount') {
          return order === 'asc' ? a.amount - b.amount : b.amount - a.amount
        } else if (orderBy === 'receivedAt') {
          return order === 'asc'
            ? (a.receivedAt || '').localeCompare(b.receivedAt || '')
            : (b.receivedAt || '').localeCompare(a.receivedAt || '')
        } else if (orderBy === 'status') {
          return order === 'asc'
            ? (a.status || '').localeCompare(b.status || '')
            : (b.status || '').localeCompare(a.status || '')
        } else {
          return order === 'asc'
            ? String(a[orderBy] || '').localeCompare(String(b[orderBy] || ''))
            : String(b[orderBy] || '').localeCompare(String(a[orderBy] || ''))
        }
      })
  }, [invoiceData, statusFilter, search, order, orderBy, startDate, endDate, readFilter])

  const pagedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredData.length / rowsPerPage) - 1)

    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [filteredData.length, rowsPerPage, page])

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = pagedData.map(n => n.id)

      setSelected(newSelected)

      return
    }

    setSelected([])
  }

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  return (
    <Card className='p-4  rounded-md shadow-md'>


        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < pagedData.length}
                    checked={pagedData.length > 0 && selected.length === pagedData.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'Tümünü seç' }}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    Fatura No
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'receivedAt'}
                    direction={orderBy === 'receivedAt' ? order : 'asc'}
                    onClick={() => handleSort('receivedAt')}
                  >
                    Tarih
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'vknTckn'}
                    direction={orderBy === 'vknTckn' ? order : 'asc'}
                    onClick={() => handleSort('vknTckn')}
                  >
                    VKN/TCKN
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Unvan
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'nameSurname'}
                    direction={orderBy === 'nameSurname' ? order : 'asc'}
                    onClick={() => handleSort('nameSurname')}
                  >
                    Ad Soyad
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleSort('type')}
                  >
                    Tip
                  </TableSortLabel>
                </TableCell>
                <TableCell align='right'>
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleSort('amount')}
                  >
                    Tutar
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'unit'}
                    direction={orderBy === 'unit' ? order : 'asc'}
                    onClick={() => handleSort('unit')}
                  >
                    Birim
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'receivedAt'}
                    direction={orderBy === 'receivedAt' ? order : 'asc'}
                    onClick={() => handleSort('receivedAt')}
                  >
                    Alınma Zamanı
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Durum
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'response'}
                    direction={orderBy === 'response' ? order : 'asc'}
                    onClick={() => handleSort('response')}
                  >
                    Yanıt
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'envelopeStatus'}
                    direction={orderBy === 'envelopeStatus' ? order : 'asc'}
                    onClick={() => handleSort('envelopeStatus')}
                  >
                    Fatura Zarf Durumu
                  </TableSortLabel>
                </TableCell>
                <TableCell>Okundu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedData.map(row => (
                <TableRow key={row.id} selected={isSelected(row.id)}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={isSelected(row.id)}
                      onChange={() => handleClick(row.id)}
                      inputProps={{ 'aria-label': `Seç ${row.id}` }}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{new Date(row.receivedAt).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>{row.vknTckn}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.nameSurname}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align='right'>
                    {row.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{new Date(row.receivedAt).toLocaleString('tr-TR')}</TableCell>
                  <TableCell>
                    {(() => {
                      const val = row.status

                      if (val === 'Kabul' || val === 'Alındı') return <Chip label={val} color='success' size='small' />
                      if (val.startsWith('Ret')) return <Chip label={val} color='error' size='small' />
                      if (val === 'Yanıt bekliyor') return <Chip label={val} color='warning' size='small' />

                      return <Chip label={val} size='small' />
                    })()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const val = row.response

                      if (val === 'Ulaştırıldı') return <Chip label={val} color='success' size='small' />
                      if (val === 'Yanıt Bekliyor') return <Chip label={val} color='warning' size='small' />
                      if (val === 'Yanıt Gerekmiyor') return <Chip label={val} color='default' size='small' />
                      if (val === 'Teyit Ediniz') return <Chip label={val} color='primary' size='small' />

                      return null
                    })()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const val = row.envelopeStatus

                      if (val === 'Başarılı') return <Chip label={val} color='success' size='small' />
                      if (val === 'Hatalı') return <Chip label={val} color='error' size='small' />
                      if (val === 'Beklemede') return <Chip label={val} color='warning' size='small' />

                      return <Chip label={val} size='small' />
                    })()}
                  </TableCell>
                  <TableCell>
                    {row.read ? (
                      <Chip label='Okundu' color='success' size='small' />
                    ) : (
                      <Chip label='Okunmadı' color='error' size='small' />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {pagedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={15} align='center'>
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className='flex flex-wrap items-center justify-end mt-2 gap-2'>
          <TablePagination
            component='div'
            count={filteredData.length}
            page={page}
            onPageChange={() => {}}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25]}
            labelRowsPerPage='Satır / Sayfa'
            labelDisplayedRows={({ from, to, count, page }) =>
              `${from}-${to} arası, toplam ${count !== -1 ? count : `>${to}`} kayıt (Sayfa ${page + 1})`
            }
            sx={{ minWidth: 300, '& .MuiTablePagination-actions': { display: 'none' } }}
            style={{ border: 'none', boxShadow: 'none' }}
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
        </div>

    </Card>
  )
}

export default EInvoiceListTable
