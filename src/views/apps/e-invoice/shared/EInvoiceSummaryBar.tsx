import React from 'react'
import type { Invoice } from './EInvoiceListTable'
import { useTheme } from '@mui/material'


const periods = [
  { label: '1 Gün', value: '1' },
  { label: '7 Gün', value: '7' },
  { label: '30 Gün', value: '30' },
  { label: '60 Gün', value: '60' },
  { label: '90 Gün', value: '90' },
  { label: 'Bu Ay', value: 'month' },
  { label: 'Geçen Ay', value: 'lastMonth' }
]

const statusBoxes = [
  { key: 'yeni', label: 'YENİ GELEN', color: 'bg-orange-400', text: 'text-orange-600', icon: '📥' },
  { key: 'okundu', label: 'OKUNDU', color: 'bg-blue-400', text: 'text-blue-600', icon: '📄' },
  { key: 'kabul', label: 'KANUNEN KABUL', color: 'bg-green-600', text: 'text-green-700', icon: '📗' },
  { key: 'yanit', label: 'YANIT BEKLEYEN', color: 'bg-sky-400', text: 'text-sky-600', icon: '🔄' },
  { key: 'red', label: 'REDDEDİLEN', color: 'bg-gray-500', text: 'text-gray-700', icon: '🚫' }
]

function getStatusKey(inv: Invoice): string {
  if (inv.status === 'Alındı' || inv.status === 'Yeni' || inv.status === 'YENİ GELEN') return 'yeni'
  if (inv.status === 'Okundu') return 'okundu'
  if (inv.status === 'Kabul' || inv.status === 'Kanunen Kabul') return 'kabul'
  if (inv.status === 'Yanıt bekliyor' || inv.status === 'YANIT BEKLEYEN') return 'yanit'
  if (inv.status.startsWith('Ret') || inv.status === 'Reddedildi' || inv.status === 'REDDEDİLEN' || inv.status === 'İptal') return 'red'
  return 'yeni'
}

interface Props {
  invoices: Invoice[]
  selectedPeriod: string
  onPeriodChange: (val: string) => void
  selectedStatus: string
  onStatusChange: (val: string) => void
}

const EInvoiceSummaryBar: React.FC<Props> = ({
  invoices,
  selectedPeriod,
  onPeriodChange,
  selectedStatus,
  onStatusChange
}) => {
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
      return (
        date.getMonth() === lastMonth.getMonth() &&
        date.getFullYear() === lastMonth.getFullYear()
      )
    })
  }

  const theme=useTheme()


  // Her statü için count hesapla
  const counts: Record<string, number> = { yeni: 0, okundu: 0, kabul: 0, yanit: 0, red: 0 }
  filtered.forEach(inv => {
    const key = getStatusKey(inv)
    counts[key] = (counts[key] || 0) + 1
  })

  return (
    <div className='flex flex-row  rounded-md shadow-md' style={{background: theme.palette.background.paper}}>
            <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:gap-4 mb-4 flex-wrap">
      <div className="flex items-center  rounded-md px-3 py-2 min-w-[120px] md:min-w-[180px] mb-1 md:mb-0" style={{background: theme.palette.background.paper}}>
        <span className="font-semibold text-xs md:text-sm  mr-2">DÖNEM</span>
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
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col p-4 gap-2 w-full md:flex-row md:gap-4 flex-wrap">
        {statusBoxes.map(box => {
          // Renkleri tema üzerinden belirle
          let mainColor = theme.palette.info.main;
          let textColor = theme.palette.text.primary;
          if (box.key === 'yeni') mainColor = theme.palette.warning.main;
          if (box.key === 'okundu') mainColor = theme.palette.info.main;
          if (box.key === 'kabul') mainColor = theme.palette.success.main;
          if (box.key === 'yanit') mainColor = theme.palette.primary.main;
          if (box.key === 'red') mainColor = theme.palette.error.main;

          const isSelected = selectedStatus === box.key;

          return (
            <div
              key={box.key}
              onClick={() => onStatusChange(box.key)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 min-w-[120px] md:min-w-[170px] cursor-pointer border-2 transition-all duration-150 shadow-md`}
              style={{
                background: isSelected ? mainColor : theme.palette.background.paper,
                color: isSelected ? theme.palette.getContrastText(mainColor) : mainColor,
                borderColor: isSelected ? 'transparent' : mainColor,
                boxShadow: isSelected ? theme.shadows[2] : 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl">{box.icon}</span>
                <span className="font-semibold text-xs md:text-base">{box.label}</span>
                <span className="font-bold text-base md:text-xl ml-2">{counts[box.key] || 0}</span>
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
