import React from 'react'

interface StatusLabelProps {
  value: string
  type: 'status' | 'response' | 'envelopeStatus' | 'read'
}

const statusColors: Record<string, string> = {
  Kabul: '#22c55e', // yeşil
  Alındı: '#22c55e',
  Ret: '#ef4444',
  'Ret - Başarısız': '#ef4444',
  'Kabul Başarısız': '#ef4444',
  'Yanıt bekliyor': '#f59e42',
  'Beklenen sürede tamamlanmadı': '#f59e42'
}

const responseColors: Record<string, string> = {
  Ulaştırıldı: '#22c55e',
  'Yanıt Bekliyor': '#f59e42',
  'Yanıt Gerekmiyor': '#64748b',
  'Teyit Ediniz': '#3b82f6'
}

const envelopeColors: Record<string, string> = {
  Başarılı: '#22c55e',
  Hatalı: '#ef4444',
  Beklemede: '#f59e42'
}

const readColors: Record<string, string> = {
  Okundu: '#22c55e',
  Okunmadı: '#ef4444'
}

const StatusLabel: React.FC<StatusLabelProps> = ({ value, type }) => {
  let color = '#64748b' // default nötr

  if (type === 'status') {
    color = statusColors[value] || '#64748b'
  } else if (type === 'response') {
    color = responseColors[value] || '#64748b'
  } else if (type === 'envelopeStatus') {
    color = envelopeColors[value] || '#64748b'
  } else if (type === 'read') {
    color = readColors[value] || '#64748b'
  }

  return (
    <span
      style={{
        background: color + '22',
        color,
        borderRadius: 8,
        padding: '2px 10px',
        fontWeight: 500,
        fontSize: 13,
        display: 'inline-block',
        minWidth: 60,
        textAlign: 'center'
      }}
    >
      {value}
    </span>
  )
}

export default StatusLabel
