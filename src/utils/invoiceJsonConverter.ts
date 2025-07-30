// Fatura bilgilerini JSON formatına dönüştüren interface'ler ve fonksiyonlar

// Fatura bilgileri JSON interface'i
export interface InvoiceInfoJson {
  // Temel fatura bilgileri
  documentNo: string
  description: string
  issueDate: string 
  shipmentDate: string 
  dueDate: string 
  branch: string
  scenario: string
  invoiceType: string
  status: string
  isEInvoice: boolean
  
  // Para birimi bilgileri
  currency: string
  exchangeRate: string
  
  // KDV bilgileri
  includesVAT: boolean
  
  // Tevkifat bilgileri
  isWithholdingTax: boolean
  bulkWithholdingType?: string
  
  // İstisna bilgileri
  selectedIstisna?: string
}

// İrsaliye ve sipariş bilgileri JSON interface'i
export interface DeliveryAndOrderInfoJson {
  orderNumber: string
  orderDate: string | null 
  deliveryNumber: string
  deliveryDate: string | null 
}

// Sipariş bilgileri JSON interface'i
export interface OrderInfoJson {
  site: string
  orderNo: string
  orderDate: string | null 
}

// İade bilgileri JSON interface'i
export interface ReturnInfoJson {
  returnNo: string
  returnDate: string | null 
}

// Tevkifat bilgileri JSON interface'i
export interface WithholdingTaxInfoJson {
  type: string
}

// Gönderim bilgileri JSON interface'i
export interface ShipmentInfoJson {
  vknTckno: string
  title: string
  shipmentDate: string | null 
}

// Ödeme bilgileri JSON interface'i
export interface PaymentInfoJson {
  method: string
  paymentDate: string | null 
  agent: string
}

// Tüm fatura bilgilerini kapsayan ana JSON interface'i
export interface InvoiceFormJson {
  // Fatura bilgileri
  invoiceInfo: InvoiceInfoJson
  
  // İrsaliye ve sipariş bilgileri
  deliveryAndOrderInfo: DeliveryAndOrderInfoJson
  
  // Sipariş bilgileri
  orderInfo: OrderInfoJson
  
  // İade bilgileri listesi
  returnInfoList: ReturnInfoJson[]
  
  // Tevkifat bilgileri
  withholdingTaxInfo: WithholdingTaxInfoJson
  
  // Gönderim bilgileri
  shipmentInfo: ShipmentInfoJson
  
  // Ödeme bilgileri
  paymentInfo: PaymentInfoJson
  
  // Ek bilgiler
  dueDateAndPaymentMethod: boolean
  deliveryAndOrder: boolean
  showDifferentCustomer: boolean
}

// Date'i ISO string'e dönüştürme yardımcı fonksiyonu
const dateToISOString = (date: Date | null): string | null => {
  if (!date) return null
  return date.toISOString()
}

// ISO string'i Date'e dönüştürme yardımcı fonksiyonu
const isoStringToDate = (isoString: string | null): Date | null => {
  if (!isoString) return null
  return new Date(isoString)
}

// Fatura bilgilerini JSON'a dönüştürme
export const convertInvoiceInfoToJson = (invoiceInfo: any, currency: string, exchangeRate: string, includesVAT: boolean, isWithholdingTax: boolean, bulkWithholdingType?: string, selectedIstisna?: string): InvoiceInfoJson => {
  return {
    documentNo: invoiceInfo.documentNo || '',
    description: invoiceInfo.description || '',
    issueDate: dateToISOString(invoiceInfo.issueDate) || '',
    shipmentDate: dateToISOString(invoiceInfo.shipmentDate) || '',
    dueDate: dateToISOString(invoiceInfo.dueDate) || '',
    branch: invoiceInfo.branch || '',
    scenario: invoiceInfo.scenario || 'TEMELFATURA',
    invoiceType: invoiceInfo.invoiceType || 'NORMAL',
    status: invoiceInfo.status || 'CLOSED',
    isEInvoice: invoiceInfo.isEInvoice || false,
    currency: currency || 'TRY',
    exchangeRate: exchangeRate || '',
    includesVAT: includesVAT || false,
    isWithholdingTax: isWithholdingTax || false,
    bulkWithholdingType: bulkWithholdingType || '',
    selectedIstisna: selectedIstisna || ''
  }
}

// İrsaliye ve sipariş bilgilerini JSON'a dönüştürme
export const convertDeliveryAndOrderInfoToJson = (deliveryAndOrderInfo: any): DeliveryAndOrderInfoJson => {
  return {
    orderNumber: deliveryAndOrderInfo.orderNumber || '',
    orderDate: dateToISOString(deliveryAndOrderInfo.orderDate),
    deliveryNumber: deliveryAndOrderInfo.deliveryNumber || '',
    deliveryDate: dateToISOString(deliveryAndOrderInfo.deliveryDate)
  }
}

// Sipariş bilgilerini JSON'a dönüştürme
export const convertOrderInfoToJson = (orderInfo: any): OrderInfoJson => {
  return {
    site: orderInfo.site || '',
    orderNo: orderInfo.orderNo || '',
    orderDate: dateToISOString(orderInfo.orderDate)
  }
}

// İade bilgilerini JSON'a dönüştürme
export const convertReturnInfoToJson = (returnInfo: any): ReturnInfoJson => {
  return {
    returnNo: returnInfo.returnNo || '',
    returnDate: dateToISOString(returnInfo.returnDate)
  }
}

// İade bilgileri listesini JSON'a dönüştürme
export const convertReturnInfoListToJson = (returnInfoList: any[]): ReturnInfoJson[] => {
  return returnInfoList.map(returnInfo => convertReturnInfoToJson(returnInfo))
}

