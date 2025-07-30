// Tüm fatura verilerini (cari, invoice, items) tek bir JSON yapısında birleştiren converter

import { convertTblToJson, type CariJsonData } from './cariJsonConverter'
import { convertInvoiceFormToJson, type InvoiceFormJson } from './invoiceJsonConverter'
import { convertInvoiceItemsFormToJson, type InvoiceItemsFormJson } from './invoiceItemsJsonConverter'
import type { Tbl } from '@/types/apps/cariTypes'

// Tam fatura JSON interface'i
export interface CompleteInvoiceJson {
  // Cari bilgileri
  customer: CariJsonData | null
  differentCustomer: CariJsonData | null
  
  // Fatura bilgileri
  invoice: InvoiceFormJson
  
  // Fatura kalemleri
  items: InvoiceItemsFormJson
  
  // Meta bilgileri
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
    status: 'draft' | 'sent' | 'cancelled'
    userId?: string
    companyId?: string
  }
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
  
  // Meta bilgileri
  metadata?: {
    userId?: string
    companyId?: string
    status?: 'draft' | 'sent' | 'cancelled'
  }
): CompleteInvoiceJson => {
  const now = new Date().toISOString()
  
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
    
    // Meta bilgileri
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      status: metadata?.status || 'draft',
      userId: metadata?.userId,
      companyId: metadata?.companyId
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
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      status: 'draft'
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
