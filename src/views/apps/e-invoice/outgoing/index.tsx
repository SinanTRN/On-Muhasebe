'use client'
import { useMemo, useState } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceSummaryBar from '../shared/components/EInvoiceSummaryBar'
import { useTableData } from '@/hooks/useTableData'
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters'
import type { Invoice } from '../shared/tables/EInvoiceListTable'

const EInvoiceOutgoing = () => {
  const invoiceData = useMemo(() => [
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
      read: true,
      invoiceScript: 'TİCARİ'
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
      read: false,
      invoiceScript: 'TEMEL'
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
      read: false,
      invoiceScript: 'KAMU'
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
      read: true,
      invoiceScript: 'İHRACAT'
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
      read: false,
      invoiceScript: 'TEMEL'
    }
  ], [])

  // useInvoiceFilters hook'unu parentta kullan
  const {
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    customer,
    setCustomer,
    referenceNo,
    setReferenceNo,
    getFilterFn
  } = useInvoiceFilters()

  // Draft filtre state'i
  const [draftFilters, setDraftFilters] = useState({
    referenceNo: '',
    customer: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  })

  // Ara butonuna basınca draft'ı hook'a aktar
  const handleApplyFilters = () => {
    setReferenceNo(draftFilters.referenceNo)
    setCustomer(draftFilters.customer)
    setStartDate(draftFilters.startDate)
    setEndDate(draftFilters.endDate)
  }

  // Temizle butonu hem draft'ı hem hook'u sıfırlar
  const handleReset = () => {
    setDraftFilters({ referenceNo: '', customer: '', startDate: null, endDate: null })
    setReferenceNo('')
    setCustomer('')
    setStartDate(null)
    setEndDate(null)
    setSearch('')
  }

  // Filtre fonksiyonu
  const filterFn = (inv: Invoice) => getFilterFn()(inv)

  const table = useTableData<Invoice>({
    data: invoiceData,
    filterFn,
    orderByDefault: 'receivedAt',
    orderDefault: 'desc',
    pageDefault: 0,
    rowsPerPageDefault: 10
  })

  // SummaryBar event fonksiyonları
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const isAnyFilterActive = !!(referenceNo || customer || startDate || endDate)
  const handlePeriodChange = (val: string) => setSelectedPeriod(val)
  const handleStatusChange = (val: string) => setSelectedStatus(val)

  return (
    <Stack spacing={2}>
      <EInvoiceSummaryBar
        invoices={invoiceData}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        hidden={isAnyFilterActive}
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
        totalCount={table.totalCount}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleReset}
        search={search}
        setSearch={setSearch}
        startDate={startDate}
        endDate={endDate}
        customer={customer}
        referenceNo={referenceNo}
      />
    </Stack>
  )
}

export default EInvoiceOutgoing
