// Tüm fatura verilerini (cari, invoice, items) tek bir JSON yapısında birleştiren converter

import { convertTblToJson, type CariJsonData } from './cariJsonConverter'
import { convertInvoiceFormToJson, type InvoiceFormJson } from './invoiceJsonConverter'
import { convertInvoiceItemsFormToJson, type InvoiceItemsFormJson } from './invoiceItemsJsonConverter'
import type { Tbl } from '@/types/apps/cariTypes'

// Fatura türü enum'u
export type InvoiceType = 'incoming' | 'outgoing' | 'general'

// Tam fatura JSON interface'i
export interface CompleteInvoiceJson {
  // Cari bilgileri
  customer: CariJsonData | null
  differentCustomer: CariJsonData | null
  
  // Fatura bilgileri
  invoice: InvoiceFormJson
  
  // Fatura kalemleri
  items: InvoiceItemsFormJson
  
  // Fatura türü bilgileri (gelen/giden ayrımı için)
  invoiceTypeInfo: {
    type: InvoiceType
    // Gelen fatura özel alanları
    senderVknTckno?: string
    senderName?: string
    senderAddress?: string
    senderEmail?: string
    senderPhone?: string
    receivedAt?: string
    processingStatus?: 'pending' | 'processed' | 'error'
    errorMessage?: string
    originalXmlContent?: string
    responseXmlContent?: string
    isRead?: boolean
    isArchived?: boolean
    // Giden fatura özel alanları
    recipientVknTckno?: string
    recipientName?: string
    recipientAddress?: string
    recipientEmail?: string
    recipientPhone?: string
    sentAt?: string
    deliveryStatus?: 'pending' | 'delivered' | 'failed' | 'cancelled'
    deliveryAttempts?: number
    lastDeliveryAttempt?: string
    deliveryErrorMessage?: string
    isConfirmed?: boolean
    confirmationDate?: string
    // Ortak alanlar
    tags: string[]
    notes: string
  }
  
  // İşleme/Teslimat seçenekleri
  processingOptions?: {
    autoProcess?: boolean
    autoArchive?: boolean
    autoTag?: string[]
  }
  
  deliveryOptions?: {
    autoSend?: boolean
    requireConfirmation?: boolean
    retryAttempts?: number
    retryInterval?: number // dakika
  }
  
  // Meta bilgileri
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
    status: 'draft' | 'sent' | 'cancelled'
    userId?: string
    companyId?: string
    invoiceType: InvoiceType
  }
}

// Fatura türünü belirleme fonksiyonu
export const determineInvoiceType = (invoiceInfo: any): InvoiceType => {
  // Gelen fatura kontrolü - senderVknTckno varsa gelen fatura
  if (invoiceInfo.senderVknTckno || invoiceInfo.senderName) {
    return 'incoming'
  }
  
  // Giden fatura kontrolü - recipientVknTckno varsa giden fatura
  if (invoiceInfo.recipientVknTckno || invoiceInfo.recipientName) {
    return 'outgoing'
  }
  
  // Varsayılan olarak genel fatura
  return 'general'
}

// Tbl tipindeki müşteri verilerini CariJsonData'ya dönüştürme yardımcı fonksiyonu
const convertCustomerToCariJson = (customerTbl: Tbl | null): CariJsonData | null => {
  if (!customerTbl) return null
  
  return convertTblToJson(customerTbl)
}

