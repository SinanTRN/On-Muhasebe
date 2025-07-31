import type { OutgoingEInvoiceForm } from '@/types/apps/eInvoiceTypes'

// Giden faturalar için örnek JSON verileri
export const sampleOutgoingInvoiceJsons = [
  {
    // Temel fatura bilgileri
    documentNo: "EFTR-20251025",
    description: "Yazılım Geliştirme Hizmeti",
    issueDate: "2025-06-26T12:00:00.000Z",
    shipmentDate: "2025-06-26T12:00:00.000Z",
    dueDate: "2025-07-10T12:00:00.000Z",
    branch: "Merkez",
    scenario: "TEMELFATURA",
    invoiceType: "NORMAL",
    status: "CLOSED",
    isEInvoice: true,
    
    // Giden fatura özel alanları
    recipientVknTckno: "83458910314",
    recipientName: "Gamma Yazılım Ltd. Şti.",
    recipientAddress: "Yazılım Caddesi No:789, Beşiktaş/İstanbul",
    recipientEmail: "info@gammayazilim.com",
    recipientPhone: "0212 555 9012",
    sentAt: "2025-06-26T12:00:00.000Z",
    deliveryStatus: "delivered",
    deliveryAttempts: 1,
    lastDeliveryAttempt: "2025-06-26T12:05:00.000Z",
    deliveryErrorMessage: "",
    isConfirmed: true,
    confirmationDate: "2025-06-26T12:10:00.000Z",
    isArchived: false,
    tags: ["yazılım", "geliştirme"],
    notes: "Önemli proje",

    // Müşteri bilgileri
    recipient: {
      VN: "RECIPIENT001",
      name: "Gamma Yazılım Ltd. Şti.",
      taxNumber: "83458910314",
      address: "Yazılım Caddesi No:789, Beşiktaş/İstanbul",
      email: "info@gammayazilim.com",
      phone: "0212 555 9012",
      country: "Türkiye",
      city: "İstanbul",
      district: "Beşiktaş",
      customerType: "KURUM",
      customerCode: "GAMMA001",
      firstName: "",
      lastName: "",
      mobilePhone: "0555 901 2345",
      fax: "0212 555 9013",
      postalCode: "34353",
      taxOffice: "Beşiktaş",
      website: "www.gammayazilim.com",
      limit: 100000,
      dueDate: 30,
      isActive: true,
      isPassive: false,
      isDeleted: false
    },

    // Sipariş ve teslimat bilgileri
    deliveryAndOrderInfo: {
      orderNumber: "SIP-2025-025",
      orderDate: "2025-06-10T09:00:00.000Z",
      deliveryNumber: "TES-2025-025",
      deliveryDate: "2025-06-15T16:00:00.000Z"
    },

    // E-ticaret bilgileri
    orderInfo: {
      site: "www.gammayazilim.com",
      orderNo: "WEB-2025-025",
      orderDate: "2025-06-10T09:00:00.000Z"
    },

    // İade bilgileri
    returnInfoList: [],

    // Tevkifat bilgileri
    withholdingTaxInfo: {
      type: "TEVKIFAT_YOK"
    },

    // Gönderim bilgileri
    shipmentInfo: {
      vknTckno: "83458910314",
      title: "Gamma Yazılım",
      shipmentDate: "2025-06-26T12:00:00.000Z"
    },

    // Ödeme bilgileri
    paymentInfo: {
      method: "HAVALE/EFT",
      paymentDate: null,
      agent: "Ziraat Bankası"
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
        stockCode: "YAZ002",
        receiverStockCode: "",
        stockName: "Yazılım Geliştirme Hizmeti",
        quantity: "1",
        unit: "ADET",
        unitPrice: "21510.03",
        vatRate: "20",
        vatAmount: "4302.01",
        total: "25812.04",
        dovizAmount: "21510.03",
        description: "Aylık yazılım geliştirme hizmeti",
        note: "Özel proje notu",
        tevkifatType: "",
        ozelMatrahType: "",
        discount1: "",
        discount2: "",
        discount3: "",
        discount4: "",
        netAmount: "21510.03"
      }
    ],

    // Belge notu ve indirimler
    documentNote: "Proje teslim tarihi: 15 Temmuz 2025",
    activeDiscounts: [],

    // Teslimat seçenekleri
    deliveryOptions: {
      autoSend: true,
      requireConfirmation: true,
      retryAttempts: 3,
      retryInterval: 5
    },

    // Meta bilgileri
    meta: {
      type: "outgoing",
      createdAt: "2025-06-26T12:00:00.000Z",
      updatedAt: "2025-06-26T12:00:00.000Z",
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  },
  {
    // Temel fatura bilgileri
    documentNo: "EFTR-20251026",
    description: "Sistem Entegrasyon Hizmeti",
    issueDate: "2025-06-27T14:00:00.000Z",
    shipmentDate: "2025-06-27T14:00:00.000Z",
    dueDate: "2025-07-11T14:00:00.000Z",
    branch: "Merkez",
    scenario: "TEMELFATURA",
    invoiceType: "NORMAL",
    status: "CLOSED",
    isEInvoice: true,
    
    // Giden fatura özel alanları
    recipientVknTckno: "38756183616",
    recipientName: "ABC Ltd. Şti.",
    recipientAddress: "Teknoloji Mahallesi No:321, Çankaya/Ankara",
    recipientEmail: "info@abcltd.com",
    recipientPhone: "0312 555 3456",
    sentAt: "2025-06-27T14:00:00.000Z",
    deliveryStatus: "delivered",
    deliveryAttempts: 1,
    lastDeliveryAttempt: "2025-06-27T14:03:00.000Z",
    deliveryErrorMessage: "",
    isConfirmed: false,
    confirmationDate: null,
    isArchived: false,
    tags: ["sistem", "entegrasyon"],
    notes: "Kritik sistem",

    // Müşteri bilgileri
    recipient: {
      VN: "RECIPIENT002",
      name: "ABC Ltd. Şti.",
      taxNumber: "38756183616",
      address: "Teknoloji Mahallesi No:321, Çankaya/Ankara",
      email: "info@abcltd.com",
      phone: "0312 555 3456",
      country: "Türkiye",
      city: "Ankara",
      district: "Çankaya",
      customerType: "KURUM",
      customerCode: "ABC001",
      firstName: "",
      lastName: "",
      mobilePhone: "0555 345 6789",
      fax: "0312 555 3457",
      postalCode: "06100",
      taxOffice: "Çankaya",
      website: "www.abcltd.com",
      limit: 150000,
      dueDate: 30,
      isActive: true,
      isPassive: false,
      isDeleted: false
    },

    // Sipariş ve teslimat bilgileri
    deliveryAndOrderInfo: {
      orderNumber: "SIP-2025-026",
      orderDate: "2025-06-11T10:00:00.000Z",
      deliveryNumber: "TES-2025-026",
      deliveryDate: "2025-06-16T17:00:00.000Z"
    },

    // E-ticaret bilgileri
    orderInfo: {
      site: "www.abcltd.com",
      orderNo: "WEB-2025-026",
      orderDate: "2025-06-11T10:00:00.000Z"
    },

    // İade bilgileri
    returnInfoList: [],

    // Tevkifat bilgileri
    withholdingTaxInfo: {
      type: "TEVKIFAT_YOK"
    },

    // Gönderim bilgileri
    shipmentInfo: {
      vknTckno: "38756183616",
      title: "ABC Ltd.",
      shipmentDate: "2025-06-27T14:00:00.000Z"
    },

    // Ödeme bilgileri
    paymentInfo: {
      method: "KREDI/BANKA KARTI",
      paymentDate: null,
      agent: "Yapı Kredi"
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
        stockCode: "SIS001",
        receiverStockCode: "",
        stockName: "Sistem Entegrasyon Hizmeti",
        quantity: "1",
        unit: "ADET",
        unitPrice: "15125.08",
        vatRate: "20",
        vatAmount: "3025.02",
        total: "18150.10",
        dovizAmount: "15125.08",
        description: "Aylık sistem entegrasyon hizmeti",
        note: "",
        tevkifatType: "",
        ozelMatrahType: "",
        discount1: "",
        discount2: "",
        discount3: "",
        discount4: "",
        netAmount: "15125.08"
      }
    ],

    // Belge notu ve indirimler
    documentNote: "",
    activeDiscounts: [],

    // Teslimat seçenekleri
    deliveryOptions: {
      autoSend: true,
      requireConfirmation: true,
      retryAttempts: 3,
      retryInterval: 5
    },

    // Meta bilgileri
    meta: {
      type: "outgoing",
      createdAt: "2025-06-27T14:00:00.000Z",
      updatedAt: "2025-06-27T14:00:00.000Z",
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  }
]

