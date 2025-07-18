'use client'
import { useMemo } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceListFilterBar from '../shared/components/EInvoiceListFilterBar'
import EInvoiceSummaryBar from '../shared/components/EInvoiceSummaryBar'
import { useTableData } from '@/hooks/useTableData'
import type { Invoice } from '../shared/tables/EInvoiceListTable'
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters'

// Örnek outgoing veri
const outgoingInvoices: Invoice[] = [
  {
    id: '20240001',
    ettn: 'ETTN-1001',
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
    ettn: 'ETTN-1002',
    status: 'Ret',
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
    ettn: 'ETTN-1003',
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
    ettn: 'ETTN-1004',
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
    ettn: 'ETTN-1005',
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

  // Filtre hook'u
  const {
    search,
    setSearch,
    statusFilter,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    readFilter,
    setReadFilter,
    period,

    summaryStatus,

    handleSummaryStatusChange,
    handleStatusFilterChange,
    handlePeriodChange,
    isAnyFilterActive,
    getFilterFn
  } = useInvoiceFilters({ defaultPeriod: 'month' })

  // Custom hook ile tablo verisi yönetimi
  const table = useTableData<Invoice>({
    data: invoiceData,
    filterFn: getFilterFn(),
    orderByDefault: 'receivedAt',
    orderDefault: 'desc',
    pageDefault: 0,
    rowsPerPageDefault: 10
  })

  // SummaryBar'a göndereceğimiz fonksiyonlar:
  const handleSummaryStatusChangeWithPage = (val: string) => {
    handleSummaryStatusChange(val)
    table.setPage(0) // ilk sayfa
  }

  const handlePeriodChangeWithPage = (val: string) => {
    handlePeriodChange(val)
    table.setPage(0) // ilk sayfa
  }

  const handleStatusFilterChangeWithPage = (val:string) => {
    handleStatusFilterChange(val)
    table.setPage(0)
  }

  return (
    <Stack spacing={2}>
      <EInvoiceSummaryBar
        invoices={invoiceData}
        selectedPeriod={period}
        onPeriodChange={handlePeriodChangeWithPage}
        selectedStatus={summaryStatus}
        onStatusChange={handleSummaryStatusChangeWithPage}
        hidden={isAnyFilterActive}
      />
      <EInvoiceListFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChangeWithPage}
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
