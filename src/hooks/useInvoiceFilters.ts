import { useState, useCallback } from 'react'

export interface UseInvoiceFiltersProps {
  defaultPeriod?: string
}

export function useInvoiceFilters({ defaultPeriod = 'month' }: UseInvoiceFiltersProps = {}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [readFilter, setReadFilter] = useState('')
  const [period, setPeriod] = useState(defaultPeriod)
  const [summaryStatus, setSummaryStatus] = useState('')
  const [customer, setCustomer] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const [receivedStart, setReceivedStart] = useState<Date | null>(null)
  const [receivedEnd, setReceivedEnd] = useState<Date | null>(null)

  const handleSummaryStatusChange = useCallback((val: string) => {
    setSummaryStatus(prev => (prev === val ? '' : val))
  }, [])

  const handleStatusFilterChange = useCallback((val: string) => {
    setStatusFilter(val)
  }, [])

  const handlePeriodChange = useCallback((val: string) => {
    setPeriod(val)
    setSummaryStatus('')
    setStatusFilter('')
  }, [])

  const isAnyFilterActive = !!(
    search ||
    startDate ||
    endDate ||
    readFilter ||
    statusFilter ||
    customer ||
    referenceNo ||
    receivedStart ||
    receivedEnd
  )

  // filterFn fonksiyonu dışarıdan Invoice tipine göre parametre olarak alınmalı
  const getFilterFn = useCallback(
    (summaryStatus: string, period: string, isAnyFilterActive: boolean) => (inv: any) => {
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
        periodMatch = true
      }

      let statusMatch = true

      if (!isAnyFilterActive && summaryStatus) {
        if (summaryStatus === 'yeni')
          statusMatch = inv.status === 'Alındı' || inv.status === 'Yeni' || inv.status === 'YENİ GELEN'
        else if (summaryStatus === 'okundu') statusMatch = inv.read === true
        else if (summaryStatus === 'kabul') statusMatch = inv.status === 'Kabul' || inv.status === 'Kanunen Kabul'
        else if (summaryStatus === 'yanit')
          statusMatch = inv.status === 'Yanıt bekliyor' || inv.status === 'YANIT BEKLEYEN'
        else if (summaryStatus === 'red')
          statusMatch =
            inv.status.startsWith('Ret') ||
            inv.status === 'Kabul Başarısız' ||
            inv.status === 'Reddedildi' ||
            inv.status === 'REDDEDİLEN'
      } else if (statusFilter) {
        statusMatch = inv.status === statusFilter
      }

      const searchMatch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.vknTckn.toLowerCase().includes(search.toLowerCase()) ||
        inv.title.toLowerCase().includes(search.toLowerCase()) ||
        inv.nameSurname.toLowerCase().includes(search.toLowerCase())

      // customer ve referenceNo için ek filtre
      const customerMatch = customer
        ? inv.title.toLowerCase().includes(customer.toLowerCase()) ||
          inv.vknTckn.toLowerCase().includes(customer.toLowerCase())
        : true
      const referenceNoMatch = referenceNo
        ? inv.ettn && inv.ettn.toLowerCase().includes(referenceNo.toLowerCase())
        : true

      const invoiceDate = new Date(inv.receivedAt)
      let dateMatch = true

      if (startDate && endDate) dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
      else if (startDate) dateMatch = invoiceDate >= startDate
      else if (endDate) dateMatch = invoiceDate <= endDate

      // Alınma tarihi için ek filtre
      let receivedDateMatch = true
      if (receivedStart && receivedEnd) receivedDateMatch = invoiceDate >= receivedStart && invoiceDate <= receivedEnd
      else if (receivedStart) receivedDateMatch = invoiceDate >= receivedStart
      else if (receivedEnd) receivedDateMatch = invoiceDate <= receivedEnd

      let readMatch = true

      if (readFilter === 'okundu') readMatch = inv.read === true
      else if (readFilter === 'okunmadi') readMatch = inv.read === false

      return (
        periodMatch &&
        statusMatch &&
        searchMatch &&
        customerMatch &&
        referenceNoMatch &&
        dateMatch &&
        receivedDateMatch &&
        readMatch
      )
    },
    [search, startDate, endDate, readFilter, statusFilter, customer, referenceNo, receivedStart, receivedEnd]
  )

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    readFilter,
    setReadFilter,
    period,
    setPeriod: handlePeriodChange,
    summaryStatus,
    setSummaryStatus: handleSummaryStatusChange,
    customer,
    setCustomer,
    referenceNo,
    setReferenceNo,
    receivedStart,
    setReceivedStart,
    receivedEnd,
    setReceivedEnd,
    handleSummaryStatusChange,
    handleStatusFilterChange,
    handlePeriodChange,
    isAnyFilterActive,
    getFilterFn: () => getFilterFn(summaryStatus, period, isAnyFilterActive)
  }
}
