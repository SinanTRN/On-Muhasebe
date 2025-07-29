import React from 'react'

import type { Theme } from '@mui/material'
import { useTheme } from '@mui/material'

interface StatusLabelProps {
  value: string
  type: 'status' | 'response' | 'envelopeStatus' | 'read' | 'type'
}

const getStatusColor = (theme: Theme, value: string): string => {
  const map: Record<string, string> = {
    Kabul: theme.palette.success.main,
    Alındı: theme.palette.success.main,
    Ret: theme.palette.error.main,
    'Ret - Başarısız': theme.palette.error.main,
    'Kabul Başarısız': theme.palette.error.main,
    'Yanıt bekliyor': theme.palette.warning.main,
    'Beklenen sürede tamamlanmadı': theme.palette.warning.main
  }

  return map[value] || theme.palette.grey[500]
}

const getResponseColor = (theme: Theme, value: string): string => {
  const map: Record<string, string> = {
    Ulaştırıldı: theme.palette.success.main,
    'Yanıt Bekliyor': theme.palette.warning.main,
    'Yanıt Gerekmiyor': theme.palette.grey[500],
    'Teyit Ediniz': theme.palette.info.main
  }

  return map[value] || theme.palette.grey[500]
}

const getEnvelopeColor = (theme: Theme, value: string): string => {
  const map: Record<string, string> = {
    Başarılı: theme.palette.success.main,
    Hatalı: theme.palette.error.main,
    Beklemede: theme.palette.warning.main
  }

  return map[value] || theme.palette.grey[500]
}

const getReadColor = (theme: Theme, value: string): string => {
  const map: Record<string, string> = {
    Okundu: theme.palette.success.main,
    Okunmadı: theme.palette.error.main
  }

  return map[value] || theme.palette.grey[500]
}

const getTypeColor = (theme: Theme, value: string): string => {
  const map: Record<string, string> = {
    'E-Fatura': theme.palette.primary.main,
    'E-Arşiv': theme.palette.info.main,
    'E-İrsaliye': theme.palette.warning.main,
    'E-SMM': theme.palette.secondary.main
  }

  return map[value] || theme.palette.grey[500]
}

const StatusLabel: React.FC<StatusLabelProps> = ({ value, type }) => {
  const theme = useTheme()
  let color = theme.palette.grey[500] // default

  if (type === 'status') {
    color = getStatusColor(theme, value)
  } else if (type === 'response') {
    color = getResponseColor(theme, value)
  } else if (type === 'envelopeStatus') {
    color = getEnvelopeColor(theme, value)
  } else if (type === 'read') {
    color = getReadColor(theme, value)
  } else if (type === 'type') {
    color = getTypeColor(theme, value)
  }

  return (
    <span
      style={{
        background: color + '22', // transparan arka plan
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