// Giden fatura form verilerini JSON'a dönüştürme fonksiyonu
export const convertOutgoingInvoiceFormToJson = (formData: OutgoingEInvoiceForm) => {
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
    
    // Giden fatura özel alanları
    recipientVknTckno: formData.invoiceInfo.recipientVknTckno,
    recipientName: formData.invoiceInfo.recipientName,
    recipientAddress: formData.invoiceInfo.recipientAddress,
    recipientEmail: formData.invoiceInfo.recipientEmail,
    recipientPhone: formData.invoiceInfo.recipientPhone,
    sentAt: formData.invoiceInfo.sentAt.toISOString(),
    deliveryStatus: formData.invoiceInfo.deliveryStatus,
    deliveryAttempts: formData.invoiceInfo.deliveryAttempts,
    lastDeliveryAttempt: formData.invoiceInfo.lastDeliveryAttempt?.toISOString(),
    deliveryErrorMessage: formData.invoiceInfo.deliveryErrorMessage,
    isConfirmed: formData.invoiceInfo.isConfirmed,
    confirmationDate: formData.invoiceInfo.confirmationDate?.toISOString(),
    isArchived: formData.invoiceInfo.isArchived,
    tags: formData.invoiceInfo.tags,
    notes: formData.invoiceInfo.notes,

    // Müşteri bilgileri
    recipient: formData.recipientInfo,

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
    deliveryOptions: formData.deliveryOptions,

    // Meta bilgileri
    meta: {
      type: "outgoing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0",
      source: "e-fatura-sistemi"
    }
  }
} 
