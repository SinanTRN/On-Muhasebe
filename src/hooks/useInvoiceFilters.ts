import { useState, useCallback } from 'react'

export interface UseInvoiceFiltersProps {
  defaultPeriod?: string
}

export function useInvoiceFilters({ defaultPeriod = 'month' }: UseInvoiceFiltersProps = {}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [invoiceScriptFilter, setInvoiceScriptFilter] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [readFilter, setReadFilter] = useState('')
  const [period, setPeriod] = useState(defaultPeriod)
  const [customer, setCustomer] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const [receivedStart, setReceivedStart] = useState<Date | null>(null)
  const [receivedEnd, setReceivedEnd] = useState<Date | null>(null)
  const [typeFilter, setTypeFilter] = useState('')

  const handleStatusFilterChange = useCallback((val: string[]) => {
    setStatusFilter(val)
  }, [])

  const handlePeriodChange = useCallback((val: string) => {
    setPeriod(val)
    setStatusFilter([])
  }, [])

  // Çoklu seçim için dışarıdan kontrol
  const setStatusFilterExternal = (val: string[] | string) => {
    if (Array.isArray(val)) setStatusFilter(val)
    else if (typeof val === 'string' && val === '') setStatusFilter([])
    else if (typeof val === 'string') setStatusFilter([val])
  }
  const setReadFilterExternal = (val: string) => setReadFilter(val)
  const setTypeFilterExternal = (val: string) => setTypeFilter(val)
  const setInvoiceScriptFilterExternal = (val: string[] | string) => {
    if (Array.isArray(val)) setInvoiceScriptFilter(val)
    else if (typeof val === 'string' && val === '') setInvoiceScriptFilter([])
    else if (typeof val === 'string') setInvoiceScriptFilter([val])
  }

  const isAnyFilterActive = !!(
    search ||
    startDate ||
    endDate ||
    readFilter ||
    (statusFilter && statusFilter.length > 0) ||
    (invoiceScriptFilter && invoiceScriptFilter.length > 0) ||
    customer ||
    referenceNo ||
    receivedStart ||
    receivedEnd ||
    typeFilter // summaryStatus da bir filtre olarak kabul edilmeli
  )

  // Tüm statü seçenekleri burada tanımlı olmalı (gerekirse dışarıdan alınabilir)
  const allStatusOptions = [
    'Alındı',
    'Kabul',
    'Yanıt bekliyor',
    'Reddedildi',
    'İptal'
  ]

  // filterFn fonksiyonu dışarıdan Invoice tipine göre parametre olarak alınmalı
  const getFilterFn = useCallback(
    (period: string, isAnyFilterActive: boolean) => (inv: any) => {
      const now = new Date()
      let periodMatch = true

      // Eğer herhangi bir filtre aktifse dönem filtresi devre dışı kalmalı
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
          periodMatch = new Date(inv.receivedAt).getMonth() === now.getMonth() && 
                       new Date(inv.receivedAt).getFullYear() === now.getFullYear()
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
        // Herhangi bir filtre aktifse dönem filtresi devre dışı
        periodMatch = true
      }

      let statusMatch = true

      if (statusFilter && statusFilter.length > 0 && statusFilter.length < allStatusOptions.length) {
        // Eğer kullanıcı 'Ret' seçtiyse, tüm ret varyasyonlarını kapsa
        if (statusFilter.includes('Ret')) {
          statusMatch = (
            inv.status.startsWith('Ret') ||
            inv.status === 'Reddedildi' ||
            inv.status === 'Kabul Başarısız' ||
            inv.status === 'Ret-Başarısız'
          )
        } else {
          statusMatch = statusFilter.includes(inv.status)
        }
      } // Hiçbiri seçili değilse veya hepsi seçiliyse tümü

      // Fatura Senaryosu filtreleme
      let invoiceScriptMatch = true
      if (invoiceScriptFilter && invoiceScriptFilter.length > 0 && invoiceScriptFilter.length < 4) {
        invoiceScriptMatch = invoiceScriptFilter.includes(inv.invoiceScript)
      }

      const typeMatch = typeFilter ? inv.type === typeFilter : true

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
        ? inv.id && inv.id.toLowerCase().includes(referenceNo.toLowerCase())
        : true

      const invoiceDate = new Date(inv.receivedAt)
      let dateMatch = true

      if (startDate && endDate) {
        // Eğer aynı günse, endDate'i gün sonuna çek
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (
          start.getFullYear() === end.getFullYear() &&
          start.getMonth() === end.getMonth() &&
          start.getDate() === end.getDate()
        ) {
          end.setHours(23, 59, 59, 999)
        }
        dateMatch = invoiceDate >= start && invoiceDate <= end
      } else if (startDate) dateMatch = invoiceDate >= startDate
      else if (endDate) {
        // Sadece bitiş tarihi seçiliyse, başlangıç tarihi bir ay öncesi olsun
        const end = new Date(endDate)
        const start = new Date(endDate)
        start.setMonth(start.getMonth() - 1)
        dateMatch = invoiceDate >= start && invoiceDate <= end
      }

      // Alınma tarihi için ek filtre
      let receivedDateMatch = true
      if (receivedStart && receivedEnd) {
        const start = new Date(receivedStart)
        const end = new Date(receivedEnd)
        if (
          start.getFullYear() === end.getFullYear() &&
          start.getMonth() === end.getMonth() &&
          start.getDate() === end.getDate()
        ) {
          end.setHours(23, 59, 59, 999)
        }
        receivedDateMatch = invoiceDate >= start && invoiceDate <= end
      } else if (receivedStart) receivedDateMatch = invoiceDate >= receivedStart
      else if (receivedEnd) {
        // Sadece alınma bitiş tarihi seçiliyse, başlangıç tarihi bir ay öncesi olsun
        const end = new Date(receivedEnd)
        const start = new Date(receivedEnd)
        start.setMonth(start.getMonth() - 1)
        receivedDateMatch = invoiceDate >= start && invoiceDate <= end
      }

      let readMatch = true

      if (readFilter === 'okundu') readMatch = inv.read === true
      else if (readFilter === 'okunmadi') readMatch = inv.read === false

      return (
        periodMatch &&
        statusMatch &&
        invoiceScriptMatch &&
        typeMatch &&
        searchMatch &&
        customerMatch &&
        referenceNoMatch &&
        dateMatch &&
        receivedDateMatch &&
        readMatch
      )
    },
    [search, startDate, endDate, readFilter, statusFilter, invoiceScriptFilter, customer, referenceNo, receivedStart, receivedEnd, typeFilter]
  )

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    setStatusFilterExternal,
    invoiceScriptFilter,
    setInvoiceScriptFilter,
    setInvoiceScriptFilterExternal,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    readFilter,
    setReadFilter,
    setReadFilterExternal,
    period,
    setPeriod: handlePeriodChange,
    customer,
    setCustomer,
    referenceNo,
    setReferenceNo,
    receivedStart,
    setReceivedStart,
    receivedEnd,
    setReceivedEnd,
    handleStatusFilterChange,
    handlePeriodChange,
    isAnyFilterActive,
    getFilterFn: () => getFilterFn(period, isAnyFilterActive),
    getFilterFnWithArgs: getFilterFn,
    setTypeFilterExternal
  }
}
