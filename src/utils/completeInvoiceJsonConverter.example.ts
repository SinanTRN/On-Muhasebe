// Tam fatura JSON converter test örneği

import {
  convertCompleteInvoiceToJson,
  convertCompleteInvoiceToJsonString,
  convertJsonStringToCompleteInvoice,
  getInitialCompleteInvoiceJson,
  updateInvoiceStatus,
  type CompleteInvoiceJson
} from './completeInvoiceJsonConverter'
import type { Tbl } from '@/types/apps/cariTypes'

// Window interface'ini genişlet
declare global {
  interface Window {
    testCompleteInvoiceJsonConversion: () => void
    exampleCompleteInvoiceUsage: () => any
  }
}

// Örnek müşteri verisi (Tbl formatında)
const sampleCustomer: Tbl = {
  IND: 1,
  VN: 'CARI001',
  CAR_TIP: 'Müşteri',
  LOGO: null,
  CARI_KOD: 'C001',
  MUH_ENT_CARI_KOD: 'C001',
  UNVAN: 'ABC Ltd. Şti.',
  AD: 'ABC Ltd. Şti.',
  SOYAD: '',
  GSM_1: '0555 123 45 67',
  GSM_2: '',
  TEL: '0216 123 45 67',
  FAKS: '',
  ADRES: 'Atatürk Cad. No:123, Kadıköy/İstanbul',
  ULKE: 'Türkiye',
  IL: 'İstanbul',
  ILCE: 'Kadıköy',
  POSTA_KODU: '34700',
  VD: 'Kadıköy',
  EPOSTA: 'info@abc.com',
  WEB: 'www.abc.com',
  LIMIT: 100000,
  VADE: 30,
  OK: true,
  OT: false,
  GK: false,
  GT: false,
  PASIF: false,
  SILINDI: false
}

// Örnek fatura bilgileri
const sampleInvoiceInfo = {
  documentNo: 'FAT-2025-001',
  description: 'Test Faturası',
  issueDate: new Date('2025-01-15'),
  shipmentDate: new Date('2025-01-15'),
  dueDate: new Date('2025-01-30'),
  branch: 'Merkez',
  scenario: 'TEMELFATURA',
  invoiceType: 'NORMAL',
  status: 'CLOSED',
  isEInvoice: false
}

// Örnek fatura kalemleri
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
export const testCompleteInvoiceJsonConversion = () => {
  console.log('=== TAM FATURA JSON DÖNÜŞTÜRME TESTİ ===')

  // 1. Tam fatura verilerini JSON'a dönüştürme
  const completeInvoiceJson = convertCompleteInvoiceToJson(
    // Cari bilgileri
    sampleCustomer,
    null, // Farklı müşteri yok
    
    // Fatura bilgileri
    sampleInvoiceInfo,
    { orderNumber: '', orderDate: null, deliveryNumber: '', deliveryDate: null },
    { site: '', orderNo: '', orderDate: null },
    [],
    { type: '' },
    { vknTckno: '', title: '', shipmentDate: null },
    { method: 'KREDI/BANKA KARTI', paymentDate: null, agent: '' },
    'TRY',
    '',
    false,
    false,
    false,
    false,
    false,
    '',
    '',
    
    // Fatura kalemleri
    sampleItems,
    'Test fatura açıklaması',
    ['discount1'],
    
    // Meta bilgileri
    {
      status: 'draft'
    }
  )

  console.log('1. Tam Fatura JSON Verileri:', completeInvoiceJson)

  // 2. JSON string'e dönüştürme
  const jsonString = convertCompleteInvoiceToJsonString(completeInvoiceJson)
  console.log('2. JSON String:', jsonString)

  // 3. JSON string'den geri dönüştürme
  const parsedData = convertJsonStringToCompleteInvoice(jsonString)
  console.log('3. Parse Edilen Veriler:', parsedData)

  // 4. Fatura durumunu güncelleme
  const updatedInvoice = updateInvoiceStatus(completeInvoiceJson, 'sent')
  console.log('4. Güncellenmiş Fatura:', updatedInvoice)

  // 5. Başlangıç JSON verisi
  const initialData = getInitialCompleteInvoiceJson()
  console.log('5. Başlangıç JSON Verisi:', initialData)

  console.log('=== TEST TAMAMLANDI ===')
}

// Örnek kullanım
export const exampleCompleteInvoiceUsage = () => {
  // Tam fatura verilerini JSON'a dönüştür
  const completeInvoiceJson = convertCompleteInvoiceToJson(
    sampleCustomer,
    null,
    sampleInvoiceInfo,
    { orderNumber: 'SIP-001', orderDate: new Date('2025-01-10'), deliveryNumber: 'IRS-001', deliveryDate: new Date('2025-01-12') },
    { site: 'n11', orderNo: 'N11-001', orderDate: new Date('2025-01-08') },
    [{ returnNo: 'IADE-001', returnDate: new Date('2025-01-05') }],
    { type: '101' },
    { vknTckno: '12345678901', title: 'Kargo Şirketi', shipmentDate: new Date('2025-01-13') },
    { method: 'EFT/HAVALE', paymentDate: new Date('2025-01-30'), agent: 'Banka' },
    'USD',
    '30,50',
    true,
    true,
    true,
    true,
    true,
    '101',
    '001',
    sampleItems,
    'Detaylı fatura açıklaması',
    ['discount1', 'discount2'],
    {
      status: 'draft',
      userId: 'USER001',
      companyId: 'COMP001'
    }
  )

  // JSON string olarak sakla
  const jsonString = convertCompleteInvoiceToJsonString(completeInvoiceJson)
  
  // Dosyaya kaydet veya API'ye gönder
  console.log('Kaydedilecek Tam Fatura JSON:', jsonString)
  
  // Daha sonra JSON string'den geri yükle
  const loadedData = convertJsonStringToCompleteInvoice(jsonString)
  
  return {
    original: completeInvoiceJson,
    string: jsonString,
    loaded: loadedData
  }
}

// Test çalıştır
if (typeof window !== 'undefined') {
  // Sadece browser'da çalıştır
  window.testCompleteInvoiceJsonConversion = testCompleteInvoiceJsonConversion
  window.exampleCompleteInvoiceUsage = exampleCompleteInvoiceUsage
} 
