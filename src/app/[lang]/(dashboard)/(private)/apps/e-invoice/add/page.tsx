'use client'

import React, { useState } from 'react'

import Stack from '@mui/material/Stack'

import EInvoiceCard from '@/views/apps/e-invoice/add/EInvoiceCard'
import AddActions from '@/views/apps/e-invoice/add/AddActions'

import EInvoiceItemsTable from '@/views/apps/e-invoice/add/EInvoiceItemsTable'
import type { EInvoiceForm } from '@/views/apps/e-invoice/add/EInvoiceForm.types'

const AddInvoicePage = () => {
  // Ana form state'leri
  const [includesVAT, setIncludesVAT] = useState(false)
  const [currency, setCurrency] = useState('TRY')
  const [exchangeRate, setExchangeRate] = useState('')
  const [currentInvoiceType, setCurrentInvoiceType] = useState('NORMAL')
  const [isWithholdingTax, setIsWithholdingTax] = useState(false)
  const [bulkWithholdingType, setBulkWithholdingType] = useState('')

  // EInvoiceCard'dan gelen form verileri
  const [cardFormData, setCardFormData] = useState<any>(null)

  // EInvoiceItemsTable'dan gelen form verileri
  const [itemsTableFormData, setItemsTableFormData] = useState<any>(null)

  // EInvoiceItemsTable state'leri
  const [items, setItems] = useState<any[]>([])
  const [documentNote, setDocumentNote] = useState('')

  // Form verilerini toplamak için fonksiyon
  const getFormData = (): EInvoiceForm => {
    if (!cardFormData) {
      return {
        customer: null,
        differentCustomer: null,
        invoiceInfo: {
          documentNo: '',
          description: '',
          issueDate: new Date(),
          shipmentDate: new Date(),
          dueDate: new Date(),
          branch: '',
          scenario: 'TEMELFATURA',
          invoiceType: 'NORMAL',
          status: 'CLOSED',
          isEInvoice: false
        },
        deliveryAndOrderInfo: {
          orderNumber: '',
          orderDate: null,
          deliveryNumber: '',
          deliveryDate: null
        },
        orderInfo: {
          site: '',
          orderNo: '',
          orderDate: null
        },
        returnInfoList: [{ returnNo: '', returnDate: null }],
        withholdingTaxInfo: { type: '' },
        shipmentInfo: { vknTckno: '', title: '', shipmentDate: null },
        paymentInfo: { method: 'KREDI/BANKA KARTI', paymentDate: null, agent: '' },
        includesVAT: false,
        currency: 'TRY',
        exchangeRate: '',
        isWithholdingTax: false,
        bulkWithholdingType: '',
        selectedIstisna: '',
        items: [],
        documentNote: '',
        activeDiscounts: []
      }
    }

    return {
      customer: cardFormData.selectedCustomer ? {
        id: cardFormData.selectedCustomer,
        name: 'Müşteri Adı', // Gerçek müşteri verilerini almak için
        taxNumber: '1234567890',
        address: 'Müşteri Adresi',
        email: 'musteri@email.com',
        phone: '05551234567',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Kadıköy'
      } : null,
      differentCustomer: cardFormData.differentCustomer ? {
        id: cardFormData.differentCustomer,
        name: 'Farklı Müşteri Adı',
        taxNumber: '0987654321',
        address: 'Farklı Müşteri Adresi',
        email: 'farkli@email.com',
        phone: '05559876543',
        country: 'Türkiye',
        city: 'Ankara',
        district: 'Çankaya'
      } : null,
      invoiceInfo: cardFormData.invoiceInfo,
      deliveryAndOrderInfo: cardFormData.deliveryAndOrderInfo,
      orderInfo: cardFormData.orderInfo,
      returnInfoList: cardFormData.returnInfoList,
      withholdingTaxInfo: cardFormData.withholdingTaxInfo,
      shipmentInfo: cardFormData.shipmentInfo,
      paymentInfo: cardFormData.paymentInfo,
      includesVAT: cardFormData.includesVAT,
      currency: cardFormData.currency || currency,
      exchangeRate: cardFormData.exchangeRate || exchangeRate,
      isWithholdingTax: cardFormData.isWithholdingTax,
      bulkWithholdingType: cardFormData.bulkWithholdingType,
      selectedIstisna: '',
      items: itemsTableFormData?.items || items,
      documentNote: itemsTableFormData?.documentNote || documentNote,
      activeDiscounts: itemsTableFormData?.activeDiscounts || []
    }
  }

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
        setBulkWithholdingType={setBulkWithholdingType}
        onFormDataChange={setCardFormData}
      />
      <EInvoiceItemsTable
        includesVAT={includesVAT}
        currency={currency}
        currentInvoiceType={currentInvoiceType}
        isWithholdingTax={isWithholdingTax}
        bulkWithholdingType={bulkWithholdingType}
        exchangeRate={exchangeRate}
        // Yeni prop'lar
        items={items}
        setItems={setItems}
        documentNote={documentNote}
        setDocumentNote={setDocumentNote}
        onFormDataChange={setItemsTableFormData}
      />
      <AddActions onPreview={getFormData} />
    </Stack>
  )
}

export default AddInvoicePage
