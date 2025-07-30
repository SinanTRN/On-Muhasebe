// Fatura kalemleri için JSON interface'leri ve dönüştürme fonksiyonları

// Fatura kalemi JSON interface'i
export interface InvoiceItemJson {
  stockCode: string
  receiverStockCode?: string
  stockName: string
  quantity: string
  unit: string
  unitPrice: string
  vatRate: string
  vatAmount: string
  total: string
  dovizAmount: string
  description: string
  note: string
  tevkifatType?: string
  ozelMatrahType?: string
  discount1?: string
  discount2?: string
  discount3?: string
  discount4?: string
  netAmount?: string
}

// Fatura kalemleri özet bilgileri JSON interface'i
export interface InvoiceSummaryJson {
  totalAmount: string // Mal/Hizmet Toplam Tutarı
  totalDiscount: string // Toplam İskonto
  netTotal: string // Net Tutar (Matrah)
  totalVAT: string // Hesaplanan KDV
  calculatedWithholding: string // Hesaplanan Tevkifat
  totalWithTaxes: string // Vergiler Dahil Toplam Tutar
  payableAmount: string // Ödenecek Tutar
  payableAmountInTRY?: string // TL Karşılığı (döviz ise)
  currency: string
  exchangeRate: string
  includesVAT: boolean
  currentInvoiceType: string
  isWithholdingTax: boolean
  bulkWithholdingType?: string
  activeDiscounts: string[]
}

// Fatura kalemleri ve özet bilgileri kapsayan ana JSON interface'i
export interface InvoiceItemsFormJson {
  items: InvoiceItemJson[]
  summary: InvoiceSummaryJson
  documentNote: string
}

// Türkçe sayı formatını parse eden yardımcı fonksiyon
const parseTurkishNumber = (val: string): number => {
  if (!val) return 0

  if (val.includes(',') && val.includes('.')) {
    if (val.lastIndexOf(',') > val.lastIndexOf('.')) {
      return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
    } else {
      return parseFloat(val.replace(/,/g, '')) || 0
    }
  }

  if (val.includes(',')) {
    return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0
  }

  if (val.includes('.')) {
    return parseFloat(val.replace(/\./g, '')) || 0
  }

  return parseFloat(val) || 0
}