// Tevkifat bilgilerini JSON'a dönüştürme
export const convertWithholdingTaxInfoToJson = (withholdingTaxInfo: any): WithholdingTaxInfoJson => {
  return {
    type: withholdingTaxInfo.type || ''
  }
}

// Gönderim bilgilerini JSON'a dönüştürme
export const convertShipmentInfoToJson = (shipmentInfo: any): ShipmentInfoJson => {
  return {
    vknTckno: shipmentInfo.vknTckno || '',
    title: shipmentInfo.title || '',
    shipmentDate: dateToISOString(shipmentInfo.shipmentDate)
  }
}

// Ödeme bilgilerini JSON'a dönüştürme
export const convertPaymentInfoToJson = (paymentInfo: any): PaymentInfoJson => {
  return {
    method: paymentInfo.method || 'KREDI/BANKA KARTI',
    paymentDate: dateToISOString(paymentInfo.paymentDate),
    agent: paymentInfo.agent || ''
  }
}

// Tüm fatura form verilerini JSON'a dönüştürme
export const convertInvoiceFormToJson = (
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
  bulkWithholdingType?: string,
  selectedIstisna?: string
): InvoiceFormJson => {
  return {
    invoiceInfo: convertInvoiceInfoToJson(
      invoiceInfo, 
      currency, 
      exchangeRate, 
      includesVAT, 
      isWithholdingTax, 
      bulkWithholdingType, 
      selectedIstisna
    ),
    deliveryAndOrderInfo: convertDeliveryAndOrderInfoToJson(deliveryAndOrderInfo),
    orderInfo: convertOrderInfoToJson(orderInfo),
    returnInfoList: convertReturnInfoListToJson(returnInfoList),
    withholdingTaxInfo: convertWithholdingTaxInfoToJson(withholdingTaxInfo),
    shipmentInfo: convertShipmentInfoToJson(shipmentInfo),
    paymentInfo: convertPaymentInfoToJson(paymentInfo),
    dueDateAndPaymentMethod,
    deliveryAndOrder,
    showDifferentCustomer
  }
}

// JSON'dan fatura bilgilerine dönüştürme
export const convertJsonToInvoiceInfo = (jsonData: InvoiceInfoJson): any => {
  return {
    documentNo: jsonData.documentNo,
    description: jsonData.description,
    issueDate: isoStringToDate(jsonData.issueDate) || new Date(),
    shipmentDate: isoStringToDate(jsonData.shipmentDate) || new Date(),
    dueDate: isoStringToDate(jsonData.dueDate) || new Date(),
    branch: jsonData.branch,
    scenario: jsonData.scenario,
    invoiceType: jsonData.invoiceType,
    status: jsonData.status,
    isEInvoice: jsonData.isEInvoice
  }
}

// JSON'dan irsaliye ve sipariş bilgilerine dönüştürme
export const convertJsonToDeliveryAndOrderInfo = (jsonData: DeliveryAndOrderInfoJson): any => {
  return {
    orderNumber: jsonData.orderNumber,
    orderDate: isoStringToDate(jsonData.orderDate),
    deliveryNumber: jsonData.deliveryNumber,
    deliveryDate: isoStringToDate(jsonData.deliveryDate)
  }
}

// JSON'dan sipariş bilgilerine dönüştürme
export const convertJsonToOrderInfo = (jsonData: OrderInfoJson): any => {
  return {
    site: jsonData.site,
    orderNo: jsonData.orderNo,
    orderDate: isoStringToDate(jsonData.orderDate)
  }
}

// JSON'dan iade bilgilerine dönüştürme
export const convertJsonToReturnInfo = (jsonData: ReturnInfoJson): any => {
  return {
    returnNo: jsonData.returnNo,
    returnDate: isoStringToDate(jsonData.returnDate)
  }
}

// JSON'dan iade bilgileri listesine dönüştürme
export const convertJsonToReturnInfoList = (jsonArray: ReturnInfoJson[]): any[] => {
  return jsonArray.map(jsonData => convertJsonToReturnInfo(jsonData))
}

// JSON'dan tevkifat bilgilerine dönüştürme
export const convertJsonToWithholdingTaxInfo = (jsonData: WithholdingTaxInfoJson): any => {
  return {
    type: jsonData.type
  }
}

// JSON'dan gönderim bilgilerine dönüştürme
export const convertJsonToShipmentInfo = (jsonData: ShipmentInfoJson): any => {
  return {
    vknTckno: jsonData.vknTckno,
    title: jsonData.title,
    shipmentDate: isoStringToDate(jsonData.shipmentDate)
  }
}

// JSON'dan ödeme bilgilerine dönüştürme
export const convertJsonToPaymentInfo = (jsonData: PaymentInfoJson): any => {
  return {
    method: jsonData.method,
    paymentDate: isoStringToDate(jsonData.paymentDate),
    agent: jsonData.agent
  }
}

// JSON string'e dönüştürme
export const convertInvoiceFormToJsonString = (invoiceFormJson: InvoiceFormJson): string => {
  return JSON.stringify(invoiceFormJson, null, 2)
}

// JSON string'den dönüştürme
export const convertJsonStringToInvoiceForm = (jsonString: string): InvoiceFormJson => {
  return JSON.parse(jsonString)
}

// Başlangıç JSON verisi
export const getInitialInvoiceFormJson = (): InvoiceFormJson => {
  return {
    invoiceInfo: {
      documentNo: '',
      description: '',
      issueDate: new Date().toISOString(),
      shipmentDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
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
    returnInfoList: [{
      returnNo: '',
      returnDate: null
    }],
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
  }
} 
