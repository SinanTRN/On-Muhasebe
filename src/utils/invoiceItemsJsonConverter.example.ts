// Fatura kalemleri JSON converter test örneği

import {
  convertInvoiceItemsFormToJson,
  convertJsonToInvoiceItemsForm,
  convertInvoiceItemsFormToJsonString,
  convertJsonStringToInvoiceItemsForm,
  getInitialInvoiceItemsFormJson,
  type InvoiceItemsFormJson
} from './invoiceItemsJsonConverter'

// Window interface'ini genişlet
declare global {
  interface Window {
    testInvoiceItemsJsonConversion: () => void
    exampleUsage: () => any
  }
}

// Örnek fatura kalemleri verisi
const sampleItems = [
  {
    stockCode: 'STK001',
    stockName: 'Laptop Bilgisayar',
    quantity: '2',
    unit: 'Adet',
    unitPrice: '15.000,00',
    vatRate: '20',
    vatAmount: '6.000,00',
    total: '30.000,00',
    dovizAmount: '',
    description: 'Dell Latitude 5520',
    note: 'Garantili ürün',
    tevkifatType: '',
    ozelMatrahType: '',
    discount1: '10',
    discount2: '',
    discount3: '',
    discount4: '',
    netAmount: '27.000,00'
  },
  {
    stockCode: 'STK002',
    stockName: 'Mouse',
    quantity: '5',
    unit: 'Adet',
    unitPrice: '200,00',
    vatRate: '20',
    vatAmount: '200,00',
    total: '1.000,00',
    dovizAmount: '',
    description: 'Kablosuz Mouse',
    note: '',
    tevkifatType: '',
    ozelMatrahType: '',
    discount1: '',
    discount2: '',
    discount3: '',
    discount4: '',
    netAmount: '1.000,00'
  }
]

// Test fonksiyonları
export const testInvoiceItemsJsonConversion = () => {
  console.log('=== FATURA KALEMLERİ JSON DÖNÜŞTÜRME TESTİ ===')

  // 1. Form verilerini JSON'a dönüştürme
  const jsonData = convertInvoiceItemsFormToJson(
    sampleItems,
    'Test fatura açıklaması',
    'TRY',
    '',
    false,
    'NORMAL',
    false,
    '',
    ['discount1']
  )

  console.log('1. JSON Verileri:', jsonData)

  // 2. JSON string'e dönüştürme
  const jsonString = convertInvoiceItemsFormToJsonString(jsonData)
  console.log('2. JSON String:', jsonString)

  // 3. JSON string'den geri dönüştürme
  const parsedData = convertJsonStringToInvoiceItemsForm(jsonString)
  console.log('3. Parse Edilen Veriler:', parsedData)

  // 4. JSON'dan form verilerine dönüştürme
  const formData = convertJsonToInvoiceItemsForm(jsonData)
  console.log('4. Form Verileri:', formData)

  // 5. Başlangıç JSON verisi
  const initialData = getInitialInvoiceItemsFormJson()
  console.log('5. Başlangıç JSON Verisi:', initialData)

  console.log('=== TEST TAMAMLANDI ===')
}

// Örnek kullanım
export const exampleUsage = () => {
  // Fatura kalemleri formunu JSON'a dönüştür
  const invoiceItemsJson = convertInvoiceItemsFormToJson(
    sampleItems,
    'Örnek fatura açıklaması',
    'USD',
    '30,50',
    true,
    'TEVKIFAT',
    true,
    '101',
    ['discount1', 'discount2']
  )

  // JSON string olarak sakla
  const jsonString = convertInvoiceItemsFormToJsonString(invoiceItemsJson)
  
  // Dosyaya kaydet veya API'ye gönder
  console.log('Kaydedilecek JSON:', jsonString)
  
  // Daha sonra JSON string'den geri yükle
  const loadedData = convertJsonStringToInvoiceItemsForm(jsonString)
  
  // Form verilerine dönüştür
  const formData = convertJsonToInvoiceItemsForm(loadedData)
  
  return {
    original: invoiceItemsJson,
    string: jsonString,
    loaded: loadedData,
    formData: formData
  }
}

// Test çalıştır
if (typeof window !== 'undefined') {
  // Sadece browser'da çalıştır
  window.testInvoiceItemsJsonConversion = testInvoiceItemsJsonConversion
  window.exampleUsage = exampleUsage
} 
