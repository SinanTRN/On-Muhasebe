'use client'
import { useMemo, useState } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceListFilterBar from '../shared/components/EInvoiceListFilterBar'
import { useTableData } from '@/hooks/useTableData'
import type { Invoice } from '../shared/tables/EInvoiceListTable'

interface Filters {
  invoiceNo: string
  customer: string
  invoiceStart: Date | null
  invoiceEnd: Date | null
}

const initialFilters: Filters = {
  invoiceNo: '',
  customer: '',
  invoiceStart: null,
  invoiceEnd: null
}

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

  const [draftFilters, setDraftFilters] = useState<Filters>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters)

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
  }

  const handleReset = () => {
    setDraftFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  // Sadece sadeleştirilmiş alanlara göre filtreleme yapan fonksiyon
  const filterFn = (inv: Invoice) => {
    const invoiceNoMatch = appliedFilters.invoiceNo === '' || inv.id.toLowerCase().includes(appliedFilters.invoiceNo.toLowerCase())
    const customerMatch = appliedFilters.customer === '' || inv.title.toLowerCase().includes(appliedFilters.customer.toLowerCase()) || inv.vknTckn.toLowerCase().includes(appliedFilters.customer.toLowerCase())
    let dateMatch = true
    if (appliedFilters.invoiceStart && appliedFilters.invoiceEnd) {
      const start = new Date(appliedFilters.invoiceStart)
      const end = new Date(appliedFilters.invoiceEnd)
      const invDate = new Date(inv.receivedAt)
      dateMatch = invDate >= start && invDate <= end
    } else if (appliedFilters.invoiceStart) {
      const start = new Date(appliedFilters.invoiceStart)
      const invDate = new Date(inv.receivedAt)
      dateMatch = invDate >= start
    } else if (appliedFilters.invoiceEnd) {
      const end = new Date(appliedFilters.invoiceEnd)
      const invDate = new Date(inv.receivedAt)
      dateMatch = invDate <= end
    }
    return invoiceNoMatch && customerMatch && dateMatch
  }

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
        filters={draftFilters}
        setFilters={setDraftFilters}
        onSearch={handleSearch}
        onReset={handleReset}
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
      />
    </Stack>
  )
}

export default EInvoiceOutgoing
