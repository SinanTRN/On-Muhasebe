'use client'

import React, { useState } from 'react'

import Stack from '@mui/material/Stack'

import InvoiceLeftPanel from '@/views/apps/e-invoice/add/EInvoiceCard'
import AddActions from '@/views/apps/e-invoice/add/AddActions'

import InvoiceItemsTable from '@/views/apps/e-invoice/add/EInvoiceItemsTable'

const AddInvoicePage = () => {
  const [includesVAT, setIncludesVAT] = useState(false)
  const [currency, setCurrency] = useState('TRY')
  const [exchangeRate, setExchangeRate] = useState('')

  return (
    <Stack className='flex-1 flex-col p-0 m-0 gap-2'>
      <InvoiceLeftPanel
        includesVAT={includesVAT}
        setIncludesVAT={setIncludesVAT}
        currency={currency}
        setCurrency={setCurrency}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
      />
      <InvoiceItemsTable includesVAT={includesVAT} currency={currency} />
      <AddActions />
    </Stack>
  )
}

export default AddInvoicePage
