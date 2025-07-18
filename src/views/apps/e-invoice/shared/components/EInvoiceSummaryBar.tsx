import React from 'react'

import { useTheme } from '@mui/material'

import type { Invoice } from '../tables/EInvoiceListTable'

const periods = [
  { label: '1 Gün', value: '1' },
  { label: '7 Gün', value: '7' },
  { label: '30 Gün', value: '30' },
  { label: '60 Gün', value: '60' },
  { label: '90 Gün', value: '90' },
  { label: 'Bu Ay', value: 'month' },
  { label: 'Geçen Ay', value: 'lastMonth' }
]

// getStatusKey fonksiyonu kaldırıldı

interface Props {
  invoices: Invoice[]
  selectedPeriod: string
  onPeriodChange: (val: string) => void
  selectedStatus: string
  onStatusChange: (val: string) => void
  hidden?: boolean // yeni prop
}

const EInvoiceSummaryBar: React.FC<Props> = ({
  invoices,
  selectedPeriod,
  onPeriodChange,
  selectedStatus,
  onStatusChange,
  hidden = false // default değeri false
}) => {
  const theme = useTheme()

  if (hidden) return null // Eğer gizli ise hiç render etme
  // Döneme göre filtrele
  const now = new Date()
  let filtered = invoices

  if (selectedPeriod === '1') {
    const d = new Date(now)

    d.setDate(now.getDate() - 1)
    filtered = invoices.filter(inv => new Date(inv.receivedAt) >= d)
  } else if (selectedPeriod === '7') {
    const d = new Date(now)

    d.setDate(now.getDate() - 7)
    filtered = invoices.filter(inv => new Date(inv.receivedAt) >= d)
  } else if (selectedPeriod === '30') {
    const d = new Date(now)

    d.setDate(now.getDate() - 30)
    filtered = invoices.filter(inv => new Date(inv.receivedAt) >= d)
  } else if (selectedPeriod === '60') {
    const d = new Date(now)

    d.setDate(now.getDate() - 60)
    filtered = invoices.filter(inv => new Date(inv.receivedAt) >= d)
  } else if (selectedPeriod === '90') {
    const d = new Date(now)

    d.setDate(now.getDate() - 90)
    filtered = invoices.filter(inv => new Date(inv.receivedAt) >= d)
  } else if (selectedPeriod === 'month') {
    filtered = invoices.filter(inv => {
      const date = new Date(inv.receivedAt)

      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  } else if (selectedPeriod === 'lastMonth') {
    filtered = invoices.filter(inv => {
      const date = new Date(inv.receivedAt)
      const lastMonth = new Date(now)

      lastMonth.setMonth(now.getMonth() - 1)

      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
    })
  }

  // Her kutunun sayısını doğrudan filtreyle hesapla
  const yeniGelenCount = filtered.filter(inv => inv.status === 'Alındı').length
  const okunduCount = filtered.filter(inv => inv.read === true).length
  const kabulCount = filtered.filter(inv => inv.status === 'Kabul').length
  const yanitBekleyenCount = filtered.filter(inv => inv.status === 'Yanıt bekliyor').length

  const reddedilenCount = filtered.filter(
    inv => inv.status.startsWith('Ret') || inv.status === 'Reddedildi' || inv.status === 'Kabul Başarısız'
  ).length

  const statusBoxes = [
    { key: 'yeni', label: 'YENİ GELEN', color: theme.palette.warning.main, icon: '📥', count: yeniGelenCount },
    { key: 'okundu', label: 'OKUNDU', color: theme.palette.info.main, icon: '📄', count: okunduCount },
    { key: 'kabul', label: 'KABUL EDİLEN', color: theme.palette.success.main, icon: '📗', count: kabulCount },
    { key: 'yanit', label: 'YANIT BEKLEYEN', color: theme.palette.primary.main, icon: '🔄', count: yanitBekleyenCount },
    { key: 'red', label: 'REDDEDİLEN', color: theme.palette.error.main, icon: '🚫', count: reddedilenCount }
  ]

  return (
    <div className='flex flex-row  rounded-md shadow-md' style={{ background: theme.palette.background.paper }}>
      <div className='w-full flex flex-col gap-2 md:flex-row md:items-center md:gap-4 mb-4 flex-wrap'>
        <div
          className='flex items-center  rounded-md px-3 py-2 min-w-[120px] md:min-w-[180px] mb-1 md:mb-0'
          style={{ background: theme.palette.background.paper }}
        >
          <span className='font-semibold text-xs md:text-sm  mr-2'>DÖNEM</span>
          <select
            className='border rounded-md px-2 py-1 text-xs md:text-sm min-w-[80px] md:min-w-[100px] focus:outline-none'
            value={selectedPeriod}
            onChange={e => onPeriodChange(e.target.value)}
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider
            }}
          >
            {periods.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col p-4 gap-2 w-full md:flex-row md:gap-4 flex-wrap'>
          {statusBoxes.map(box => {
            return (
              <div
                key={box.key}
                onClick={() => onStatusChange(box.key)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 min-w-[120px] md:min-w-[170px] cursor-pointer border-2 transition-all duration-150 shadow-md`}
                style={{
                  background: selectedStatus === box.key ? box.color : theme.palette.background.paper,
                  color: selectedStatus === box.key ? theme.palette.getContrastText(box.color) : box.color,
                  borderColor: selectedStatus === box.key ? 'transparent' : box.color,
                  boxShadow: selectedStatus === box.key ? theme.shadows[2] : 'none'
                }}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-lg md:text-xl'>{box.icon}</span>
                  <span className='font-semibold text-xs md:text-base'>{box.label}</span>
                  <span className='font-bold text-base md:text-xl ml-2'>{box.count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EInvoiceSummaryBar
