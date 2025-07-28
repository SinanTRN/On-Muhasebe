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

  // EInvoiceCard state'leri
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [showDifferentCustomer, setShowDifferentCustomer] = useState(false)
  const [differentCustomer, setDifferentCustomer] = useState('')
  const [invoiceInfo, setInvoiceInfo] = useState({
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
  })
  const [deliveryAndOrderInfo, setDeliveryAndOrderInfo] = useState({
    orderNumber: '',
    orderDate: null as Date | null,
    deliveryNumber: '',
    deliveryDate: null as Date | null
  })
  const [orderInfo, setOrderInfo] = useState({
    site: '',
    orderNo: '',
    orderDate: null as Date | null
  })
  const [returnInfoList, setReturnInfoList] = useState([{ returnNo: '', returnDate: null as Date | null }])
  const [withholdingTaxInfo, setWithholdingTaxInfo] = useState({ type: '' })
  const [shipmentInfo, setShipmentInfo] = useState({
    vknTckno: '',
    title: '',
    shipmentDate: null as Date | null
  })
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'KREDI/BANKA KARTI',
    paymentDate: null as Date | null,
    agent: ''
  })

  // EInvoiceItemsTable state'leri
  const [items, setItems] = useState<any[]>([])
  const [documentNote, setDocumentNote] = useState('')

  // Form verilerini toplamak için fonksiyon
  const getFormData = (): EInvoiceForm => {
    return {
      customer: selectedCustomer ? {
        id: selectedCustomer,
        name: 'Müşteri Adı', // Gerçek müşteri verilerini almak için
        taxNumber: '1234567890',
        address: 'Müşteri Adresi',
        email: 'musteri@email.com',
        phone: '05551234567',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Kadıköy'
      } : null,
      differentCustomer: differentCustomer ? {
        id: differentCustomer,
        name: 'Farklı Müşteri Adı',
        taxNumber: '0987654321',
        address: 'Farklı Müşteri Adresi',
        email: 'farkli@email.com',
        phone: '05559876543',
        country: 'Türkiye',
        city: 'Ankara',
        district: 'Çankaya'
      } : null,
      invoiceInfo,
      deliveryAndOrderInfo,
      orderInfo,
      returnInfoList,
      withholdingTaxInfo,
      shipmentInfo,
      paymentInfo,
      includesVAT,
      currency,
      exchangeRate,
      items,
      documentNote
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
        bulkWithholdingType={bulkWithholdingType}
        setBulkWithholdingType={setBulkWithholdingType}
        // Yeni prop'lar
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        showDifferentCustomer={showDifferentCustomer}
        setShowDifferentCustomer={setShowDifferentCustomer}
        differentCustomer={differentCustomer}
        setDifferentCustomer={setDifferentCustomer}
        invoiceInfo={invoiceInfo}
        setInvoiceInfo={setInvoiceInfo}
        deliveryAndOrderInfo={deliveryAndOrderInfo}
        setDeliveryAndOrderInfo={setDeliveryAndOrderInfo}
        orderInfo={orderInfo}
        setOrderInfo={setOrderInfo}
        returnInfoList={returnInfoList}
        setReturnInfoList={setReturnInfoList}
        withholdingTaxInfo={withholdingTaxInfo}
        setWithholdingTaxInfo={setWithholdingTaxInfo}
        shipmentInfo={shipmentInfo}
        setShipmentInfo={setShipmentInfo}
        paymentInfo={paymentInfo}
        setPaymentInfo={setPaymentInfo}
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
      />
      <AddActions onPreview={getFormData} />
    </Stack>
  )
}

export default AddInvoicePage
