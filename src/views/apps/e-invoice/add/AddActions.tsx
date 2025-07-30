'use client'

import { Card, CardContent, Button } from '@mui/material'
import type { EInvoiceForm } from './EInvoiceForm.types'
import { convertCompleteInvoiceToJson } from '@/utils/completeInvoiceJsonConverter'

interface AddActionsProps {
  onPreview?: () => EInvoiceForm
}

const AddActions = ({ onPreview }: AddActionsProps) => {
  // Kaydet fonksiyonu
  const handleSave = () => {
    // Form verilerini al
    if (!onPreview) {
      return
    }
    
    const formData = onPreview()
    
    // Tüm fatura verilerini tek bir JSON'a dönüştür
    const completeInvoiceJson = convertCompleteInvoiceToJson(
      // Cari bilgileri
      formData.customer ? {
        VN: formData.customer.id,
        name: formData.customer.name,
        taxNumber: formData.customer.taxNumber,
        address: formData.customer.address,
        email: formData.customer.email,
        phone: formData.customer.phone,
        country: formData.customer.country,
        city: formData.customer.city,
        district: formData.customer.district
      } as any : null,
      formData.differentCustomer ? {
        VN: formData.differentCustomer.id,
        name: formData.differentCustomer.name,
        taxNumber: formData.differentCustomer.taxNumber,
        address: formData.differentCustomer.address,
        email: formData.differentCustomer.email,
        phone: formData.differentCustomer.phone,
        country: formData.differentCustomer.country,
        city: formData.differentCustomer.city,
        district: formData.differentCustomer.district
      } as any : null,
      
      // Fatura bilgileri
      formData.invoiceInfo,
      formData.deliveryAndOrderInfo,
      formData.orderInfo,
      formData.returnInfoList,
      formData.withholdingTaxInfo,
      formData.shipmentInfo,
      formData.paymentInfo,
      formData.currency,
      formData.exchangeRate,
      formData.includesVAT,
      formData.isWithholdingTax,
      false, // dueDateAndPaymentMethod
      false, // deliveryAndOrder
      formData.differentCustomer ? true : false, // showDifferentCustomer
      formData.bulkWithholdingType || '',
      formData.selectedIstisna || '',
      
      // Fatura kalemleri
      formData.items || [],
      formData.documentNote || '',
      formData.activeDiscounts || [],
      
      // Meta bilgileri
      {
        status: 'draft'
      }
    )
    
    // TODO: Burada JSON verilerini backend'e gönderme işlemi yapılacak
    console.log('Tam Fatura JSON Verileri:', completeInvoiceJson)
  }

  // Önizleme fonksiyonu
  const handlePreview = () => {
    // Form verilerini al
    if (!onPreview) {
      console.log('Önizleme için form verileri mevcut değil')
      return
    }
    
    const formData = onPreview()
    
    // XML formatında konsola yazdır
    const xmlString = generateXMLFromFormData(formData)
    console.log('E-Fatura XML Önizlemesi:')
    console.log('Form Verileri:', formData)
    console.log(xmlString)
  }

  // XML oluşturma fonksiyonu
  const generateXMLFromFormData = (formData: EInvoiceForm): string => {
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]
    }

    const formatDateTime = (date: Date) => {
      return date.toISOString().replace('T', ' ').substring(0, 19)
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<eInvoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\n'
    
    // Fatura başlık bilgileri
    xml += '  <InvoiceHeader>\n'
    xml += `    <DocumentNo>${formData.invoiceInfo.documentNo}</DocumentNo>\n`
    xml += `    <IssueDate>${formatDate(formData.invoiceInfo.issueDate)}</IssueDate>\n`
    xml += `    <DueDate>${formatDate(formData.invoiceInfo.dueDate)}</DueDate>\n`
    xml += `    <Scenario>${formData.invoiceInfo.scenario}</Scenario>\n`
    xml += `    <InvoiceType>${formData.invoiceInfo.invoiceType}</InvoiceType>\n`
    xml += `    <Currency>${formData.currency}</Currency>\n`
    xml += `    <ExchangeRate>${formData.exchangeRate}</ExchangeRate>\n`
    xml += `    <IncludesVAT>${formData.includesVAT}</IncludesVAT>\n`
    xml += '  </InvoiceHeader>\n'
    
    // Müşteri bilgileri
    if (formData.customer) {
      xml += '  <Customer>\n'
      xml += `    <Name>${formData.customer.name}</Name>\n`
      xml += `    <TaxNumber>${formData.customer.taxNumber}</TaxNumber>\n`
      xml += `    <Address>${formData.customer.address}</Address>\n`
      xml += `    <Email>${formData.customer.email}</Email>\n`
      xml += `    <Phone>${formData.customer.phone}</Phone>\n`
      xml += `    <Country>${formData.customer.country}</Country>\n`
      xml += `    <City>${formData.customer.city}</City>\n`
      xml += `    <District>${formData.customer.district}</District>\n`
      xml += '  </Customer>\n'
    }
    
    // Farklı müşteri bilgileri
    if (formData.differentCustomer) {
      xml += '  <DifferentCustomer>\n'
      xml += `    <Name>${formData.differentCustomer.name}</Name>\n`
      xml += `    <TaxNumber>${formData.differentCustomer.taxNumber}</TaxNumber>\n`
      xml += `    <Address>${formData.differentCustomer.address}</Address>\n`
      xml += `    <Email>${formData.differentCustomer.email}</Email>\n`
      xml += `    <Phone>${formData.differentCustomer.phone}</Phone>\n`
      xml += '  </DifferentCustomer>\n'
    }
    
    // Sipariş ve teslimat bilgileri
    xml += '  <DeliveryAndOrderInfo>\n'
    xml += `    <OrderNumber>${formData.deliveryAndOrderInfo.orderNumber}</OrderNumber>\n`
    if (formData.deliveryAndOrderInfo.orderDate) {
      xml += `    <OrderDate>${formatDate(formData.deliveryAndOrderInfo.orderDate)}</OrderDate>\n`
    }
    xml += `    <DeliveryNumber>${formData.deliveryAndOrderInfo.deliveryNumber}</DeliveryNumber>\n`
    if (formData.deliveryAndOrderInfo.deliveryDate) {
      xml += `    <DeliveryDate>${formatDate(formData.deliveryAndOrderInfo.deliveryDate)}</DeliveryDate>\n`
    }
    xml += '  </DeliveryAndOrderInfo>\n'
    
    // E-ticaret bilgileri
    xml += '  <OrderInfo>\n'
    xml += `    <Site>${formData.orderInfo.site}</Site>\n`
    xml += `    <OrderNo>${formData.orderInfo.orderNo}</OrderNo>\n`
    if (formData.orderInfo.orderDate) {
      xml += `    <OrderDate>${formatDate(formData.orderInfo.orderDate)}</OrderDate>\n`
    }
    xml += '  </OrderInfo>\n'
    
    // İade bilgileri
    if (formData.returnInfoList.length > 0) {
      xml += '  <ReturnInfoList>\n'
      formData.returnInfoList.forEach((returnInfo, index) => {
        xml += `    <ReturnInfo index="${index}">\n`
        xml += `      <ReturnNo>${returnInfo.returnNo}</ReturnNo>\n`
        if (returnInfo.returnDate) {
          xml += `      <ReturnDate>${formatDate(returnInfo.returnDate)}</ReturnDate>\n`
        }
        xml += '    </ReturnInfo>\n'
      })
      xml += '  </ReturnInfoList>\n'
    }
    
    // Tevkifat bilgileri
    xml += '  <WithholdingTaxInfo>\n'
    xml += `    <Type>${formData.withholdingTaxInfo.type}</Type>\n`
    xml += '  </WithholdingTaxInfo>\n'
    
    // Gönderim bilgileri
    xml += '  <ShipmentInfo>\n'
    xml += `    <VknTckno>${formData.shipmentInfo.vknTckno}</VknTckno>\n`
    xml += `    <Title>${formData.shipmentInfo.title}</Title>\n`
    if (formData.shipmentInfo.shipmentDate) {
      xml += `    <ShipmentDate>${formatDateTime(formData.shipmentInfo.shipmentDate)}</ShipmentDate>\n`
    }
    xml += '  </ShipmentInfo>\n'
    
    // Ödeme bilgileri
    xml += '  <PaymentInfo>\n'
    xml += `    <Method>${formData.paymentInfo.method}</Method>\n`
    if (formData.paymentInfo.paymentDate) {
      xml += `    <PaymentDate>${formatDateTime(formData.paymentInfo.paymentDate)}</PaymentDate>\n`
    }
    xml += `    <Agent>${formData.paymentInfo.agent}</Agent>\n`
    xml += '  </PaymentInfo>\n'
    
    // Fatura kalemleri
    xml += '  <InvoiceItems>\n'
    formData.items.forEach((item, index) => {
      xml += `    <Item index="${index}">\n`
      xml += `      <StockCode>${item.stockCode}</StockCode>\n`
      xml += `      <StockName>${item.stockName}</StockName>\n`
      xml += `      <Quantity>${item.quantity}</Quantity>\n`
      xml += `      <Unit>${item.unit}</Unit>\n`
      xml += `      <UnitPrice>${item.unitPrice}</UnitPrice>\n`
      xml += `      <VatRate>${item.vatRate}</VatRate>\n`
      xml += `      <VatAmount>${item.vatAmount}</VatAmount>\n`
      xml += `      <Total>${item.total}</Total>\n`
      xml += `      <Description>${item.description}</Description>\n`
      xml += `      <Note>${item.note}</Note>\n`
      xml += '    </Item>\n'
    })
    xml += '  </InvoiceItems>\n'
    
    // Belge notu
    xml += `  <DocumentNote>${formData.documentNote}</DocumentNote>\n`
    
    xml += '</eInvoice>'
    
    return xml
  }

  return (
    <Card className='flex flex-row  rounded-md shadow-md'>
      <CardContent className='flex flex-col gap-2 sm:flex-row'>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          startIcon={<i className='ri-send-plane-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ '&:hover': { backgroundColor: 'primary.main' }, transition: 'none' }}
          className='max-width-[200px]'
        >
          Fatura Gönder
        </Button>

        <Button
          fullWidth
          variant='outlined'
          color='secondary'
          startIcon={<i className='ri-eye-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ transition: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          className='max-width-[200px]'
          onClick={handlePreview}
        >
          Önizleme
        </Button>

        <Button
          fullWidth
          variant='contained'
          color='success'
          startIcon={<i className='ri-save-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ transition: 'none', '&:hover': { backgroundColor: 'success.main' } }}
          className='max-width-[200px]'
          onClick={handleSave}
        >
          Kaydet
        </Button>
      </CardContent>
    </Card>
  )
}

export default AddActions
