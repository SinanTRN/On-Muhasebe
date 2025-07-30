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
