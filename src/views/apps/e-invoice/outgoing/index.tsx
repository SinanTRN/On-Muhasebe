'use client'
import { useMemo, useState, useEffect } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceSummaryBar from '../shared/components/EInvoiceSummaryBar'
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters'
import { useTableSortAndPagination } from '@/hooks/useTableSortAndPagination'
import { getOutgoingInvoices } from '@/data/sampleInvoices'

const EInvoiceOutgoing = () => {
  const invoiceData = useMemo(() => getOutgoingInvoices(), [])

  // useInvoiceFilters hook'unu kullan
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
    period,
    setPeriod,
    isAnyFilterActive,
    getFilterFn,
    getFilterFnWithArgs,
    setInvoiceScriptFilter,
    invoiceScriptFilter,
    statusFilter,
    setStatusFilter
  } = useInvoiceFilters({ defaultPeriod: 'month' })

  // Sıralama ve sayfalama için custom hook
  const [draftFilters, setDraftFilters] = useState({
    referenceNo: '',
    customer: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    invoiceScript: [] as string[],
    status: [] as string[]
  })

  // Ara butonuna basınca draft'ı hook'a aktar
  const handleApplyFilters = () => {
    // Eğer tarih alanları boşsa ve diğer filtreler seçiliyse, son 30 günü seç
    let startDateToSet = draftFilters.startDate
    let endDateToSet = draftFilters.endDate
    
    if (!draftFilters.startDate && !draftFilters.endDate && 
        (draftFilters.status.length > 0 || draftFilters.invoiceScript.length > 0)) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 30)
      
      startDateToSet = startDate
      endDateToSet = endDate
      
      // DraftFilters state'ini de güncelle ki kullanıcı tarih alanlarında görebilsin
      setDraftFilters(prev => ({
        ...prev,
        startDate: startDate,
        endDate: endDate
      }))
    }
    
    setReferenceNo(draftFilters.referenceNo)
    setCustomer(draftFilters.customer)
    setStartDate(startDateToSet)
    setEndDate(endDateToSet)
    setInvoiceScriptFilter(draftFilters.invoiceScript)
    setStatusFilter(draftFilters.status)
    setPage(0) // Filtre uygulandığında ilk sayfaya dön
  }

  // Temizle butonu hem draft'ı hem hook'u sıfırlar
  const handleReset = () => {
    setDraftFilters({ referenceNo: '', customer: '', startDate: null, endDate: null, invoiceScript: [], status: [] })
    setReferenceNo('')
    setCustomer('')
    setStartDate(null)
    setEndDate(null)
    setInvoiceScriptFilter([])
    setStatusFilter([])
    setSearch('')
    setPage(0) // Filtre temizlendiğinde ilk sayfaya dön
  }

  // Filtre değişikliklerini izle ve sayfa sıfırla
  useEffect(() => {
    setPage(0)
  }, [search, startDate, endDate, customer, referenceNo, period, invoiceScriptFilter, statusFilter])

  // Filtrelenmiş veriler
  const filteredInvoices = invoiceData.filter(getFilterFn())

  // Sıralama ve sayfalama
  const { order, orderBy, page, setPage, rowsPerPage, setRowsPerPage, handleSort, pagedData } = useTableSortAndPagination(
    filteredInvoices,
    'receivedAt',
    'desc',
    10
  )

  return (
    <Stack spacing={2}>
      <EInvoiceSummaryBar
        invoices={filteredInvoices}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        hidden={false}
      />
      <EInvoiceListTable
        data={pagedData}
        order={order}
        orderBy={orderBy}
        onSort={handleSort}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalCount={filteredInvoices.length}
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
        period={period}
        setPeriod={setPeriod}
        invoiceScript={invoiceScriptFilter}
        status={statusFilter}
      />
    </Stack>
  )
}

export default EInvoiceOutgoing