// Tüm fatura verilerini tek bir JSON'a dönüştürme
export const convertCompleteInvoiceToJson = (
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
  items: any[],
  documentNote: string,
  activeDiscounts: string[],
  
  // İşleme/Teslimat seçenekleri
  processingOptions?: any,
  deliveryOptions?: any,
  
  // Meta bilgileri
  metadata?: {
    userId?: string
    companyId?: string
    status?: 'draft' | 'sent' | 'cancelled'
  }
): CompleteInvoiceJson => {
  const now = new Date().toISOString()
  const invoiceType = determineInvoiceType(invoiceInfo)
  
  // Fatura türü bilgilerini hazırla
  const invoiceTypeInfo: CompleteInvoiceJson['invoiceTypeInfo'] = {
    type: invoiceType,
    tags: invoiceInfo.tags || [],
    notes: invoiceInfo.notes || ''
  }
  
  // Gelen fatura özel alanları
  if (invoiceType === 'incoming') {
    invoiceTypeInfo.senderVknTckno = invoiceInfo.senderVknTckno || ''
    invoiceTypeInfo.senderName = invoiceInfo.senderName || ''
    invoiceTypeInfo.senderAddress = invoiceInfo.senderAddress || ''
    invoiceTypeInfo.senderEmail = invoiceInfo.senderEmail || ''
    invoiceTypeInfo.senderPhone = invoiceInfo.senderPhone || ''
    invoiceTypeInfo.receivedAt = invoiceInfo.receivedAt ? new Date(invoiceInfo.receivedAt).toISOString() : now
    invoiceTypeInfo.processingStatus = invoiceInfo.processingStatus || 'pending'
    invoiceTypeInfo.errorMessage = invoiceInfo.errorMessage || ''
    invoiceTypeInfo.originalXmlContent = invoiceInfo.originalXmlContent || ''
    invoiceTypeInfo.responseXmlContent = invoiceInfo.responseXmlContent || ''
    invoiceTypeInfo.isRead = invoiceInfo.isRead || false
    invoiceTypeInfo.isArchived = invoiceInfo.isArchived || false
  }
  
  // Giden fatura özel alanları
  if (invoiceType === 'outgoing') {
    invoiceTypeInfo.recipientVknTckno = invoiceInfo.recipientVknTckno || ''
    invoiceTypeInfo.recipientName = invoiceInfo.recipientName || ''
    invoiceTypeInfo.recipientAddress = invoiceInfo.recipientAddress || ''
    invoiceTypeInfo.recipientEmail = invoiceInfo.recipientEmail || ''
    invoiceTypeInfo.recipientPhone = invoiceInfo.recipientPhone || ''
    invoiceTypeInfo.sentAt = invoiceInfo.sentAt ? new Date(invoiceInfo.sentAt).toISOString() : now
    invoiceTypeInfo.deliveryStatus = invoiceInfo.deliveryStatus || 'pending'
    invoiceTypeInfo.deliveryAttempts = invoiceInfo.deliveryAttempts || 0
    invoiceTypeInfo.lastDeliveryAttempt = invoiceInfo.lastDeliveryAttempt ? new Date(invoiceInfo.lastDeliveryAttempt).toISOString() : undefined
    invoiceTypeInfo.deliveryErrorMessage = invoiceInfo.deliveryErrorMessage || ''
    invoiceTypeInfo.isConfirmed = invoiceInfo.isConfirmed || false
    invoiceTypeInfo.confirmationDate = invoiceInfo.confirmationDate ? new Date(invoiceInfo.confirmationDate).toISOString() : undefined
    invoiceTypeInfo.isArchived = invoiceInfo.isArchived || false
  }
  
  return {
    // Cari bilgileri
    customer: convertCustomerToCariJson(customer),
    differentCustomer: convertCustomerToCariJson(differentCustomer),
    
    // Fatura bilgileri
    invoice: convertInvoiceFormToJson(
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
      selectedIstisna
    ),
    
    // Fatura kalemleri
    items: convertInvoiceItemsFormToJson(
      items,
      documentNote,
      currency,
      exchangeRate,
      includesVAT,
      invoiceInfo?.invoiceType || 'NORMAL',
      isWithholdingTax,
      bulkWithholdingType,
      activeDiscounts
    ),
    
    // Fatura türü bilgileri
    invoiceTypeInfo,
    
    // İşleme seçenekleri (gelen fatura için)
    processingOptions: invoiceType === 'incoming' ? {
      autoProcess: processingOptions?.autoProcess || false,
      autoArchive: processingOptions?.autoArchive || false,
      autoTag: processingOptions?.autoTag || []
    } : undefined,
    
    // Teslimat seçenekleri (giden fatura için)
    deliveryOptions: invoiceType === 'outgoing' ? {
      autoSend: deliveryOptions?.autoSend || false,
      requireConfirmation: deliveryOptions?.requireConfirmation || true,
      retryAttempts: deliveryOptions?.retryAttempts || 3,
      retryInterval: deliveryOptions?.retryInterval || 5
    } : undefined,
    
    // Meta bilgileri
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      status: metadata?.status || 'draft',
      userId: metadata?.userId,
      companyId: metadata?.companyId,
      invoiceType
    }
  }
}

