'use client'
import EInvoiceListTable from '../shared/EInvoiceListTable'
import EInvoiceListFilterBar from '../shared/EInvoiceListFilterBar'
import { useState, useMemo } from 'react'
import {Stack} from '@mui/material'

// Örnek outgoing veri
const outgoingInvoices = [
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
  }
]

const EInvoiceOutgoing = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [readFilter, setReadFilter] = useState('')

  const filteredData = useMemo(() => {
    return outgoingInvoices.filter(inv => {
      const searchMatch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.vknTckn.toLowerCase().includes(search.toLowerCase()) ||
        inv.title.toLowerCase().includes(search.toLowerCase()) ||
        inv.nameSurname.toLowerCase().includes(search.toLowerCase())
      const statusMatch = !statusFilter || inv.status === statusFilter
      const invoiceDate = new Date(inv.receivedAt)
      let dateMatch = true
      if (startDate && endDate) {
        dateMatch = invoiceDate >= startDate && invoiceDate <= endDate
      } else if (startDate) {
        dateMatch = invoiceDate >= startDate
      } else if (endDate) {
        dateMatch = invoiceDate <= endDate
      }
      let readMatch = true
      if (readFilter === 'okundu') readMatch = inv.read === true
      else if (readFilter === 'okunmadi') readMatch = inv.read === false
      return statusMatch && searchMatch && dateMatch && readMatch
    })
  }, [search, statusFilter, startDate, endDate, readFilter])

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
      <EInvoiceListTable invoiceData={filteredData} />
    </Stack>
  )
}

export default EInvoiceOutgoing 
