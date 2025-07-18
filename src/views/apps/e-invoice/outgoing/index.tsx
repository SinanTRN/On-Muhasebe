'use client'
import { useState, useMemo } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceListFilterBar from '../shared/components/EInvoiceListFilterBar'
import EInvoiceSummaryBar from '../shared/components/EInvoiceSummaryBar'
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
  const [period, setPeriod] = useState('month')
  const [summaryStatus, setSummaryStatus] = useState('')

  // Statü kutusuna tıklanınca sadece summaryStatus güncellenir
  const handleSummaryStatusChange = (val: string) => {
    if (summaryStatus === val) {
      setSummaryStatus('')
    } else {
      setSummaryStatus(val)
    }
  }

  // Üst filtre barındaki statü filtresi değişince sadece statusFilter güncellenir
  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val)
  }

  // Dönem değiştiğinde summaryStatus (veya seçili statü) de sıfırlansın. Böylece tablo ve özet kutuları aynı döneme göre güncellenir.
  const handlePeriodChange = (val: string) => {
    setPeriod(val)
    setSummaryStatus('')
    setStatusFilter('')
  }

  // Aktif filtre kontrolü
  const isAnyFilterActive = !!(search || startDate || endDate || readFilter || statusFilter)

  // Filtreleme fonksiyonu
  const filterFn = (inv: Invoice) => {
    // Dönem filtresi
    const now = new Date()
    let periodMatch = true

    if (!isAnyFilterActive) {
      if (period === '1') {
        const d = new Date(now)

        d.setDate(now.getDate() - 1)
        periodMatch = new Date(inv.receivedAt) >= d
      } else if (period === '7') {
        const d = new Date(now)

        d.setDate(now.getDate() - 7)
        periodMatch = new Date(inv.receivedAt) >= d
      } else if (period === '30') {
        const d = new Date(now)

        d.setDate(now.getDate() - 30)
        periodMatch = new Date(inv.receivedAt) >= d
      } else if (period === 'month') {
        periodMatch = new Date(inv.receivedAt).getMonth() === now.getMonth()
      } else if (period === 'lastMonth') {
        const date = new Date(inv.receivedAt)
        const lastMonth = new Date(now)

        lastMonth.setMonth(now.getMonth() - 1)
        periodMatch = date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
      } else if (period === '60') {
        const d = new Date(now)

        d.setDate(now.getDate() - 60)
        periodMatch = new Date(inv.receivedAt) >= d
      } else if (period === '90') {
        const d = new Date(now)

        d.setDate(now.getDate() - 90)
        periodMatch = new Date(inv.receivedAt) >= d
      }
    } else {
      periodMatch = true // Herhangi bir filtre aktifse dönem filtresi uygulanmaz
    }

    // Statü kutusu ve üst filtre barı statü filtresi
    let statusMatch = true

    if (!isAnyFilterActive && summaryStatus) {
      // Sadece özet kutusu filtresi aktifse
      if (summaryStatus === 'yeni')
        statusMatch = inv.status === 'Alındı' || inv.status === 'Yeni' || inv.status === 'YENİ GELEN'
      else if (summaryStatus === 'okundu') statusMatch = inv.read === true
      else if (summaryStatus === 'kabul') statusMatch = inv.status === 'Kabul' || inv.status === 'Kanunen Kabul'
      else if (summaryStatus === 'yanit')
        statusMatch = inv.status === 'Yanıt bekliyor' || inv.status === 'YANIT BEKLEYEN'
      else if (summaryStatus === 'red')
        statusMatch =
          inv.status.startsWith('Ret') ||
          inv.status === 'Reddedildi' ||
          inv.status === 'REDDEDİLEN' ||
          inv.status === 'İptal'
    } else if (statusFilter) {
      // Üst filtre barındaki statü filtresi aktifse
      statusMatch = inv.status === statusFilter
    }

    // Diğer filtreler
    const searchMatch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.vknTckn.toLowerCase().includes(search.toLowerCase()) ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.nameSurname.toLowerCase().includes(search.toLowerCase())

    const invoiceDate = new Date(inv.receivedAt)
    let dateMatch = true

    if (startDate && endDate) dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
    else if (startDate) dateMatch = invoiceDate >= startDate
    else if (endDate) dateMatch = invoiceDate <= endDate
    let readMatch = true

    if (readFilter === 'okundu') readMatch = inv.read === true
    else if (readFilter === 'okunmadi') readMatch = inv.read === false

    return periodMatch && statusMatch && searchMatch && dateMatch && readMatch
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
      <EInvoiceSummaryBar
        invoices={invoiceData}
        selectedPeriod={period}
        onPeriodChange={handlePeriodChange}
        selectedStatus={summaryStatus}
        onStatusChange={handleSummaryStatusChange}
        hidden={isAnyFilterActive}
      />
      <EInvoiceListFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
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
