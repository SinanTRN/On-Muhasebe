import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

interface ETTNCellProps {
  ettn: string
}

const ETTNCell: React.FC<ETTNCellProps> = ({ ettn }) => {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(ettn)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } else {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = ettn
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      } catch (e) {
        alert('Kopyalama desteklenmiyor!')
      }
    }
  }

  let displayText = 'ETTN'
  if (copied) displayText = 'Kopyalandı!'
  else if (hovered) displayText = 'Kopyala'

  return (
    <Tooltip title={ettn} arrow placement='top'>
      <span
        style={{ cursor: 'pointer', color: hovered ? '#1976d2' : undefined, fontWeight: 500 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCopy}
      >
        {displayText}
      </span>
    </Tooltip>
  )
}

export default ETTNCell 
