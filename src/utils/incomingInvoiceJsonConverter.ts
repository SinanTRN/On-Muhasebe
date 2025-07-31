import type { IncomingEInvoiceForm, CustomerInfo, InvoiceRow } from '@/types/apps/eInvoiceTypes'
import { convertCompleteInvoiceToJson, type CompleteInvoiceJson } from './completeInvoiceJsonConverter'
import type { Tbl } from '@/types/apps/cariTypes'

// Gelen fatura JSON interface'i - CompleteInvoiceJson'ı kullanır
export type IncomingInvoiceJson = CompleteInvoiceJson

/**
 * Gelen E-Fatura verilerini JSON formatına dönüştürür
 */
export const convertIncomingInvoiceToJson = (
  // Cari bilgileri
  customer: Tbl | null,
  differentCustomer: Tbl | null,
  
  // Fatura bilgileri
  invoiceInfo: any,
  deliveryAndOrderInfo: any,
  orderInfo: any,
  returnInfoList: any[],
  withholdingTaxInfo: any,
  shipmentInfo: any,
  paymentInfo: any,
  currency: string,
  exchangeRate: string,
  includesVAT: boolean,
  isWithholdingTax: boolean,
  dueDateAndPaymentMethod: boolean,
  deliveryAndOrder: boolean,
  showDifferentCustomer: boolean,
  bulkWithholdingType: string,
  selectedIstisna: string,
  
  // Fatura kalemleri
  items: InvoiceRow[],
  documentNote: string,
  activeDiscounts: string[],
  
  // İşleme seçenekleri
  processingOptions: {
    autoProcess: boolean
    autoArchive: boolean
    autoTag: string[]
  },
  
  // Meta bilgileri
  metadata?: {
    userId?: string
    companyId?: string
    status?: 'draft' | 'sent' | 'cancelled'
  }
): IncomingInvoiceJson => {
  return convertCompleteInvoiceToJson(
    customer,
    differentCustomer,
    invoiceInfo,
    deliveryAndOrderInfo,
    orderInfo,
    returnInfoList,
    withholdingTaxInfo,
    shipmentInfo,
    paymentInfo,
    currency,
    exchangeRate,
    includesVAT,
    isWithholdingTax,
    dueDateAndPaymentMethod,
    deliveryAndOrder,
    showDifferentCustomer,
    bulkWithholdingType,
    selectedIstisna,
    items,
    documentNote,
    activeDiscounts,
    processingOptions,
    undefined, // deliveryOptions
    metadata
  )
}

/**
 * Gelen E-Fatura form verilerini JSON'a dönüştürür
 */
export const convertIncomingInvoiceFormToJson = (formData: IncomingEInvoiceForm, meta: any = {}) => {
  return convertIncomingInvoiceToJson(
    formData.customer as Tbl | null,
    formData.differentCustomer as Tbl | null,
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
    false, // showDifferentCustomer
    formData.bulkWithholdingType || '',
    formData.selectedIstisna || '',
    formData.items || [],
    formData.documentNote || '',
    formData.activeDiscounts || [],
    formData.processingOptions,
    meta
  )
}

// JSON string'e dönüştürme
export const convertIncomingInvoiceToJsonString = (incomingInvoiceJson: IncomingInvoiceJson): string => {
  return JSON.stringify(incomingInvoiceJson, null, 2)
}

// JSON string'den dönüştürme
export const convertJsonStringToIncomingInvoice = (jsonString: string): IncomingInvoiceJson => {
  return JSON.parse(jsonString)
}

// Başlangıç JSON verisi
export const getInitialIncomingInvoiceJson = (): IncomingInvoiceJson => {
  const baseInvoice = {
    customer: null,
    differentCustomer: null,
    invoice: {
      invoiceInfo: {
        documentNo: '',
        description: '',
        issueDate: '',
        shipmentDate: '',
        dueDate: '',
        branch: '',
        scenario: 'TEMELFATURA',
        invoiceType: 'NORMAL',
        status: 'CLOSED',
        isEInvoice: false,
        currency: 'TRY',
        exchangeRate: '',
        includesVAT: false,
        isWithholdingTax: false,
        bulkWithholdingType: '',
        selectedIstisna: '',
        // Gelen fatura özel alanları
        senderVknTckno: '',
        senderName: '',
        senderAddress: '',
        senderEmail: '',
        senderPhone: '',
        receivedAt: new Date(),
        processingStatus: 'pending' as const,
        isRead: false,
        isArchived: false,
        tags: [],
        notes: ''
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
      returnInfoList: [],
      withholdingTaxInfo: {
        type: ''
      },
      shipmentInfo: {
        vknTckno: '',
        title: '',
        shipmentDate: null
      },
      paymentInfo: {
        method: 'KREDI/BANKA KARTI',
        paymentDate: null,
        agent: ''
      },
      dueDateAndPaymentMethod: false,
      deliveryAndOrder: false,
      showDifferentCustomer: false
    },
    items: {
      items: [{
        stockCode: '',
        stockName: '',
        quantity: '1',
        unit: 'Adet',
        unitPrice: '',
        vatRate: '20',
        vatAmount: '',
        total: '',
        dovizAmount: '',
        description: '',
        note: '',
        tevkifatType: '',
        ozelMatrahType: '',
        discount1: '',
        discount2: '',
        discount3: '',
        discount4: '',
        netAmount: ''
      }],
      summary: {
        totalAmount: '0,00',
        totalDiscount: '0,00',
        netTotal: '0,00',
        totalVAT: '0,00',
        calculatedWithholding: '0,00',
        totalWithTaxes: '0,00',
        payableAmount: '0,00',
        currency: 'TRY',
        exchangeRate: '',
        includesVAT: false,
        currentInvoiceType: 'NORMAL',
        isWithholdingTax: false,
        bulkWithholdingType: '',
        activeDiscounts: []
      },
      documentNote: ''
    },
         invoiceTypeInfo: {
       type: 'incoming' as const,
       senderVknTckno: '',
       senderName: '',
       senderAddress: '',
       senderEmail: '',
       senderPhone: '',
       receivedAt: new Date().toISOString(),
       processingStatus: 'pending' as const,
       isRead: false,
       isArchived: false,
       tags: [],
       notes: ''
     },
    processingOptions: {
      autoProcess: false,
      autoArchive: false,
      autoTag: []
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      status: 'draft' as const,
      invoiceType: 'incoming' as const
    }
  }

  return baseInvoice
}

// Fatura durumunu güncelleme
export const updateIncomingInvoiceStatus = (
  incomingInvoiceJson: IncomingInvoiceJson,
  status: 'draft' | 'sent' | 'cancelled'
): IncomingInvoiceJson => {
  return {
    ...incomingInvoiceJson,
    metadata: {
      ...incomingInvoiceJson.metadata,
      status,
      updatedAt: new Date().toISOString()
    }
  }
}

// İşleme durumunu güncelleme
export const updateIncomingInvoiceProcessingStatus = (
  incomingInvoiceJson: IncomingInvoiceJson,
  processingStatus: 'pending' | 'processed' | 'error',
  errorMessage?: string
): IncomingInvoiceJson => {
  return {
    ...incomingInvoiceJson,
    invoiceTypeInfo: {
      ...incomingInvoiceJson.invoiceTypeInfo,
      processingStatus,
      errorMessage: errorMessage || incomingInvoiceJson.invoiceTypeInfo.errorMessage
    },
    metadata: {
      ...incomingInvoiceJson.metadata,
      updatedAt: new Date().toISOString()
    }
  }
} 
