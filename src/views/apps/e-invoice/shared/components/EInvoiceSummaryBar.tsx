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
    <div
      className="flex flex-col md:flex-row items-center rounded-xl shadow-md p-4 gap-4"
      style={{ background: theme.palette.background.paper }}
    >
      {/* Dönem seçici alan */}
      <div className="flex flex-row items-center gap-2 mb-2 md:mb-0 md:mr-6">
        <span className="font-semibold text-xs md:text-sm mr-2">DÖNEM</span>
        <select
          className="border rounded-md px-2 py-1 text-xs md:text-sm min-w-[80px] md:min-w-[100px] focus:outline-none"
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
      {/* Kutular */}
      <div className="flex flex-row w-full items-center justify-between">
        {statusBoxes.map((box, idx) => (
          <React.Fragment key={box.key}>
            <div
              onClick={() => onStatusChange(box.key)}
              className={`flex flex-row items-center justify-between flex-1 cursor-pointer px-2 py-3`}
              style={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 12,
                minWidth: 120,
                maxWidth: 180,
                border: selectedStatus === box.key ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                boxShadow: selectedStatus === box.key ? theme.shadows[2] : 'none'
              }}
            >
              <div className="flex flex-col items-start justify-center">
                <span className="font-bold text-xl leading-tight">{box.count}</span>
                <span className="font-semibold text-sm leading-tight whitespace-nowrap">{box.label}</span>
              </div>
              <div
                className="flex items-center justify-center ml-4"
                style={{
                  background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
                  borderRadius: '50%',
                  width: 32,
                  height: 32
                }}
              >
                <span className="text-lg">{box.icon}</span>
              </div>
            </div>
            {idx < statusBoxes.length - 1 && (
              <div
                className="h-10 border-l mx-2"
                style={{ borderColor: theme.palette.divider }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default EInvoiceSummaryBar