// Türkçe sayı formatını biçimlendiren yardımcı fonksiyon
const formatTurkishNumber = (val: string | number): string => {
  const num = typeof val === 'string' ? parseTurkishNumber(val) : val

  if (isNaN(num)) return ''

  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Fatura kalemini JSON'a dönüştürme
export const convertInvoiceItemToJson = (item: any): InvoiceItemJson => {
  return {
    stockCode: item.stockCode || '',
    receiverStockCode: item.receiverStockCode || '',
    stockName: item.stockName || '',
    quantity: item.quantity || '1',
    unit: item.unit || 'Adet',
    unitPrice: item.unitPrice || '',
    vatRate: item.vatRate || '20',
    vatAmount: item.vatAmount || '',
    total: item.total || '',
    dovizAmount: item.dovizAmount || '',
    description: item.description || '',
    note: item.note || '',
    tevkifatType: item.tevkifatType || '',
    ozelMatrahType: item.ozelMatrahType || '',
    discount1: item.discount1 || '',
    discount2: item.discount2 || '',
    discount3: item.discount3 || '',
    discount4: item.discount4 || '',
    netAmount: item.netAmount || ''
  }
}

// Fatura kalemleri listesini JSON'a dönüştürme
export const convertInvoiceItemsToJson = (items: any[]): InvoiceItemJson[] => {
  return items.map(item => convertInvoiceItemToJson(item))
}

// Özet bilgilerini JSON'a dönüştürme
export const convertInvoiceSummaryToJson = (
  items: any[],
  currency: string,
  exchangeRate: string,
  includesVAT: boolean,
  currentInvoiceType: string,
  isWithholdingTax: boolean,
  bulkWithholdingType: string,
  activeDiscounts: string[]
): InvoiceSummaryJson => {
  // Mal/Hizmet Toplam Tutarı
  const totalAmount = items.reduce((sum, item) => sum + parseTurkishNumber(item.total), 0)

  // Toplam İskonto Hesaplama
  let totalDiscount = 0
  if (activeDiscounts.length > 0) {
    totalDiscount = items.reduce((sum, item) => {
      const unitPrice = parseTurkishNumber(item.unitPrice)
      const quantity = parseTurkishNumber(item.quantity)
      const grossTotal = unitPrice * quantity
      let discountMultiplier = 1
      const discountKeys = ['discount1', 'discount2', 'discount3', 'discount4']

      const discounts = discountKeys.map(key =>
        activeDiscounts.includes(key) ? parseTurkishNumber(item[key] || '0') : 0
      )

      discounts.forEach(d => {
        if (d > 0) {
          discountMultiplier *= 1 - d / 100
        }
      })
      const netAmount = grossTotal * discountMultiplier

      return sum + (grossTotal - netAmount)
    }, 0)
  }

  // Hesaplanan KDV
  const totalVAT = items.reduce((sum, item) => sum + parseTurkishNumber(item.vatAmount), 0)

  // Net Tutar (Matrah): Mal/Hizmet Toplam Tutarı - Toplam İskonto
  const netTotal = totalAmount - totalDiscount

  // Vergiler Dahil Toplam Tutar
  const totalWithTaxes = includesVAT ? netTotal : netTotal + totalVAT

  // Hesaplanan Tevkifat
  let calculatedWithholding = 0
  if (currentInvoiceType === 'TEVKIFAT') {
    if (isWithholdingTax) {
      // Toplu tevkifat hesaplama (bulkWithholdingType kullanılacak)
      // Bu kısım kdvTevkifatOrnekleri'nden oran alınarak hesaplanacak
      calculatedWithholding = 0 // TODO: Implement bulk withholding calculation
    } else {
      // Her satır için ayrı ayrı hesapla
      calculatedWithholding = items.reduce((sum, item) => {
        if (item.tevkifatType && item.tevkifatType !== 'Tevkifat Yok') {
          // TODO: kdvTevkifatOrnekleri'nden oran alınarak hesaplanacak
          return sum + parseTurkishNumber(item.vatAmount) * 0.1 // Örnek %10
        }
        return sum
      }, 0)
    }
  }

  // Ödenecek Tutar
  const payableAmount = currentInvoiceType === 'TEVKIFAT' 
    ? totalWithTaxes - calculatedWithholding 
    : totalWithTaxes

  // TL karşılığı hesaplama (sadece döviz ise)
  let payableAmountInTRY: string | undefined
  const rate = parseFloat(exchangeRate)
  if (currency !== 'TRY' && rate && !isNaN(rate)) {
    payableAmountInTRY = formatTurkishNumber(payableAmount * rate)
  }

  return {
    totalAmount: formatTurkishNumber(totalAmount),
    totalDiscount: formatTurkishNumber(totalDiscount),
    netTotal: formatTurkishNumber(netTotal),
    totalVAT: formatTurkishNumber(totalVAT),
    calculatedWithholding: formatTurkishNumber(calculatedWithholding),
    totalWithTaxes: formatTurkishNumber(totalWithTaxes),
    payableAmount: formatTurkishNumber(payableAmount),
    payableAmountInTRY,
    currency,
    exchangeRate,
    includesVAT,
    currentInvoiceType,
    isWithholdingTax,
    bulkWithholdingType,
    activeDiscounts
  }
}

// Tüm fatura kalemleri formunu JSON'a dönüştürme
export const convertInvoiceItemsFormToJson = (
  items: any[],
  documentNote: string,
  currency: string,
  exchangeRate: string,
  includesVAT: boolean,
  currentInvoiceType: string,
  isWithholdingTax: boolean,
  bulkWithholdingType: string,
  activeDiscounts: string[]
): InvoiceItemsFormJson => {
  return {
    items: convertInvoiceItemsToJson(items),
    summary: convertInvoiceSummaryToJson(
      items,
      currency,
      exchangeRate,
      includesVAT,
      currentInvoiceType,
      isWithholdingTax,
      bulkWithholdingType,
      activeDiscounts
    ),
    documentNote: documentNote || ''
  }
}

// JSON'dan fatura kalemine dönüştürme
export const convertJsonToInvoiceItem = (jsonData: InvoiceItemJson): any => {
  return {
    stockCode: jsonData.stockCode,
    receiverStockCode: jsonData.receiverStockCode,
    stockName: jsonData.stockName,
    quantity: jsonData.quantity,
    unit: jsonData.unit,
    unitPrice: jsonData.unitPrice,
    vatRate: jsonData.vatRate,
    vatAmount: jsonData.vatAmount,
    total: jsonData.total,
    dovizAmount: jsonData.dovizAmount,
    description: jsonData.description,
    note: jsonData.note,
    tevkifatType: jsonData.tevkifatType,
    ozelMatrahType: jsonData.ozelMatrahType,
    discount1: jsonData.discount1,
    discount2: jsonData.discount2,
    discount3: jsonData.discount3,
    discount4: jsonData.discount4,
    netAmount: jsonData.netAmount
  }
}

// JSON'dan fatura kalemleri listesine dönüştürme
export const convertJsonToInvoiceItems = (jsonArray: InvoiceItemJson[]): any[] => {
  return jsonArray.map(jsonData => convertJsonToInvoiceItem(jsonData))
}

// JSON'dan fatura kalemleri formuna dönüştürme
export const convertJsonToInvoiceItemsForm = (jsonData: InvoiceItemsFormJson): {
  items: any[]
  documentNote: string
  summary: any
} => {
  return {
    items: convertJsonToInvoiceItems(jsonData.items),
    documentNote: jsonData.documentNote,
    summary: jsonData.summary
  }
}

// JSON string'e dönüştürme
export const convertInvoiceItemsFormToJsonString = (invoiceItemsFormJson: InvoiceItemsFormJson): string => {
  return JSON.stringify(invoiceItemsFormJson, null, 2)
}

// JSON string'den dönüştürme
export const convertJsonStringToInvoiceItemsForm = (jsonString: string): InvoiceItemsFormJson => {
  return JSON.parse(jsonString)
}

// Başlangıç JSON verisi
export const getInitialInvoiceItemsFormJson = (): InvoiceItemsFormJson => {
  return {
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
  }
} 
