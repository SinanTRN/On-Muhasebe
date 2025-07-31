import type { OutgoingEInvoiceForm, CustomerInfo, InvoiceRow } from '@/types/apps/eInvoiceTypes'
import { convertCompleteInvoiceToJson, type CompleteInvoiceJson } from './completeInvoiceJsonConverter'
import type { Tbl } from '@/types/apps/cariTypes'

// Giden fatura JSON interface'i - CompleteInvoiceJson'ı kullanır
export type OutgoingInvoiceJson = CompleteInvoiceJson

/**
 * Giden E-Fatura verilerini JSON formatına dönüştürür
 */
export const convertOutgoingInvoiceToJson = (
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
  
  // Teslimat seçenekleri
  deliveryOptions: {
    autoSend: boolean
    requireConfirmation: boolean
    retryAttempts: number
    retryInterval: number
  },
  
  // Meta bilgileri
  metadata?: {
    userId?: string
    companyId?: string
    status?: 'draft' | 'sent' | 'cancelled'
  }
): OutgoingInvoiceJson => {
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
    undefined, // processingOptions
    deliveryOptions,
    metadata
  )
}

/**
 * Giden E-Fatura form verilerini JSON'a dönüştürür
 */
export const convertOutgoingInvoiceFormToJson = (formData: OutgoingEInvoiceForm, meta: any = {}) => {
  return convertOutgoingInvoiceToJson(
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
    formData.deliveryOptions,
    meta
  )
}

// JSON string'e dönüştürme
export const convertOutgoingInvoiceToJsonString = (outgoingInvoiceJson: OutgoingInvoiceJson): string => {
  return JSON.stringify(outgoingInvoiceJson, null, 2)
}

// JSON string'den dönüştürme
export const convertJsonStringToOutgoingInvoice = (jsonString: string): OutgoingInvoiceJson => {
  return JSON.parse(jsonString)
}

// Başlangıç JSON verisi
export const getInitialOutgoingInvoiceJson = (): OutgoingInvoiceJson => {
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
        // Giden fatura özel alanları
        recipientVknTckno: '',
        recipientName: '',
        recipientAddress: '',
        recipientEmail: '',
        recipientPhone: '',
        sentAt: new Date(),
        deliveryStatus: 'pending' as const,
        deliveryAttempts: 0,
        isConfirmed: false,
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
      type: 'outgoing' as const,
      recipientVknTckno: '',
      recipientName: '',
      recipientAddress: '',
      recipientEmail: '',
      recipientPhone: '',
      sentAt: new Date().toISOString(),
      deliveryStatus: 'pending' as const,
      deliveryAttempts: 0,
      isConfirmed: false,
      isArchived: false,
      tags: [],
      notes: ''
    },
    deliveryOptions: {
      autoSend: false,
      requireConfirmation: true,
      retryAttempts: 3,
      retryInterval: 5
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      status: 'draft' as const,
      invoiceType: 'outgoing' as const
    }
  }

  return baseInvoice
}

// Fatura durumunu güncelleme
export const updateOutgoingInvoiceStatus = (
  outgoingInvoiceJson: OutgoingInvoiceJson,
  status: 'draft' | 'sent' | 'cancelled'
): OutgoingInvoiceJson => {
  return {
    ...outgoingInvoiceJson,
    metadata: {
      ...outgoingInvoiceJson.metadata,
      status,
      updatedAt: new Date().toISOString()
    }
  }
}

// Teslimat durumunu güncelleme
export const updateOutgoingInvoiceDeliveryStatus = (
  outgoingInvoiceJson: OutgoingInvoiceJson,
  deliveryStatus: 'pending' | 'delivered' | 'failed' | 'cancelled',
  deliveryErrorMessage?: string
): OutgoingInvoiceJson => {
  return {
    ...outgoingInvoiceJson,
    invoiceTypeInfo: {
      ...outgoingInvoiceJson.invoiceTypeInfo,
      deliveryStatus,
      deliveryErrorMessage: deliveryErrorMessage || outgoingInvoiceJson.invoiceTypeInfo.deliveryErrorMessage,
      deliveryAttempts: (outgoingInvoiceJson.invoiceTypeInfo.deliveryAttempts || 0) + 1,
      lastDeliveryAttempt: new Date().toISOString()
    },
    metadata: {
      ...outgoingInvoiceJson.metadata,
      updatedAt: new Date().toISOString()
    }
  }
} 
