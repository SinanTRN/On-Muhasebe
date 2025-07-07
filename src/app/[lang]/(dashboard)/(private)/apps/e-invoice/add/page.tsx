'use client'

import React, { useState } from 'react'

import Stack from '@mui/material/Stack'

import InvoiceLeftPanel from '@/views/apps/e-invoice/add/InvoiceLeftPanel'
import AddActions from '@/views/apps/e-invoice/add/AddActions'

import InvoiceItemsTable from '@/views/apps/e-invoice/add/InvoiceItemsTable'

const AddInvoicePage = () => {
  const [includesVAT, setIncludesVAT] = useState(true)
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
      <InvoiceItemsTable includesVAT={includesVAT} currency={currency} exchangeRate={exchangeRate} />
      <AddActions />
    </Stack>
  )
}

export default AddInvoicePage
