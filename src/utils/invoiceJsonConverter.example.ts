import { 
  convertInvoiceFormToJson,
  convertInvoiceFormToJsonString,
  convertJsonStringToInvoiceForm,
  getInitialInvoiceFormJson,
  type InvoiceFormJson 
} from './invoiceJsonConverter'

// Örnek fatura verisi
const sampleInvoiceData = {
  invoiceInfo: {
    documentNo: 'FTR-2025-001',
    description: 'Test Faturası',
    issueDate: new Date('2025-01-15'),
    shipmentDate: new Date('2025-01-14'),
    dueDate: new Date('2025-02-15'),
    branch: 'Merkez',
    scenario: 'TEMELFATURA',
    invoiceType: 'NORMAL',
    status: 'CLOSED',
    isEInvoice: true
  },
  deliveryAndOrderInfo: {
    orderNumber: 'SIP-2025-001',
    orderDate: new Date('2025-01-10'),
    deliveryNumber: 'IRS-2025-001',
    deliveryDate: new Date('2025-01-13')
  },
  orderInfo: {
    site: 'n11',
    orderNo: 'N11-2025-001',
    orderDate: new Date('2025-01-08')
  },
  returnInfoList: [
    {
      returnNo: 'IADE-2025-001',
      returnDate: new Date('2025-01-12')
    }
  ],
  withholdingTaxInfo: {
    type: '001'
  },
  shipmentInfo: {
    vknTckno: '12345678901',
    title: 'ABC Kargo',
    shipmentDate: new Date('2025-01-13')
  },
  paymentInfo: {
    method: 'EFT/HAVALE',
    paymentDate: new Date('2025-01-16'),
    agent: 'Garanti BBVA'
  },
  currency: 'TRY',
  exchangeRate: '1.00',
  includesVAT: true,
  isWithholdingTax: false,
  dueDateAndPaymentMethod: true,
  deliveryAndOrder: true,
  showDifferentCustomer: false,
  bulkWithholdingType: '',
  selectedIstisna: ''
}

// Kullanım örnekleri
export const invoiceJsonExamples = {
  // Fatura form verilerini JSON'a dönüştürme
  convertToJson: () => {
    const jsonData = convertInvoiceFormToJson(
      sampleInvoiceData.invoiceInfo,
      sampleInvoiceData.deliveryAndOrderInfo,
      sampleInvoiceData.orderInfo,
      sampleInvoiceData.returnInfoList,
      sampleInvoiceData.withholdingTaxInfo,
      sampleInvoiceData.shipmentInfo,
      sampleInvoiceData.paymentInfo,
      sampleInvoiceData.currency,
      sampleInvoiceData.exchangeRate,
      sampleInvoiceData.includesVAT,
      sampleInvoiceData.isWithholdingTax,
      sampleInvoiceData.dueDateAndPaymentMethod,
      sampleInvoiceData.deliveryAndOrder,
      sampleInvoiceData.showDifferentCustomer,
      sampleInvoiceData.bulkWithholdingType,
      sampleInvoiceData.selectedIstisna
    )
    console.log('Fatura JSON Data:', jsonData)
    return jsonData
  },

  // Fatura form verilerini JSON string'e dönüştürme
  convertToJsonString: () => {
    const jsonData = convertInvoiceFormToJson(
      sampleInvoiceData.invoiceInfo,
      sampleInvoiceData.deliveryAndOrderInfo,
      sampleInvoiceData.orderInfo,
      sampleInvoiceData.returnInfoList,
      sampleInvoiceData.withholdingTaxInfo,
      sampleInvoiceData.shipmentInfo,
      sampleInvoiceData.paymentInfo,
      sampleInvoiceData.currency,
      sampleInvoiceData.exchangeRate,
      sampleInvoiceData.includesVAT,
      sampleInvoiceData.isWithholdingTax,
      sampleInvoiceData.dueDateAndPaymentMethod,
      sampleInvoiceData.deliveryAndOrder,
      sampleInvoiceData.showDifferentCustomer,
      sampleInvoiceData.bulkWithholdingType,
      sampleInvoiceData.selectedIstisna
    )
    const jsonString = convertInvoiceFormToJsonString(jsonData)
    console.log('Fatura JSON String:', jsonString)
    return jsonString
  },

  // JSON string'den fatura form verilerine dönüştürme
  convertFromJsonString: (jsonString: string) => {
    const jsonData = convertJsonStringToInvoiceForm(jsonString)
    console.log('JSON String\'den Dönüştürülen Data:', jsonData)
    return jsonData
  },

  // Başlangıç JSON verisi
  getInitialData: () => {
    const initialData = getInitialInvoiceFormJson()
    console.log('Başlangıç JSON Data:', initialData)
    return initialData
  }
}

