'use client'
import { useState, useMemo } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceListFilterBar from '../shared/components/EInvoiceListFilterBar'
import { useTableData } from '@/hooks/useTableData'
import type { Invoice } from '../shared/tables/EInvoiceListTable'

// Örnek outgoing veri
const outgoingInvoices: Invoice[] = [
  {
    id: '20240001',
    status: 'Kabul',
    vknTckn: '12345678901',
    title: 'Çıkış Müşterisi',
    nameSurname: 'Ahmet Çıkış',
    type: 'E-Arşiv',
    amount: 1500,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'Ulaştırıldı',
    envelopeStatus: 'Başarılı',
    read: true
  },
  {
    id: '20240002',
    status: 'Red',
    vknTckn: '23456789012',
    title: 'Beta Ltd. Şti.',
    nameSurname: 'Mehmet Yılmaz',
    type: 'E-Fatura',
    amount: 2300,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'Reddedildi',
    envelopeStatus: 'Başarısız',
    read: false
  },
  {
    id: '20240003',
    status: 'Bekliyor',
    vknTckn: '34567890123',
    title: 'Gamma A.Ş.',
    nameSurname: 'Ayşe Demir',
    type: 'E-Arşiv',
    amount: 750,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'Bekliyor',
    envelopeStatus: 'İşleniyor',
    read: false
  },
  {
    id: '20240004',
    status: 'Kabul',
    vknTckn: '45678901234',
    title: 'Delta İnşaat',
    nameSurname: 'Fatma Korkmaz',
    type: 'E-Fatura',
    amount: 5400,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'Ulaştırıldı',
    envelopeStatus: 'Başarılı',
    read: true
  },
  {
    id: '20240005',
    status: 'İptal',
    vknTckn: '56789012345',
    title: 'Epsilon Tekstil',
    nameSurname: 'Mustafa Kaya',
    type: 'E-Arşiv',
    amount: 1200,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'İptal Edildi',
    envelopeStatus: 'Başarısız',
    read: false
  }
]

const EInvoiceOutgoing = () => {
  const invoiceData = useMemo(() => outgoingInvoices, [])

  // Filtre state'leri
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [readFilter, setReadFilter] = useState('')

  // Filtreleme fonksiyonu
  const filterFn = (inv: Invoice) => {
    const searchMatch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.vknTckn.toLowerCase().includes(search.toLowerCase()) ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.nameSurname.toLowerCase().includes(search.toLowerCase())

    const statusMatch = !statusFilter || inv.status === statusFilter
    const invoiceDate = new Date(inv.receivedAt)
    let dateMatch = true

    if (startDate && endDate) dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
    else if (startDate) dateMatch = invoiceDate >= startDate
    else if (endDate) dateMatch = invoiceDate <= endDate
    let readMatch = true

    if (readFilter === 'okundu') readMatch = inv.read === true
    else if (readFilter === 'okunmadi') readMatch = inv.read === false

    return statusMatch && searchMatch && dateMatch && readMatch
  }

  // Custom hook ile tablo verisi yönetimi
  const table = useTableData<Invoice>({
    data: invoiceData,
    filterFn,
    orderByDefault: 'receivedAt',
    orderDefault: 'desc',
    pageDefault: 0,
    rowsPerPageDefault: 10
  })

  return (
    <Stack spacing={2}>
      <EInvoiceListFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        readFilter={readFilter}
        setReadFilter={setReadFilter}
      />
      <EInvoiceListTable
        data={table.pagedData}
        order={table.order}
        orderBy={table.orderBy}
        onSort={table.handleSort}
        page={table.page}
        setPage={table.setPage}
        rowsPerPage={table.rowsPerPage}
        setRowsPerPage={table.setRowsPerPage}
        totalCount={table.sortedData.length}
      />
    </Stack>
  )
}

export default EInvoiceOutgoing
