import type { IncomingEInvoiceForm } from '@/types/apps/eInvoiceTypes'

// Gelen faturalar için örnek JSON verileri
export const sampleIncomingInvoiceJsons = [
  {
    // Temel fatura bilgileri
    documentNo: "EFTR-20251000",
    description: "Yazılım Danışmanlık Hizmeti",
    issueDate: "2025-06-01T16:00:00.000Z",
    shipmentDate: "2025-06-01T16:00:00.000Z",
    dueDate: "2025-06-15T16:00:00.000Z",
    branch: "Merkez",
    scenario: "TEMELFATURA",
    invoiceType: "NORMAL",
    status: "CLOSED",
    isEInvoice: true,
    
    // Gelen fatura özel alanları
    senderVknTckno: "25743430302",
    senderName: "Vega Danışmanlık Ltd. Şti.",
    senderAddress: "Atatürk Caddesi No:123, Kadıköy/İstanbul",
    senderEmail: "info@vegadanismanlik.com",
    senderPhone: "0216 555 1234",
    receivedAt: "2025-06-01T16:00:00.000Z",
    processingStatus: "processed",
    errorMessage: "",
    originalXmlContent: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
    responseXmlContent: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
    isRead: false,
    isArchived: false,
    tags: ["yazılım", "danışmanlık"],
    notes: "Önemli müşteri",

    // Müşteri bilgileri
    sender: {
      VN: "SENDER001",
      name: "Vega Danışmanlık Ltd. Şti.",
      taxNumber: "25743430302",
      address: "Atatürk Caddesi No:123, Kadıköy/İstanbul",
      email: "info@vegadanismanlik.com",
      phone: "0216 555 1234",
      country: "Türkiye",
      city: "İstanbul",
      district: "Kadıköy",
      customerType: "KURUM",
      customerCode: "VEGA001",
      firstName: "",
      lastName: "",
      mobilePhone: "0555 123 4567",
      fax: "0216 555 1235",
      postalCode: "34700",
      taxOffice: "Kadıköy",
      website: "www.vegadanismanlik.com",
      limit: 50000,
      dueDate: 30,
      isActive: true,
      isPassive: false,
      isDeleted: false
    },

    // Sipariş ve teslimat bilgileri
    deliveryAndOrderInfo: {
      orderNumber: "SIP-2025-001",
      orderDate: "2025-05-15T10:00:00.000Z",
      deliveryNumber: "TES-2025-001",
      deliveryDate: "2025-05-20T14:00:00.000Z"
    },

    // E-ticaret bilgileri
    orderInfo: {
      site: "www.vegadanismanlik.com",
      orderNo: "WEB-2025-001",
      orderDate: "2025-05-15T10:00:00.000Z"
    },

    // İade bilgileri
    returnInfoList: [
      {
        returnNo: "IADE-2025-001",
        returnDate: null
      }
    ],

    // Tevkifat bilgileri
    withholdingTaxInfo: {
      type: "TEVKIFAT_YOK"
    },

    // Gönderim bilgileri
    shipmentInfo: {
      vknTckno: "25743430302",
      title: "Vega Danışmanlık",
      shipmentDate: "2025-06-01T16:00:00.000Z"
    },

    // Ödeme bilgileri
    paymentInfo: {
      method: "HAVALE/EFT",
      paymentDate: null,
      agent: "Garanti BBVA"
    },

    // Fatura ayarları
    currency: "TRY",
    exchangeRate: "1.00",
    includesVAT: true,
    isWithholdingTax: false,
    bulkWithholdingType: "",
    selectedIstisna: "",

    // Fatura kalemleri
    items: [
      {
        stockCode: "YAZ001",
        receiverStockCode: "",
        stockName: "Yazılım Danışmanlık Hizmeti",
        quantity: "1",
        unit: "ADET",
        unitPrice: "9815.42",
        vatRate: "20",
        vatAmount: "1963.08",
        total: "11778.50",
        dovizAmount: "9815.42",
        description: "Aylık yazılım danışmanlık hizmeti",
        note: "Özel not",
        tevkifatType: "",
        ozelMatrahType: "",
        discount1: "",
        discount2: "",
        discount3: "",
        discount4: "",
        netAmount: "9815.42"
      }
    ],

    // Belge notu ve indirimler
    documentNote: "Fatura notu buraya yazılacak",
    activeDiscounts: [],

    // İşleme seçenekleri
    processingOptions: {
      autoProcess: true,
      autoArchive: false,
      autoTag: ["otomatik", "yazılım"]
    },

    // Meta bilgileri
    meta: {
      type: "incoming",
      createdAt: "2025-06-01T16:00:00.000Z",
      updatedAt: "2025-06-01T16:00:00.000Z",
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  },
  {
    // Temel fatura bilgileri
    documentNo: "EFTR-20251001",
    description: "Teknoloji Danışmanlık Hizmeti",
    issueDate: "2025-06-02T08:00:00.000Z",
    shipmentDate: "2025-06-02T08:00:00.000Z",
    dueDate: "2025-06-16T08:00:00.000Z",
    branch: "Merkez",
    scenario: "TEMELFATURA",
    invoiceType: "NORMAL",
    status: "CLOSED",
    isEInvoice: true,
    
    // Gelen fatura özel alanları
    senderVknTckno: "15769698858",
    senderName: "Beta Teknoloji A.Ş.",
    senderAddress: "Teknoloji Mahallesi No:456, Çankaya/Ankara",
    senderEmail: "info@betateknoloji.com",
    senderPhone: "0312 555 5678",
    receivedAt: "2025-06-02T08:00:00.000Z",
    processingStatus: "processed",
    errorMessage: "",
    originalXmlContent: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
    responseXmlContent: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
    isRead: false,
    isArchived: false,
    tags: ["teknoloji", "danışmanlık"],
    notes: "Yeni müşteri",

    // Müşteri bilgileri
    sender: {
      VN: "SENDER002",
      name: "Beta Teknoloji A.Ş.",
      taxNumber: "15769698858",
      address: "Teknoloji Mahallesi No:456, Çankaya/Ankara",
      email: "info@betateknoloji.com",
      phone: "0312 555 5678",
      country: "Türkiye",
      city: "Ankara",
      district: "Çankaya",
      customerType: "KURUM",
      customerCode: "BETA001",
      firstName: "",
      lastName: "",
      mobilePhone: "0555 567 8901",
      fax: "0312 555 5679",
      postalCode: "06100",
      taxOffice: "Çankaya",
      website: "www.betateknoloji.com",
      limit: 75000,
      dueDate: 30,
      isActive: true,
      isPassive: false,
      isDeleted: false
    },

    // Sipariş ve teslimat bilgileri
    deliveryAndOrderInfo: {
      orderNumber: "SIP-2025-002",
      orderDate: "2025-05-16T11:00:00.000Z",
      deliveryNumber: "TES-2025-002",
      deliveryDate: "2025-05-21T15:00:00.000Z"
    },

    // E-ticaret bilgileri
    orderInfo: {
      site: "www.betateknoloji.com",
      orderNo: "WEB-2025-002",
      orderDate: "2025-05-16T11:00:00.000Z"
    },

    // İade bilgileri
    returnInfoList: [],

    // Tevkifat bilgileri
    withholdingTaxInfo: {
      type: "TEVKIFAT_YOK"
    },

    // Gönderim bilgileri
    shipmentInfo: {
      vknTckno: "15769698858",
      title: "Beta Teknoloji",
      shipmentDate: "2025-06-02T08:00:00.000Z"
    },

    // Ödeme bilgileri
    paymentInfo: {
      method: "KREDI/BANKA KARTI",
      paymentDate: null,
      agent: "İş Bankası"
    },

    // Fatura ayarları
    currency: "TRY",
    exchangeRate: "1.00",
    includesVAT: true,
    isWithholdingTax: false,
    bulkWithholdingType: "",
    selectedIstisna: "",

    // Fatura kalemleri
    items: [
      {
        stockCode: "TEK001",
        receiverStockCode: "",
        stockName: "Teknoloji Danışmanlık Hizmeti",
        quantity: "1",
        unit: "ADET",
        unitPrice: "11260.94",
        vatRate: "20",
        vatAmount: "2252.19",
        total: "13513.13",
        dovizAmount: "11260.94",
        description: "Aylık teknoloji danışmanlık hizmeti",
        note: "",
        tevkifatType: "",
        ozelMatrahType: "",
        discount1: "",
        discount2: "",
        discount3: "",
        discount4: "",
        netAmount: "11260.94"
      }
    ],

    // Belge notu ve indirimler
    documentNote: "",
    activeDiscounts: [],

    // İşleme seçenekleri
    processingOptions: {
      autoProcess: true,
      autoArchive: false,
      autoTag: ["otomatik", "teknoloji"]
    },

    // Meta bilgileri
    meta: {
      type: "incoming",
      createdAt: "2025-06-02T08:00:00.000Z",
      updatedAt: "2025-06-02T08:00:00.000Z",
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  }
]

// Gelen fatura form verilerini JSON'a dönüştürme fonksiyonu
export const convertIncomingInvoiceFormToJson = (formData: IncomingEInvoiceForm) => {
  return {
    // Temel fatura bilgileri
    documentNo: formData.invoiceInfo.documentNo,
    description: formData.invoiceInfo.description,
    issueDate: formData.invoiceInfo.issueDate.toISOString(),
    shipmentDate: formData.invoiceInfo.shipmentDate.toISOString(),
    dueDate: formData.invoiceInfo.dueDate.toISOString(),
    branch: formData.invoiceInfo.branch,
    scenario: formData.invoiceInfo.scenario,
    invoiceType: formData.invoiceInfo.invoiceType,
    status: formData.invoiceInfo.status,
    isEInvoice: formData.invoiceInfo.isEInvoice,
    
    // Gelen fatura özel alanları
    senderVknTckno: formData.invoiceInfo.senderVknTckno,
    senderName: formData.invoiceInfo.senderName,
    senderAddress: formData.invoiceInfo.senderAddress,
    senderEmail: formData.invoiceInfo.senderEmail,
    senderPhone: formData.invoiceInfo.senderPhone,
    receivedAt: formData.invoiceInfo.receivedAt.toISOString(),
    processingStatus: formData.invoiceInfo.processingStatus,
    errorMessage: formData.invoiceInfo.errorMessage,
    originalXmlContent: formData.invoiceInfo.originalXmlContent,
    responseXmlContent: formData.invoiceInfo.responseXmlContent,
    isRead: formData.invoiceInfo.isRead,
    isArchived: formData.invoiceInfo.isArchived,
    tags: formData.invoiceInfo.tags,
    notes: formData.invoiceInfo.notes,

    // Müşteri bilgileri
    sender: formData.senderInfo,

    // Diğer bilgiler...
    deliveryAndOrderInfo: formData.deliveryAndOrderInfo,
    orderInfo: formData.orderInfo,
    returnInfoList: formData.returnInfoList,
    withholdingTaxInfo: formData.withholdingTaxInfo,
    shipmentInfo: formData.shipmentInfo,
    paymentInfo: formData.paymentInfo,
    currency: formData.currency,
    exchangeRate: formData.exchangeRate,
    includesVAT: formData.includesVAT,
    isWithholdingTax: formData.isWithholdingTax,
    bulkWithholdingType: formData.bulkWithholdingType,
    selectedIstisna: formData.selectedIstisna,
    items: formData.items,
    documentNote: formData.documentNote,
    activeDiscounts: formData.activeDiscounts,
    processingOptions: formData.processingOptions,

    // Meta bilgileri
    meta: {
      type: "incoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  }
} 