// JSON çıktısı örnekleri
export const jsonOutputExamples = {
  // Fatura JSON çıktısı
  invoiceJsonOutput: {
    "invoiceInfo": {
      "documentNo": "FTR-2025-001",
      "description": "Test Faturası",
      "issueDate": "2025-01-15T00:00:00.000Z",
      "shipmentDate": "2025-01-14T00:00:00.000Z",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "branch": "Merkez",
      "scenario": "TEMELFATURA",
      "invoiceType": "NORMAL",
      "status": "CLOSED",
      "isEInvoice": true,
      "currency": "TRY",
      "exchangeRate": "1.00",
      "includesVAT": true,
      "isWithholdingTax": false,
      "bulkWithholdingType": "",
      "selectedIstisna": ""
    },
    "deliveryAndOrderInfo": {
      "orderNumber": "SIP-2025-001",
      "orderDate": "2025-01-10T00:00:00.000Z",
      "deliveryNumber": "IRS-2025-001",
      "deliveryDate": "2025-01-13T00:00:00.000Z"
    },
    "orderInfo": {
      "site": "n11",
      "orderNo": "N11-2025-001",
      "orderDate": "2025-01-08T00:00:00.000Z"
    },
    "returnInfoList": [
      {
        "returnNo": "IADE-2025-001",
        "returnDate": "2025-01-12T00:00:00.000Z"
      }
    ],
    "withholdingTaxInfo": {
      "type": "001"
    },
    "shipmentInfo": {
      "vknTckno": "12345678901",
      "title": "ABC Kargo",
      "shipmentDate": "2025-01-13T00:00:00.000Z"
    },
    "paymentInfo": {
      "method": "EFT/HAVALE",
      "paymentDate": "2025-01-16T00:00:00.000Z",
      "agent": "Garanti BBVA"
    },
    "dueDateAndPaymentMethod": true,
    "deliveryAndOrder": true,
    "showDifferentCustomer": false
  },

  // Başlangıç JSON çıktısı
  initialJsonOutput: {
    "invoiceInfo": {
      "documentNo": "",
      "description": "",
      "issueDate": "2025-01-30T10:00:00.000Z",
      "shipmentDate": "2025-01-30T10:00:00.000Z",
      "dueDate": "2025-01-30T10:00:00.000Z",
      "branch": "",
      "scenario": "TEMELFATURA",
      "invoiceType": "NORMAL",
      "status": "CLOSED",
      "isEInvoice": false,
      "currency": "TRY",
      "exchangeRate": "",
      "includesVAT": false,
      "isWithholdingTax": false,
      "bulkWithholdingType": "",
      "selectedIstisna": ""
    },
    "deliveryAndOrderInfo": {
      "orderNumber": "",
      "orderDate": null,
      "deliveryNumber": "",
      "deliveryDate": null
    },
    "orderInfo": {
      "site": "",
      "orderNo": "",
      "orderDate": null
    },
    "returnInfoList": [
      {
        "returnNo": "",
        "returnDate": null
      }
    ],
    "withholdingTaxInfo": {
      "type": ""
    },
    "shipmentInfo": {
      "vknTckno": "",
      "title": "",
      "shipmentDate": null
    },
    "paymentInfo": {
      "method": "KREDI/BANKA KARTI",
      "paymentDate": null,
      "agent": ""
    },
    "dueDateAndPaymentMethod": false,
    "deliveryAndOrder": false,
    "showDifferentCustomer": false
  }
}

// Test fonksiyonu - tüm örnekleri çalıştır
export const testAllInvoiceExamples = () => {
  console.log('=== Fatura JSON Converter Test ===')
  
  // JSON'a dönüştürme testi
  console.log('\n1. Fatura JSON Data:')
  const jsonData = invoiceJsonExamples.convertToJson()
  
  // JSON string'e dönüştürme testi
  console.log('\n2. Fatura JSON String:')
  const jsonString = invoiceJsonExamples.convertToJsonString()
  
  // JSON string'den dönüştürme testi
  console.log('\n3. JSON String\'den Dönüştürme:')
  const convertedData = invoiceJsonExamples.convertFromJsonString(jsonString)
  
  // Başlangıç verisi testi
  console.log('\n4. Başlangıç JSON Data:')
  const initialData = invoiceJsonExamples.getInitialData()
  
  console.log('\n=== Test Tamamlandı ===')
  
  return {
    jsonData,
    jsonString,
    convertedData,
    initialData
  }
} 
