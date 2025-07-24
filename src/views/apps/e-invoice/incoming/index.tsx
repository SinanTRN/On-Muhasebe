'use client'
import { useMemo, useState } from 'react'

import { Stack } from '@mui/material'

import EInvoiceListTable from '../shared/tables/EInvoiceListTable'
import EInvoiceSummaryBar from '../shared/components/EInvoiceSummaryBar'
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters'
import type { Invoice } from '../shared/tables/EInvoiceListTable'

const EInvoiceIncoming = () => {
  const invoiceData: Invoice[] = useMemo(
    () => [
      {
        id: 'EFTR-2025001',
        ettn: 'ETTN-0001',
        vknTckn: '12345678901',
        title: 'ABC Ltd. Şti.',
        nameSurname: 'Ali Veli',
        type: 'E-Fatura',
        amount: 12500.75,
        unit: 'TRY',
        receivedAt: '2025-06-01T10:15:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025002',
        ettn: 'ETTN-0002',
        vknTckn: '98765432109',
        title: 'MNO Bilişim',
        nameSurname: 'Ayşe Demir',
        type: 'E-Arşiv',
        amount: 9800.0,
        unit: 'TRY',
        receivedAt: '2025-06-02T11:20:00',
        status: 'Yanıt bekliyor',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025003',
        ettn: 'ETTN-0003',
        vknTckn: '11122233344',
        title: 'QRS Yazılım',
        nameSurname: 'Mehmet Yılmaz',
        type: 'E-Fatura',
        amount: 4500.5,
        unit: 'TRY',
        receivedAt: '2025-04-03T09:45:00',
        status: 'Kabul',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025004',
        ettn: 'ETTN-0004',
        vknTckn: '55566677788',
        title: 'Beta Teknoloji',
        nameSurname: 'Fatma Kaya',
        type: 'E-Fatura',
        amount: 3200.0,
        unit: 'TRY',
        receivedAt: '2025-06-04T14:10:00',
        status: 'Kabul Başarısız',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Hatalı',
        read: false,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025005',
        ettn: 'ETTN-0005',
        vknTckn: '22233344455',
        title: 'Delta Sistem',
        nameSurname: 'Caner Toprak',
        type: 'E-Arşiv',
        amount: 7600.8,
        unit: 'TRY',
        receivedAt: '2025-06-05T16:30:00',
        status: 'Beklenen sürede tamamlanmadı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025006',
        ettn: 'ETTN-0006',
        vknTckn: '33344455566',
        title: 'Sigma Yazılım',
        nameSurname: 'Zeynep Aksoy',
        type: 'E-Fatura',
        amount: 21500.25,
        unit: 'TRY',
        receivedAt: '2025-06-06T13:00:00',
        status: 'Ret',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Başarılı',
        read: false,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025007',
        ettn: 'ETTN-0007',
        vknTckn: '44455566677',
        title: 'Omicron Bilgisayar',
        nameSurname: 'Burak Şahin',
        type: 'E-Fatura',
        amount: 5400.0,
        unit: 'TRY',
        receivedAt: '2025-06-07T08:50:00',
        status: 'Ret - Başarısız',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Hatalı',
        read: true,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025008',
        ettn: 'ETTN-0008',
        vknTckn: '55566677799',
        title: 'Alfa Teknoloji',
        nameSurname: 'Elif Güneş',
        type: 'E-Arşiv',
        amount: 11800.0,
        unit: 'TRY',
        receivedAt: '2025-06-08T17:25:00',
        status: 'Beklenen sürede tamamlanmadı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025009',
        ettn: 'ETTN-0009',
        vknTckn: '66677788800',
        title: 'Vega Danışmanlık',
        nameSurname: 'Murat Öz',
        type: 'E-Fatura',
        amount: 3300.0,
        unit: 'TRY',
        receivedAt: '2025-06-09T12:40:00',
        status: 'Alındı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025010',
        ettn: 'ETTN-0010',
        vknTckn: '77788899911',
        title: 'Orion Elektronik',
        nameSurname: 'Seda Korkmaz',
        type: 'E-Fatura',
        amount: 2750.45,
        unit: 'TRY',
        receivedAt: '2025-06-10T15:55:00',
        status: 'Yanıt bekliyor',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025011',
        ettn: 'ETTN-0011',
        vknTckn: '88899900022',
        title: 'Nova Medya',
        nameSurname: 'Yunus Karaca',
        type: 'E-Fatura',
        amount: 8800.0,
        unit: 'TRY',
        receivedAt: '2025-06-11T09:00:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025012',
        ettn: 'ETTN-0012',
        vknTckn: '99900011133',
        title: 'Penta Yazılım',
        nameSurname: 'Hilal Öztürk',
        type: 'E-Arşiv',
        amount: 6900.0,
        unit: 'TRY',
        receivedAt: '2025-06-12T10:30:00',
        status: 'Yanıt bekliyor',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025013',
        ettn: 'ETTN-0013',
        vknTckn: '00011122244',
        title: 'Lambda Mühendislik',
        nameSurname: 'Kerem Aras',
        type: 'E-Fatura',
        amount: 13400.2,
        unit: 'TRY',
        receivedAt: '2025-06-13T11:00:00',
        status: 'Kabul',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Hatalı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025014',
        ettn: 'ETTN-0014',
        vknTckn: '11122233355',
        title: 'Theta Telekom',
        nameSurname: 'Sevgi Tan',
        type: 'E-Fatura',
        amount: 7200.0,
        unit: 'TRY',
        receivedAt: '2025-06-14T13:15:00',
        status: 'Kabul',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Başarılı',
        read: false,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025015',
        ettn: 'ETTN-0015',
        vknTckn: '22233344466',
        title: 'Zeta Güvenlik',
        nameSurname: 'İsmail Kurt',
        type: 'E-Arşiv',
        amount: 8600.0,
        unit: 'TRY',
        receivedAt: '2025-06-15T14:00:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Beklemede',
        read: true,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025016',
        ettn: 'ETTN-0016',
        vknTckn: '33344455577',
        title: 'Gamma Web',
        nameSurname: 'Selin Yılmaz',
        type: 'E-Fatura',
        amount: 9700.0,
        unit: 'TRY',
        receivedAt: '2025-06-16T12:10:00',
        status: 'Alındı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Başarılı',
        read: false,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025017',
        ettn: 'ETTN-0017',
        vknTckn: '44455566688',
        title: 'Omega Lojistik',
        nameSurname: 'Tuncay Arı',
        type: 'E-Fatura',
        amount: 3400.0,
        unit: 'TRY',
        receivedAt: '2025-06-17T08:00:00',
        status: 'Alındı',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Hatalı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025018',
        ettn: 'ETTN-0018',
        vknTckn: '55566677700',
        title: 'Kappa Teknoloji',
        nameSurname: 'Aslı Bilgin',
        type: 'E-Arşiv',
        amount: 4400.55,
        unit: 'TRY',
        receivedAt: '2025-06-18T16:20:00',
        status: 'Alındı',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025019',
        ettn: 'ETTN-0019',
        vknTckn: '66677788899',
        title: 'Iota Yazılım',
        nameSurname: 'Gökhan Uçar',
        type: 'E-Fatura',
        amount: 5100.0,
        unit: 'TRY',
        receivedAt: '2025-06-19T10:45:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025020',
        ettn: 'ETTN-0020',
        vknTckn: '77788899900',
        title: 'Eta Enerji',
        nameSurname: 'Büşra Demir',
        type: 'E-Arşiv',
        amount: 8300.0,
        unit: 'TRY',
        receivedAt: '2025-06-20T15:30:00',
        status: 'Alındı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025021',
        ettn: 'ETTN-0021',
        vknTckn: '88899900033',
        title: 'Teta Ajans',
        nameSurname: 'Emre Duru',
        type: 'E-Arşiv',
        amount: 9300.0,
        unit: 'TRY',
        receivedAt: '2025-06-21T09:45:00',
        status: 'Alındı',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Beklemede',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025022',
        ettn: 'ETTN-0022',
        vknTckn: '99900011144',
        title: 'Mu Bilgisayar',
        nameSurname: 'Nazlı Özkan',
        type: 'E-Fatura',
        amount: 11000.0,
        unit: 'TRY',
        receivedAt: '2025-06-22T13:30:00',
        status: 'Alındı',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Başarılı',
        read: false,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025023',
        ettn: 'ETTN-0023',
        vknTckn: '00011122255',
        title: 'Nu Yazılım',
        nameSurname: 'Barış Yıldız',
        type: 'E-Fatura',
        amount: 4400.4,
        unit: 'TRY',
        receivedAt: '2025-06-23T14:20:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Hatalı',
        read: true,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025024',
        ettn: 'ETTN-0024',
        vknTckn: '11122233366',
        title: 'Xi Medya',
        nameSurname: 'Derya Gül',
        type: 'E-Arşiv',
        amount: 6200.0,
        unit: 'TRY',
        receivedAt: '2025-06-24T10:10:00',
        status: 'Alındı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025025',
        ettn: 'ETTN-0025',
        vknTckn: '22233344477',
        title: 'Om Yazılım',
        nameSurname: 'Serkan Polat',
        type: 'E-Fatura',
        amount: 3900.0,
        unit: 'TRY',
        receivedAt: '2025-06-25T11:50:00',
        status: 'Alındı',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Başarılı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025026',
        ettn: 'ETTN-0026',
        vknTckn: '33344455588',
        title: 'San Telekom',
        nameSurname: 'Gizem Akın',
        type: 'E-Arşiv',
        amount: 15000.0,
        unit: 'TRY',
        receivedAt: '2025-06-26T15:40:00',
        status: 'Alındı',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Hatalı',
        read: false,
        invoiceScript: 'İHRACAT'
      },
      {
        id: 'EFTR-2025027',
        ettn: 'ETTN-0027',
        vknTckn: '44455566699',
        title: 'Pi Çözümleri',
        nameSurname: 'Mert Ekin',
        type: 'E-Fatura',
        amount: 10200.0,
        unit: 'TRY',
        receivedAt: '2025-06-27T09:35:00',
        status: 'Alındı',
        response: 'Ulaştırıldı',
        envelopeStatus: 'Beklemede',
        read: true,
        invoiceScript: 'TEMEL'
      },
      {
        id: 'EFTR-2025028',
        ettn: 'ETTN-0028',
        vknTckn: '55566677711',
        title: 'Rho Network',
        nameSurname: 'Ece Yıldırım',
        type: 'E-Fatura',
        amount: 7100.0,
        unit: 'TRY',
        receivedAt: '2025-06-28T13:25:00',
        status: 'Alındı',
        response: 'Yanıt Bekliyor',
        envelopeStatus: 'Başarılı',
        read: false,
        invoiceScript: 'TİCARİ'
      },
      {
        id: 'EFTR-2025029',
        ettn: 'ETTN-0029',
        vknTckn: '66677788822',
        title: 'Psi Yazılım',
        nameSurname: 'Onur Kılıç',
        type: 'E-Arşiv',
        amount: 5400.0,
        unit: 'TRY',
        receivedAt: '2025-06-29T12:15:00',
        status: 'Alındı',
        response: 'Yanıt Gerekmiyor',
        envelopeStatus: 'Hatalı',
        read: true,
        invoiceScript: 'KAMU'
      },
      {
        id: 'EFTR-2025030',
        ettn: 'ETTN-0030',
        vknTckn: '77788899933',
        title: 'Chi Teknoloji',
        nameSurname: 'Melis Şen',
        type: 'E-Fatura',
        amount: 12600.0,
        unit: 'TRY',
        receivedAt: '2025-06-30T14:55:00',
        status: 'Alındı',
        response: 'Teyit Ediniz',
        envelopeStatus: 'Beklemede',
        read: false,
        invoiceScript: 'İHRACAT'
      }
    ],
    []
  )

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
    summaryStatus,
    setSummaryStatus,
    isAnyFilterActive,
    getFilterFn,
    getFilterFnWithArgs,
    invoiceScriptFilter,
    setInvoiceScriptFilter
  } = useInvoiceFilters({ defaultPeriod: 'month' })

  // Sıralama ve sayfalama state'leri
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<keyof Invoice>('receivedAt')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Draft filtre state'i
  const [draftFilters, setDraftFilters] = useState({
    referenceNo: '',
    customer: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    invoiceScript: [] as string[]
  })

  // Ara butonuna basınca draft'ı hook'a aktar
  const handleApplyFilters = () => {
    setReferenceNo(draftFilters.referenceNo)
    setCustomer(draftFilters.customer)
    setStartDate(draftFilters.startDate)
    setEndDate(draftFilters.endDate)
    setInvoiceScriptFilter(draftFilters.invoiceScript)
  }

  // Temizle butonu hem draft'ı hem hook'u sıfırlar
  const handleReset = () => {
    setDraftFilters({ referenceNo: '', customer: '', startDate: null, endDate: null, invoiceScript: [] })
    setReferenceNo('')
    setCustomer('')
    setStartDate(null)
    setEndDate(null)
    setInvoiceScriptFilter([])
    setSearch('')
  }

  // Tablo için: summaryStatus dahil tüm filtreler
  const filteredInvoices = invoiceData.filter(getFilterFn())

  // SummaryBar için: summaryStatus='' ile filtrele (sadece dönem ve filterbar)
  const summaryBarInvoices = invoiceData.filter(getFilterFnWithArgs('', period, isAnyFilterActive))

  // Sıralama fonksiyonu
  const handleSort = (property: keyof Invoice) => {
    if (orderBy === property) setOrder(order === 'asc' ? 'desc' : 'asc')
    else {
      setOrder('asc')
      setOrderBy(property)
    }
  }

  // Sıralama işlemi
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const aVal = a[orderBy]
    const bVal = b[orderBy]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = (aVal ?? '').toString().toLowerCase()
    const bStr = (bVal ?? '').toString().toLowerCase()

    if (aStr < bStr) return order === 'asc' ? -1 : 1
    if (aStr > bStr) return order === 'asc' ? 1 : -1

    return 0
  })

  return (
    <Stack spacing={2}>
      {!isAnyFilterActive && (
        <EInvoiceSummaryBar
          invoices={summaryBarInvoices}
          selectedPeriod={period}
          onPeriodChange={setPeriod}
          selectedStatus={summaryStatus}
          onStatusChange={setSummaryStatus}
          hidden={false}
        />
      )}
      <EInvoiceListTable
        data={sortedInvoices}
        order={order}
        orderBy={orderBy}
        onSort={handleSort}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalCount={sortedInvoices.length}
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
      />
    </Stack>
  )
}

export default EInvoiceIncoming
