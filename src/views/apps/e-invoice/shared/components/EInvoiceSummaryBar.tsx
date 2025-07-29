import React from 'react'

import { useTheme } from '@mui/material'

import type { Invoice } from '../tables/EInvoiceListTable'

interface Props {
  invoices: Invoice[]
  selectedPeriod: string
  onPeriodChange: (val: string) => void
  hidden?: boolean
}

const EInvoiceSummaryBar: React.FC<Props> = ({
  invoices,
  selectedPeriod,
  hidden = false
}) => {
  const theme = useTheme()

  if (hidden) return null

  // Gelen filtrelenmiş veriyi doğrudan kullan, ek filtreleme yapma
  const filtered = invoices

  // Her kutunun sayısını doğrudan filtrelenmiş veriden hesapla
  const yeniGelenCount = filtered.filter(inv => inv.status === 'Alındı').length
  const okunduCount = filtered.filter(inv => inv.read === true).length
  const kabulCount = filtered.filter(inv => inv.status === 'Kabul').length
  const yanitBekleyenCount = filtered.filter(inv => inv.status === 'Yanıt bekliyor').length

  const reddedilenCount = filtered.filter(
    inv => inv.status.startsWith('Ret') || inv.status === 'Reddedildi' || inv.status === 'Kabul Başarısız' || inv.status === 'Ret-Başarısız'
  ).length

  const statusBoxes = [
    {
      key: 'yeni',
      label: 'YENİ GELEN',
      color: theme.palette.warning.main,
      icon: 'ri-chat-download-line',
      count: yeniGelenCount
    },
    { key: 'okundu', label: 'OKUNDU', color: theme.palette.info.main, icon: 'ri-file-text-line', count: okunduCount },
    {
      key: 'kabul',
      label: 'KABUL EDİLEN',
      color: theme.palette.success.main,
      icon: 'ri-check-line',
      count: kabulCount
    },
    {
      key: 'yanit',
      label: 'YANIT BEKLEYEN',
      color: theme.palette.primary.main,
      icon: 'ri-reply-line',
      count: yanitBekleyenCount
    },
    {
      key: 'red',
      label: 'REDDEDİLEN',
      color: theme.palette.error.main,
      icon: 'ri-close-line',
      count: reddedilenCount
    }
  ]

  return (
    <div
      className='flex flex-col md:flex-row items-center gap-4'
    >
      {/* Kutular */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 w-full'>
        {statusBoxes.map(box => (
          <div
            key={box.key}
            className='relative flex flex-col justify-between bg-white rounded-xl shadow-md p-5 w-full'
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            {/* Sağ üstte ikon */}
            <div
              className='absolute top-5 right-5 rounded-[8px] w-[50px] h-[50px] flex items-center justify-center'
            >
              <i className={` ${box.icon} text-3xl`} />
            </div>
            {/* Başlık */}
            <span className='text-sm text-gray-500 mb-2' style={{ color: theme.palette.text.secondary }}>
              {box.label}
            </span>
            {/* Büyük sayı */}
            <span className='font-bold text-2xl md:text-3xl leading-tight truncate mt-2'>{box.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EInvoiceSummaryBar
