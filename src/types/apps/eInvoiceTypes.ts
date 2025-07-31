// E-Fatura formunun tüm alanlarını kapsayan ana tipler

export type InvoiceRow = {
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
  
  export interface CustomerInfo {
    // Temel bilgiler
    id: string
    name: string
    taxNumber: string
    address: string
    email: string
    phone: string
    country: string
    city: string
    district: string
    
    // E-Fatura formunda kullanılan ek alanlar
    customerType?: string
    customerCode?: string
    firstName?: string
    lastName?: string
    mobilePhone?: string
    fax?: string
    postalCode?: string
    taxOffice?: string
    website?: string
    limit?: number
    dueDate?: number
    isActive?: boolean
    isPassive?: boolean
    isDeleted?: boolean
  }
  
  export interface DeliveryAndOrderInfo {
    orderNumber: string
    orderDate: Date | null
    deliveryNumber: string
    deliveryDate: Date | null
  }
  
  export interface OrderInfo {
    site: string
    orderNo: string
    orderDate: Date | null
  }
  
  export interface ReturnInfo {
    returnNo: string
    returnDate: Date | null
  }
  
  export interface WithholdingTaxInfo {
    type: string
  }
  
  export interface ShipmentInfo {
    vknTckno: string
    title: string
    shipmentDate: Date | null
  }
  
  export interface PaymentInfo {
    method: string
    paymentDate: Date | null
    agent: string
  }
  
  export interface InvoiceInfo {
    documentNo: string
    description: string
    issueDate: Date
    shipmentDate: Date
    dueDate: Date
    branch: string
    scenario: string
    invoiceType: string
    status: string
    isEInvoice: boolean
  }

  // Gelen ve giden faturalar için ek alanlar
  export interface IncomingInvoiceInfo extends InvoiceInfo {
    // Gelen fatura özel alanları
    senderVknTckno: string
    senderName: string
    senderAddress: string
    senderEmail: string
    senderPhone: string
    receivedAt: Date
    processingStatus: 'pending' | 'processed' | 'error'
    errorMessage?: string
    originalXmlContent?: string
    responseXmlContent?: string
    isRead: boolean
    isArchived: boolean
    tags: string[]
    notes: string
  }

  export interface OutgoingInvoiceInfo extends InvoiceInfo {
    // Giden fatura özel alanları
    recipientVknTckno: string
    recipientName: string
    recipientAddress: string
    recipientEmail: string
    recipientPhone: string
    sentAt: Date
    deliveryStatus: 'pending' | 'delivered' | 'failed' | 'cancelled'
    deliveryAttempts: number
    lastDeliveryAttempt?: Date
    deliveryErrorMessage?: string
    isConfirmed: boolean
    confirmationDate?: Date
    isArchived: boolean
    tags: string[]
    notes: string
  }
  
  // EInvoiceCard alanları
  export interface EInvoiceForm {
    customer: CustomerInfo | null
    differentCustomer?: CustomerInfo | null
    invoiceInfo: InvoiceInfo
    deliveryAndOrderInfo: DeliveryAndOrderInfo
    orderInfo: OrderInfo
    returnInfoList: ReturnInfo[]
    withholdingTaxInfo: WithholdingTaxInfo
    shipmentInfo: ShipmentInfo
    paymentInfo: PaymentInfo
    includesVAT: boolean
    currency: string
    exchangeRate: string
    isWithholdingTax: boolean
    bulkWithholdingType?: string
    selectedIstisna?: string
  
    // EInvoiceItemsTable alanları
    items: InvoiceRow[]
    documentNote: string
    activeDiscounts: string[]
  }

  // Gelen fatura formu
  export interface IncomingEInvoiceForm extends EInvoiceForm {
    invoiceInfo: IncomingInvoiceInfo
    // Gelen fatura özel alanları
    senderInfo: CustomerInfo
    processingOptions: {
      autoProcess: boolean
      autoArchive: boolean
      autoTag: string[]
    }
  }

  // Giden fatura formu
  export interface OutgoingEInvoiceForm extends EInvoiceForm {
    invoiceInfo: OutgoingInvoiceInfo
    // Giden fatura özel alanları
    recipientInfo: CustomerInfo
    deliveryOptions: {
      autoSend: boolean
      requireConfirmation: boolean
      retryAttempts: number
      retryInterval: number // dakika
    }
  }
  
  // Başlangıç state'i için örnek
  export const initialEInvoiceForm: EInvoiceForm = {
    customer: null,
    differentCustomer: null,
    invoiceInfo: {
      documentNo: '',
      description: '',
      issueDate: new Date(),
      shipmentDate: new Date(),
      dueDate: new Date(),
      branch: '',
      scenario: 'TEMELFATURA',
      invoiceType: 'NORMAL',
      status: 'CLOSED',
      isEInvoice: false
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
    returnInfoList: [{ returnNo: '', returnDate: null }],
    withholdingTaxInfo: { type: '' },
    shipmentInfo: { vknTckno: '', title: '', shipmentDate: null },
    paymentInfo: { method: 'KREDI/BANKA KARTI', paymentDate: null, agent: '' },
    includesVAT: false,
    currency: 'TRY',
    exchangeRate: '',
    isWithholdingTax: false,
    bulkWithholdingType: '',
    selectedIstisna: '',
    items: [],
    documentNote: '',
    activeDiscounts: []
  }

  // Gelen fatura başlangıç state'i
  export const initialIncomingEInvoiceForm: IncomingEInvoiceForm = {
    ...initialEInvoiceForm,
    invoiceInfo: {
      ...initialEInvoiceForm.invoiceInfo,
      senderVknTckno: '',
      senderName: '',
      senderAddress: '',
      senderEmail: '',
      senderPhone: '',
      receivedAt: new Date(),
      processingStatus: 'pending',
      isRead: false,
      isArchived: false,
      tags: [],
      notes: ''
    },
    senderInfo: {
      id: '',
      name: '',
      taxNumber: '',
      address: '',
      email: '',
      phone: '',
      country: 'Türkiye',
      city: '',
      district: ''
    },
    processingOptions: {
      autoProcess: false,
      autoArchive: false,
      autoTag: []
    }
  }

  // Giden fatura başlangıç state'i
  export const initialOutgoingEInvoiceForm: OutgoingEInvoiceForm = {
    ...initialEInvoiceForm,
    invoiceInfo: {
      ...initialEInvoiceForm.invoiceInfo,
      recipientVknTckno: '',
      recipientName: '',
      recipientAddress: '',
      recipientEmail: '',
      recipientPhone: '',
      sentAt: new Date(),
      deliveryStatus: 'pending',
      deliveryAttempts: 0,
      isConfirmed: false,
      isArchived: false,
      tags: [],
      notes: ''
    },
    recipientInfo: {
      id: '',
      name: '',
      taxNumber: '',
      address: '',
      email: '',
      phone: '',
      country: 'Türkiye',
      city: '',
      district: ''
    },
    deliveryOptions: {
      autoSend: false,
      requireConfirmation: true,
      retryAttempts: 3,
      retryInterval: 5
    }
  } 
