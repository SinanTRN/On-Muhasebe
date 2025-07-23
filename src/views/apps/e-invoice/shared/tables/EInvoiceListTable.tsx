'use client'
import React from 'react'

import { useTheme, TextField, Tooltip, IconButton, Popover, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

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

import StatusLabel from '../components/StatusLabel'
import ETTNCell from '../components/ETTNCell'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters'

export type Invoice = {
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
  ettn: string // ETTN numarası
  invoiceScript: string // Fatura invoiceScriptsu (TEMEL, TİCARİ, KAMU, İHRACAT)
}

type Props = {
  data: Invoice[]
  order: 'asc' | 'desc'
  orderBy: keyof Invoice
  onSort: (property: keyof Invoice) => void
  page: number
  setPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (n: number) => void
  totalCount: number
  draftFilters: {
    referenceNo: string
    customer: string
    startDate: Date | null
    endDate: Date | null
    invoiceScript: string[]
  }
  setDraftFilters: React.Dispatch<React.SetStateAction<{
    referenceNo: string
    customer: string
    startDate: Date | null
    endDate: Date | null
    invoiceScript: string[]
  }>>
  onApplyFilters: () => void
  onResetFilters: () => void
  search: string
  setSearch: (val: string) => void
  startDate: Date | null
  endDate: Date | null
  customer: string
  referenceNo: string
}

const invoiceScriptOptions = [
  { value: 'TEMEL', label: 'Temel' },
  { value: 'TİCARİ', label: 'Ticari' },
  { value: 'KAMU', label: 'Kamu' },
  { value: 'İHRACAT', label: 'İhracat' }
]

const EInvoiceListTable = ({ data, order, orderBy, onSort, page, setPage, rowsPerPage, setRowsPerPage, totalCount, draftFilters, setDraftFilters, onApplyFilters, onResetFilters, search, setSearch, startDate, endDate, customer, referenceNo }: Props) => {
  const [selected, setSelected] = React.useState<string[]>([])
  const theme = useTheme()

  // Popover state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  // Seçili label'ı oluştur
  const invoiceScriptLabel =
    draftFilters.invoiceScript && draftFilters.invoiceScript.length === 0
      ? 'Tümü'
      : invoiceScriptOptions
          .filter(opt => draftFilters.invoiceScript && draftFilters.invoiceScript.includes(opt.value))
          .map(opt => opt.label)
          .join(', ')

  // Filtre fonksiyonu parenttan gelmeli, burada sadece search uygulanacak
  const filteredData = data

  const pagedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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

  // Tarih alanları için otomatik başlangıç tarihi hesaplama
  const getInvoiceStartValue = () => {
    if (!draftFilters.startDate && draftFilters.endDate) {
      const start = new Date(draftFilters.endDate)
      start.setMonth(start.getMonth() - 1)
      return start
    }
    return draftFilters.startDate
  }

  return (
    <Card className='p-4 rounded-md shadow-md'>
      {/* Filtre barı ve tabloda ara alanı */}
      <div className='flex flex-row flex-wrap items-end gap-2 mb-4'>
        {/* Sola yaslı filtreler */}
        <div className='flex flex-row flex-wrap items-end gap-2'>
          <TextField
            label='Fatura No'
            value={draftFilters.referenceNo}
            onChange={e => setDraftFilters(f => ({ ...f, referenceNo: e.target.value }))}
            size='small'
            sx={{ minWidth: 120, maxWidth: 160 }}
          />
          <TextField
            label='Unvan/VKN-TCKN'
            value={draftFilters.customer}
            onChange={e => setDraftFilters(f => ({ ...f, customer: e.target.value }))}
            size='small'
            sx={{ minWidth: 140, maxWidth: 180 }}
          />
          {/* Fatura Senaryosu Çoklu Seçim Alanı */}
          <TextField
            label='Fatura Senaryosu'
            value={invoiceScriptLabel}
            size='small'
            inputProps={{ readOnly: true }}
            onClick={handleOpen}
            sx={{ minWidth: 160, cursor: 'pointer' }}
          />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                width: 200,
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0
              }
            }}
          >
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  selected={draftFilters.invoiceScript && draftFilters.invoiceScript.length === 0}
                  onClick={() => setDraftFilters(f => ({ ...f, invoiceScript: [] }))}
                >
                  <Checkbox checked={draftFilters.invoiceScript && draftFilters.invoiceScript.length === 0} tabIndex={-1} disableRipple />
                  <ListItemText primary='Tümü' />
                </ListItemButton>
              </ListItem>
              {invoiceScriptOptions.map(option => (
                <ListItem key={option.value} disablePadding>
                  <ListItemButton
                    selected={draftFilters.invoiceScript && draftFilters.invoiceScript.includes(option.value)}
                    onClick={() => {
                      let newInvoiceScript: string[]
                      if (draftFilters.invoiceScript && draftFilters.invoiceScript.includes(option.value)) {
                        newInvoiceScript = draftFilters.invoiceScript.filter(v => v !== option.value)
                      } else {
                        newInvoiceScript = [...(draftFilters.invoiceScript || []), option.value]
                      }
                      setDraftFilters(f => ({ ...f, invoiceScript: newInvoiceScript }))
                    }}
                  >
                    <Checkbox checked={draftFilters.invoiceScript && draftFilters.invoiceScript.includes(option.value)} tabIndex={-1} disableRipple />
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
          {/* Başlangıç Tarihi */}
          <AppReactDatepicker
            selected={getInvoiceStartValue() || undefined}
            onChange={date => setDraftFilters(f => ({ ...f, startDate: date }))}
            dateFormat='dd.MM.yyyy'
            customInput={
              <TextField
                size='small'
                label='Tarih Başlangıç'
                sx={{ minWidth: 120, maxWidth: 140 }}
              />
            }
            showPopperArrow={false}
            maxDate={draftFilters.endDate || new Date()}
            selectsStart
            startDate={getInvoiceStartValue() || undefined}
            endDate={draftFilters.endDate || undefined}
          />
          <AppReactDatepicker
            selected={draftFilters.endDate || undefined}
            onChange={date => setDraftFilters(f => ({ ...f, endDate: date }))}
            dateFormat='dd.MM.yyyy'
            customInput={
              <TextField
                size='small'
                label='Tarih Bitiş'
                sx={{ minWidth: 120, maxWidth: 140 }}
              />
            }
            showPopperArrow={false}
            minDate={draftFilters.startDate || undefined}
            maxDate={new Date()}
            selectsEnd
            startDate={draftFilters.startDate || undefined}
            endDate={draftFilters.endDate || undefined}
          />
          <IconButton color='success' onClick={onApplyFilters} aria-label='Ara'>
            <i className='ri-search-line text-xl' />
          </IconButton>
          <IconButton color='primary' onClick={onResetFilters} aria-label='Temizle'>
            <i className='ri-eraser-line text-xl' />
          </IconButton>
        </div>
        {/* Sağa yaslı tabloda ara alanı */}
        <div className='flex flex-1 justify-end'>
          <TextField
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Tabloda ara...'
            size='small'
            variant='outlined'
            sx={{ minWidth: 180, maxWidth: 240, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
            InputProps={{
              style: {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 6
              }
            }}
          />
        </div>
      </div>
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
                  onClick={() => onSort('type')}
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
                  onClick={() => onSort('id')}
                  hideSortIcon
                >
                  Fatura No
                </TableSortLabel>
              </TableCell>
              {/* ETTN */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[120px]'>ETTN</TableCell>
              {/* Fatura Senaryosu */}
              <TableCell className='p-4 text-center align-center justify-center min-w-[120px]'>
                <TableSortLabel
                  active={orderBy === 'invoiceScript'}
                  direction={orderBy === 'invoiceScript' ? order : 'asc'}
                  onClick={() => onSort('invoiceScript')}
                  hideSortIcon
                >
                  Senaryo
                </TableSortLabel>
              </TableCell>
              {/* Tarih */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[120px] '>
                <TableSortLabel
                  active={orderBy === 'receivedAt'}
                  direction={orderBy === 'receivedAt' ? order : 'asc'}
                  onClick={() => onSort('receivedAt')}
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
                  onClick={() => onSort('vknTckn')}
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
                  onClick={() => onSort('title')}
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
                  onClick={() => onSort('nameSurname')}
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
                  onClick={() => onSort('amount')}
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
                  onClick={() => onSort('unit')}
                  hideSortIcon
                >
                  Birim
                </TableSortLabel>
              </TableCell>
              {/* Alınma Zamanı */}
              <TableCell className='p-4 text-left align-center justify-center min-w-[120px] '>
                <TableSortLabel
                  active={orderBy === 'receivedAt'}
                  direction={orderBy === 'receivedAt' ? order : 'asc'}
                  onClick={() => onSort('receivedAt')}
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
                  onClick={() => onSort('status')}
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
                  onClick={() => onSort('response')}
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
                  onClick={() => onSort('envelopeStatus')}
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
                {/* ETTN */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px]'>
                  <ETTNCell ettn={row.ettn} />
                </TableCell>
                {/* Fatura Senaryosu */}
                <TableCell className='p-4 text-center align-center justify-center min-w-[120px]'>
                  {row.invoiceScript}
                </TableCell>
                {/* Tarih */}
                <TableCell className='p-4 text-left align-center justify-center min-w-[120px]'>
                  <Tooltip
                    title={new Date(row.receivedAt).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                    arrow
                    placement='top'
                  >
                    <span>{new Date(row.receivedAt).toLocaleDateString('tr-TR')}</span>
                  </Tooltip>
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
                <TableCell className='p-4 text-left align-center justify-center min-w-[120px]'>
                  <Tooltip
                    title={new Date(row.receivedAt).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                    arrow
                    placement='top'
                  >
                    <span>{new Date(row.receivedAt).toLocaleDateString('tr-TR')}</span>
                  </Tooltip>
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
          count={filteredData.length}
          page={page}
          onPageChange={(_, value) => setPage(value)}
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
