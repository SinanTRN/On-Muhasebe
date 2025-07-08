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
  const [currentInvoiceType, setCurrentInvoiceType] = useState('NORMAL')
  const [isWithholdingTax, setIsWithholdingTax] = useState(false)

  return (
    <Stack className='flex-1 flex-col p-0 m-0 gap-2'>
      <InvoiceLeftPanel
        includesVAT={includesVAT}
        setIncludesVAT={setIncludesVAT}
        currency={currency}
        setCurrency={setCurrency}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
        currentInvoiceType={currentInvoiceType}
        setCurrentInvoiceType={setCurrentInvoiceType}
        isWithholdingTax={isWithholdingTax}
        setIsWithholdingTax={setIsWithholdingTax}
      />
      <InvoiceItemsTable
        includesVAT={includesVAT}
        currency={currency}
        currentInvoiceType={currentInvoiceType}
        isWithholdingTax={isWithholdingTax}
      />
      <AddActions />
    </Stack>
  )
}

export default AddInvoicePage