// JSON'dan tam fatura verilerine dönüştürme
export const convertJsonToCompleteInvoice = (jsonData: CompleteInvoiceJson): {
  customer: Tbl | null
  differentCustomer: Tbl | null
  invoiceForm: any
  itemsForm: any
  metadata: any
} => {
  return {
    customer: jsonData.customer ? {
      // CariJsonData'yı Tbl'ye dönüştürme işlemi burada yapılacak
      // Bu kısım için ayrı bir dönüştürme fonksiyonu gerekebilir
    } as Tbl : null,
    differentCustomer: jsonData.differentCustomer ? {
      // CariJsonData'yı Tbl'ye dönüştürme işlemi burada yapılacak
    } as Tbl : null,
    invoiceForm: jsonData.invoice,
    itemsForm: jsonData.items,
    metadata: jsonData.metadata
  }
}

// JSON string'e dönüştürme
export const convertCompleteInvoiceToJsonString = (completeInvoiceJson: CompleteInvoiceJson): string => {
  return JSON.stringify(completeInvoiceJson, null, 2)
}

// JSON string'den dönüştürme
export const convertJsonStringToCompleteInvoice = (jsonString: string): CompleteInvoiceJson => {
  return JSON.parse(jsonString)
}

// Başlangıç JSON verisi
export const getInitialCompleteInvoiceJson = (): CompleteInvoiceJson => {
  return {
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
        selectedIstisna: ''
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
      type: 'general',
      tags: [],
      notes: ''
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      status: 'draft',
      invoiceType: 'general'
    }
  }
}

// Fatura durumunu güncelleme
export const updateInvoiceStatus = (
  completeInvoiceJson: CompleteInvoiceJson,
  status: 'draft' | 'sent' | 'cancelled'
): CompleteInvoiceJson => {
  return {
    ...completeInvoiceJson,
    metadata: {
      ...completeInvoiceJson.metadata,
      status,
      updatedAt: new Date().toISOString()
    }
  }
}

// Fatura meta bilgilerini güncelleme
export const updateInvoiceMetadata = (
  completeInvoiceJson: CompleteInvoiceJson,
  metadata: {
    userId?: string
    companyId?: string
    status?: 'draft' | 'sent' | 'cancelled'
  }
): CompleteInvoiceJson => {
  return {
    ...completeInvoiceJson,
    metadata: {
      ...completeInvoiceJson.metadata,
      ...metadata,
      updatedAt: new Date().toISOString()
    }
  }
}

// Gelen fatura kontrolü
export const isIncomingInvoice = (invoiceJson: CompleteInvoiceJson): boolean => {
  return invoiceJson.metadata.invoiceType === 'incoming'
}

// Giden fatura kontrolü
export const isOutgoingInvoice = (invoiceJson: CompleteInvoiceJson): boolean => {
  return invoiceJson.metadata.invoiceType === 'outgoing'
}

// Genel fatura kontrolü
export const isGeneralInvoice = (invoiceJson: CompleteInvoiceJson): boolean => {
  return invoiceJson.metadata.invoiceType === 'general'
} 
