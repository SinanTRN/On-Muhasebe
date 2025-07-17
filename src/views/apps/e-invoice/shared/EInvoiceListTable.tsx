'use client'
import { useState, useMemo, useEffect } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'

import Pagination from '@mui/material/Pagination'
import Checkbox from '@mui/material/Checkbox'

import StatusLabel from './StatusLabel'

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

const EInvoiceListTable = ({ invoiceData }: Props) => {
  const [orderBy, setOrderBy] = useState<keyof Invoice>('receivedAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState<string[]>([])

  const handleSort = (property: keyof Invoice) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  // Sadece sıralama
  const sortedData = useMemo(() => {
    return [...invoiceData].sort((a, b) => {
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
  }, [invoiceData, order, orderBy])

  // Sayfalama
  const pagedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(sortedData.length / rowsPerPage) - 1)

    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [sortedData.length, rowsPerPage, page])

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
    <Card className='p-4 rounded-md shadow-md'>
      <TableContainer>
        <Table className='flex-1'>
          <TableHead>
            <TableRow>
              {/*Tüm satırları seçmek için Checkbox */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[10px]'>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < pagedData.length}
                  checked={pagedData.length > 0 && selected.length === pagedData.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'Tümünü seç' }}
                />
              </TableCell>
              {/* Tip */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[100px] '>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderBy === 'type' ? order : 'asc'}
                  onClick={() => handleSort('type')}
                  hideSortIcon
                >
                  Tip
                </TableSortLabel>
              </TableCell>
              {/* Fatura No */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[180px] '>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                  hideSortIcon
                >
                  Fatura No
                </TableSortLabel>
              </TableCell>
              {/* Tarih */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'receivedAt'}
                  direction={orderBy === 'receivedAt' ? order : 'asc'}
                  onClick={() => handleSort('receivedAt')}
                  hideSortIcon
                >
                  Tarih
                </TableSortLabel>
              </TableCell>
              {/* VKN/TCKN */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'vknTckn'}
                  direction={orderBy === 'vknTckn' ? order : 'asc'}
                  onClick={() => handleSort('vknTckn')}
                  hideSortIcon
                >
                  VKN/TCKN
                </TableSortLabel>
              </TableCell>
              {/* Unvan */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                  hideSortIcon
                >
                  Unvan
                </TableSortLabel>
              </TableCell>
              {/* Ad Soyad */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[250px] '>
                <TableSortLabel
                  active={orderBy === 'nameSurname'}
                  direction={orderBy === 'nameSurname' ? order : 'asc'}
                  onClick={() => handleSort('nameSurname')}
                  hideSortIcon
                >
                  Ad Soyad
                </TableSortLabel>
              </TableCell>
              {/* Tutar */}
              <TableCell className='p-4 text-right align-center justify-center min-w-[150px] '>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleSort('amount')}
                  hideSortIcon
                >
                  Tutar
                </TableSortLabel>
              </TableCell>
              {/* Birim */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[100px] '>
                <TableSortLabel
                  active={orderBy === 'unit'}
                  direction={orderBy === 'unit' ? order : 'asc'}
                  onClick={() => handleSort('unit')}
                  hideSortIcon
                >
                  Birim
                </TableSortLabel>
              </TableCell>
              {/* Alınma Zamanı */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'receivedAt'}
                  direction={orderBy === 'receivedAt' ? order : 'asc'}
                  onClick={() => handleSort('receivedAt')}
                  hideSortIcon
                >
                  Alınma Zamanı
                </TableSortLabel>
              </TableCell>
              {/* Durum */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                  hideSortIcon
                >
                  Durum
                </TableSortLabel>
              </TableCell>
              {/* Yanıt */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'response'}
                  direction={orderBy === 'response' ? order : 'asc'}
                  onClick={() => handleSort('response')}
                  hideSortIcon
                >
                  Yanıt
                </TableSortLabel>
              </TableCell>
              {/* Fatura Zarf Durumu */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[200px] '>
                <TableSortLabel
                  active={orderBy === 'envelopeStatus'}
                  direction={orderBy === 'envelopeStatus' ? order : 'asc'}
                  onClick={() => handleSort('envelopeStatus')}
                  hideSortIcon
                >
                  Fatura Zarf Durumu
                </TableSortLabel>
              </TableCell>
              {/* Okundu */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[150px]'>Okundu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.map(row => (
              <TableRow key={row.id} selected={isSelected(row.id)}>
                {/* Satır seçimi için Checkbox */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[10px]'>
                  <Checkbox
                    checked={isSelected(row.id)}
                    onChange={() => handleClick(row.id)}
                    inputProps={{ 'aria-label': `Seç ${row.id}` }}
                  />
                </TableCell>
                {/* Tip */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[100px]'>{row.type}</TableCell>
                {/* Fatura No */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[180px]'>{row.id}</TableCell>
                {/* Tarih */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>
                  {new Date(row.receivedAt).toLocaleDateString('tr-TR')}
                </TableCell>
                {/* VKN/TCKN */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>{row.vknTckn}</TableCell>
                {/* Unvan */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>{row.title}</TableCell>
                {/* Ad Soyad */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[250px]'>
                  {row.nameSurname}
                </TableCell>
                {/* Tutar */}
                <TableCell className='p-4 text-right align-center justify-center min-w-[150px]'>
                  {row.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </TableCell>
                {/* Birim */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[100px] '>{row.unit}</TableCell>
                {/* Alınma Zamanı */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[200px]'>
                  {new Date(row.receivedAt).toLocaleString('tr-TR')}
                </TableCell>
                {/* Durum */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[200px]'>
                  <StatusLabel value={row.status} type='status' />
                </TableCell>
                {/* Yanıt */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[200px]'>
                  {row.response ? <StatusLabel value={row.response} type='response' /> : null}
                </TableCell>
                {/* Fatura Zarf Durumu */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[200px]'>
                  <StatusLabel value={row.envelopeStatus} type='envelopeStatus' />
                </TableCell>
                {/* Okundu */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[150px]'>
                  <StatusLabel value={row.read ? 'Okundu' : 'Okunmadı'} type='read' />
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
          count={sortedData.length}
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
          count={Math.ceil(sortedData.length / rowsPerPage)}
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
