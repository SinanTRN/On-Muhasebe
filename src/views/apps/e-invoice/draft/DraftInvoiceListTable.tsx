'use client'
import { useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'

export type DraftInvoice = {
  id: string
  invoiceNo: string
  date: string
  vknTckn: string
  title: string
  amount: number
  unit: string
  scenario: string
  type: string
}

export type DraftInvoiceListTableProps = {
  data: DraftInvoice[]
  onSelectionChange?: (selected: string[]) => void
}

const columns = [
  { id: 'checkbox', label: '', minWidth: 10 },
  { id: 'id', label: 'ID', minWidth: 60 },
  { id: 'invoiceNo', label: 'Fatura No', minWidth: 120 },
  { id: 'date', label: 'Tarih', minWidth: 120 },
  { id: 'vknTckn', label: 'VKN/TCKN', minWidth: 120 },
  { id: 'title', label: 'Unvan', minWidth: 120 },
  { id: 'amount', label: 'Tutar', minWidth: 100 },
  { id: 'unit', label: 'Birim', minWidth: 60 },
  { id: 'scenario', label: 'Senaryo', minWidth: 80 },
  { id: 'type', label: 'Tip', minWidth: 80 }
]

type Order = 'asc' | 'desc'

type ColumnKey = keyof DraftInvoice

const DraftInvoiceListTable = ({ data, onSelectionChange }: DraftInvoiceListTableProps) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<ColumnKey>('date')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState<string[]>([])

  const handleSort = (property: ColumnKey) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [order, orderBy, data])

  const pagedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = pagedData.map(n => n.id)
      setSelected(newSelected)
      onSelectionChange?.(newSelected)
      return
    }
    setSelected([])
    onSelectionChange?.([])
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
    onSelectionChange?.(newSelected)
  }

  return (
    <Card className='p-4 rounded-md shadow-md'>
      <TableContainer>
        <Table className='flex-1'>
          <TableHead>
            <TableRow>
              {/*Tüm satırları seçmek için Checkbox */}
              <TableCell className='p-4 text-center min-w-[10px]'>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < pagedData.length}
                  checked={pagedData.length > 0 && selected.length === pagedData.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'Tümünü seç' }}
                />
              </TableCell>
              {/* ID */}
              <TableCell className='p-4 text-center min-w-[60px]'>ID</TableCell>
              {/* Fatura No */}
              <TableCell className='p-4 text-center min-w-[120px]'>
                <TableSortLabel
                  active={orderBy === 'invoiceNo'}
                  direction={orderBy === 'invoiceNo' ? order : 'asc'}
                  onClick={() => handleSort('invoiceNo')}
                  hideSortIcon
                >
                  Fatura No
                </TableSortLabel>
              </TableCell>
              {/* Tarih */}
              <TableCell className='p-4 text-center min-w-[120px]'>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                  hideSortIcon
                >
                  Tarih
                </TableSortLabel>
              </TableCell>
              {/* VKN/TCKN */}
              <TableCell className='p-4 text-center min-w-[120px]'>
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
              <TableCell className='p-4 text-center min-w-[120px]'>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                  hideSortIcon
                >
                  Unvan
                </TableSortLabel>
              </TableCell>
              {/* Tutar */}
              <TableCell className='p-4 text-right min-w-[100px]'>
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
              <TableCell className='p-4 text-center min-w-[60px]'>
                <TableSortLabel
                  active={orderBy === 'unit'}
                  direction={orderBy === 'unit' ? order : 'asc'}
                  onClick={() => handleSort('unit')}
                  hideSortIcon
                >
                  Birim
                </TableSortLabel>
              </TableCell>
              {/* Senaryo */}
              <TableCell className='p-4 text-center min-w-[80px]'>
                <TableSortLabel
                  active={orderBy === 'scenario'}
                  direction={orderBy === 'scenario' ? order : 'asc'}
                  onClick={() => handleSort('scenario')}
                  hideSortIcon
                >
                  Senaryo
                </TableSortLabel>
              </TableCell>
              {/* Tip */}
              <TableCell className='p-4 text-center min-w-[80px]'>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderBy === 'type' ? order : 'asc'}
                  onClick={() => handleSort('type')}
                  hideSortIcon
                >
                  Tip
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.map(row => (
              <TableRow key={row.id} selected={isSelected(row.id)}>
                {/*Checkbox */}
                <TableCell className='p-4 text-center min-w-[10px]'>
                  <Checkbox
                    checked={isSelected(row.id)}
                    onChange={() => handleClick(row.id)}
                    inputProps={{ 'aria-label': `Seç ${row.id}` }}
                  />
                </TableCell>
                {/* ID */}
                <TableCell className='p-4 text-center min-w-[60px]'>{row.id}</TableCell>
                {/* Fatura No */}
                <TableCell className='p-4 text-center min-w-[120px]'>{row.invoiceNo}</TableCell>
                {/* Tarih */}
                <TableCell className='p-4 text-center min-w-[120px]'>
                  <Tooltip
                    title={new Date(row.date).toLocaleString('tr-TR', {
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
                    <span>{new Date(row.date).toLocaleDateString('tr-TR')}</span>
                  </Tooltip>
                </TableCell>
                {/* VKN/TCKN */}
                <TableCell className='p-4 text-center min-w-[120px]'>{row.vknTckn}</TableCell>
                {/* Unvan */}
                <TableCell className='p-4 text-center min-w-[120px]'>{row.title}</TableCell>
                {/* Tutar */}
                <TableCell className='p-4 text-right min-w-[100px]'>
                  {row.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </TableCell>
                {/* Birim */}
                <TableCell className='p-4 text-center min-w-[60px]'>{row.unit}</TableCell>
                {/* Senaryo */}
                <TableCell className='p-4 text-center min-w-[80px]'>{row.scenario}</TableCell>
                {/* Tip */}
                <TableCell className='p-4 text-center min-w-[80px]'>{row.type}</TableCell>
              </TableRow>
            ))}
            {pagedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>Kayıt bulunamadı.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={data.length}
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
    </Card>
  )
}

export default DraftInvoiceListTable 
