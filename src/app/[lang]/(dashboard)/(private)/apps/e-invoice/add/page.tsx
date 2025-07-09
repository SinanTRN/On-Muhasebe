'use client'

import React, { useState } from 'react'

import Stack from '@mui/material/Stack'

import EInvoiceCard from '@/views/apps/e-invoice/add/EInvoiceCard'
import AddActions from '@/views/apps/e-invoice/add/AddActions'

import EInvoiceItemsTable from '@/views/apps/e-invoice/add/EInvoiceItemsTable'

const AddInvoicePage = () => {
  const [includesVAT, setIncludesVAT] = useState(false)
  const [currency, setCurrency] = useState('TRY')
  const [exchangeRate, setExchangeRate] = useState('')
  const [currentInvoiceType, setCurrentInvoiceType] = useState('NORMAL')
  const [isWithholdingTax, setIsWithholdingTax] = useState(false)
  const [bulkWithholdingType, setBulkWithholdingType] = useState('')

  return (
    <Stack className='flex-1 flex-col p-0 m-0 gap-2'>
      <EInvoiceCard
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
        bulkWithholdingType={bulkWithholdingType}
        setBulkWithholdingType={setBulkWithholdingType}
      />
      <EInvoiceItemsTable
        includesVAT={includesVAT}
        currency={currency}
        currentInvoiceType={currentInvoiceType}
        isWithholdingTax={isWithholdingTax}
        bulkWithholdingType={bulkWithholdingType}
      />
      <AddActions />
    </Stack>
  )
}

export default AddInvoicePage
