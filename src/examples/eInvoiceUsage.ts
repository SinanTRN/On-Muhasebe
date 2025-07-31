import {
  initialIncomingEInvoiceForm,
  initialOutgoingEInvoiceForm,
  type IncomingEInvoiceForm,
  type OutgoingEInvoiceForm
} from '@/types/apps/eInvoiceTypes'
import { convertIncomingInvoiceFormToJson, getInitialIncomingInvoiceJson, type IncomingInvoiceJson } from '@/utils/incomingInvoiceJsonConverter'
import { convertOutgoingInvoiceFormToJson, getInitialOutgoingInvoiceJson, type OutgoingInvoiceJson } from '@/utils/outgoingInvoiceJsonConverter'
import { convertCompleteInvoiceToJson, type CompleteInvoiceJson, isIncomingInvoice, isOutgoingInvoice, isGeneralInvoice } from '@/utils/completeInvoiceJsonConverter'

// Birleşik örnek fatura verisi - hem gelen hem giden faturalar için
export const createUnifiedSampleInvoice = (invoiceType: 'incoming' | 'outgoing' = 'incoming') => {
  const baseData = {
    customer: {
      id: 'CUST001',
      name: 'ABC Şirketi A.Ş.',
      taxNumber: '1234567890',
      address: 'İstanbul, Türkiye',
      email: 'info@abc.com',
      phone: '0212 123 45 67',
      country: 'Türkiye',
      city: 'İstanbul',
      district: 'Kadıköy'
    },
    differentCustomer: null,
    invoiceInfo: {
      documentNo: invoiceType === 'incoming' ? 'INV-2024-001' : 'OUT-2024-001',
      description: invoiceType === 'incoming' ? 'Gelen fatura örneği' : 'Giden fatura örneği',
      issueDate: new Date('2024-01-15'),
      shipmentDate: new Date('2024-01-15'),
      dueDate: new Date('2024-01-30'),
      branch: 'Ana Şube',
      scenario: 'TEMELFATURA',
      invoiceType: 'NORMAL',
      status: 'CLOSED',
      isEInvoice: true,
      currency: 'TRY',
      exchangeRate: '1',
      includesVAT: true,
      isWithholdingTax: false,
      bulkWithholdingType: '',
      selectedIstisna: '',
      tags: [invoiceType, 'örnek'],
      notes: `Bu bir örnek ${invoiceType === 'incoming' ? 'gelen' : 'giden'} faturadır`
    },
    deliveryAndOrderInfo: {
      orderNumber: 'SIP-001',
      orderDate: new Date('2024-01-10'),
      deliveryNumber: 'TES-001',
      deliveryDate: new Date('2024-01-12')
    },
    orderInfo: {
      site: 'Web Sitesi',
      orderNo: 'WEB-001',
      orderDate: new Date('2024-01-10')
    },
    returnInfoList: [],
    withholdingTaxInfo: {
      type: ''
    },
    shipmentInfo: {
      vknTckno: '9876543210',
      title: 'Kargo Şirketi',
      shipmentDate: new Date('2024-01-12')
    },
    paymentInfo: {
      method: 'KREDI/BANKA KARTI',
      paymentDate: new Date('2024-01-15'),
      agent: 'Banka'
    },
    currency: 'TRY',
    exchangeRate: '1',
    includesVAT: true,
    isWithholdingTax: false,
    bulkWithholdingType: '',
    selectedIstisna: '',
    items: [
      {
        stockCode: 'STK001',
        stockName: 'Laptop',
        quantity: '2',
        unit: 'Adet',
        unitPrice: '15000',
        vatRate: '20',
        vatAmount: '6000',
        total: '36000',
        dovizAmount: '36000',
        description: 'Dell Latitude Laptop',
        note: 'Garantili ürün'
      }
    ],
    documentNote: 'Fatura notu buraya yazılacak',
    activeDiscounts: []
  }

  // Gelen fatura özel alanları
  if (invoiceType === 'incoming') {
    return {
      ...baseData,
      invoiceInfo: {
        ...baseData.invoiceInfo,
        // Gelen fatura özel alanları
        senderVknTckno: '9876543210',
        senderName: 'XYZ Ticaret Ltd. Şti.',
        senderAddress: 'Ankara, Türkiye',
        senderEmail: 'fatura@xyz.com',
        senderPhone: '0312 987 65 43',
        receivedAt: new Date('2024-01-15'),
        processingStatus: 'pending',
        errorMessage: '',
        originalXmlContent: '',
        responseXmlContent: '',
        isRead: false,
        isArchived: false
      },
      senderInfo: {
        id: 'SENDER001',
        name: 'XYZ Ticaret Ltd. Şti.',
        taxNumber: '9876543210',
        address: 'Ankara, Türkiye',
        email: 'fatura@xyz.com',
        phone: '0312 987 65 43',
        country: 'Türkiye',
        city: 'Ankara',
        district: 'Çankaya'
      },
      processingOptions: {
        autoProcess: true,
        autoArchive: false,
        autoTag: ['otomatik']
      }
    } as IncomingEInvoiceForm
  }

  // Giden fatura özel alanları
  if (invoiceType === 'outgoing') {
    return {
      ...baseData,
      invoiceInfo: {
        ...baseData.invoiceInfo,
        // Giden fatura özel alanları
        recipientVknTckno: '1112223334',
        recipientName: 'DEF Müşteri A.Ş.',
        recipientAddress: 'İzmir, Türkiye',
        recipientEmail: 'fatura@def.com',
        recipientPhone: '0232 456 78 90',
        sentAt: new Date('2024-01-20'),
        deliveryStatus: 'pending',
        deliveryAttempts: 0,
        lastDeliveryAttempt: undefined,
        deliveryErrorMessage: '',
        isConfirmed: false,
        confirmationDate: undefined,
        isArchived: false
      },
      recipientInfo: {
        id: 'RECIPIENT001',
        name: 'DEF Müşteri A.Ş.',
        taxNumber: '1112223334',
        address: 'İzmir, Türkiye',
        email: 'fatura@def.com',
        phone: '0232 456 78 90',
        country: 'Türkiye',
        city: 'İzmir',
        district: 'Konak'
      },
      deliveryOptions: {
        autoSend: true,
        requireConfirmation: true,
        retryAttempts: 3,
        retryInterval: 5
      }
    } as OutgoingEInvoiceForm
  }

  return baseData
}

// Gelen fatura örneği (eski fonksiyonlar geriye uyumluluk için)
export const createSampleIncomingInvoice = (): IncomingEInvoiceForm => {
  return createUnifiedSampleInvoice('incoming') as IncomingEInvoiceForm
}

// Giden fatura örneği (eski fonksiyonlar geriye uyumluluk için)
export const createSampleOutgoingInvoice = (): OutgoingEInvoiceForm => {
  return createUnifiedSampleInvoice('outgoing') as OutgoingEInvoiceForm
}

// Birleşik JSON dönüştürme örneği
export const convertUnifiedInvoiceExample = () => {
  const incomingInvoice = createUnifiedSampleInvoice('incoming')
  const outgoingInvoice = createUnifiedSampleInvoice('outgoing')
  
  // Gelen fatura için birleşik JSON
  const incomingJson = convertCompleteInvoiceToJson(
    incomingInvoice.customer as any,
    incomingInvoice.differentCustomer as any,
    incomingInvoice.invoiceInfo,
    incomingInvoice.deliveryAndOrderInfo,
    incomingInvoice.orderInfo,
    incomingInvoice.returnInfoList,
    incomingInvoice.withholdingTaxInfo,
    incomingInvoice.shipmentInfo,
    incomingInvoice.paymentInfo,
    incomingInvoice.currency,
    incomingInvoice.exchangeRate,
    incomingInvoice.includesVAT,
    incomingInvoice.isWithholdingTax,
    false, false, false,
    incomingInvoice.bulkWithholdingType || '',
    incomingInvoice.selectedIstisna || '',
    incomingInvoice.items || [],
    incomingInvoice.documentNote || '',
    incomingInvoice.activeDiscounts || [],
    (incomingInvoice as IncomingEInvoiceForm).processingOptions,
    undefined,
    { userId: 'USER001', companyId: 'COMP001' }
  )
  
  // Giden fatura için birleşik JSON
  const outgoingJson = convertCompleteInvoiceToJson(
    outgoingInvoice.customer as any,
    outgoingInvoice.differentCustomer as any,
    outgoingInvoice.invoiceInfo,
    outgoingInvoice.deliveryAndOrderInfo,
    outgoingInvoice.orderInfo,
    outgoingInvoice.returnInfoList,
    outgoingInvoice.withholdingTaxInfo,
    outgoingInvoice.shipmentInfo,
    outgoingInvoice.paymentInfo,
    outgoingInvoice.currency,
    outgoingInvoice.exchangeRate,
    outgoingInvoice.includesVAT,
    outgoingInvoice.isWithholdingTax,
    false, false, false,
    outgoingInvoice.bulkWithholdingType || '',
    outgoingInvoice.selectedIstisna || '',
    outgoingInvoice.items || [],
    outgoingInvoice.documentNote || '',
    outgoingInvoice.activeDiscounts || [],
    undefined,
    (outgoingInvoice as OutgoingEInvoiceForm).deliveryOptions,
    { userId: 'USER001', companyId: 'COMP001' }
  )
  
  console.log('Birleşik Gelen Fatura JSON:', JSON.stringify(incomingJson, null, 2))
  console.log('Birleşik Giden Fatura JSON:', JSON.stringify(outgoingJson, null, 2))
  
  return { incomingJson, outgoingJson }
}

// Veritabanından gelen veriyi işleme örneği
export const processDatabaseInvoiceData = (dbData: any) => {
  // Veritabanından gelen veriyi birleşik formata dönüştür
  const invoiceData = {
    customer: dbData.customer,
    differentCustomer: dbData.differentCustomer,
    invoiceInfo: {
      ...dbData.invoiceInfo,
      // Fatura türüne göre özel alanları ekle
      ...(dbData.invoiceType === 'incoming' && {
        senderVknTckno: dbData.senderVknTckno,
        senderName: dbData.senderName,
        senderAddress: dbData.senderAddress,
        senderEmail: dbData.senderEmail,
        senderPhone: dbData.senderPhone,
        receivedAt: new Date(dbData.receivedAt),
        processingStatus: dbData.processingStatus,
        errorMessage: dbData.errorMessage,
        originalXmlContent: dbData.originalXmlContent,
        responseXmlContent: dbData.responseXmlContent,
        isRead: dbData.isRead,
        isArchived: dbData.isArchived
      }),
      ...(dbData.invoiceType === 'outgoing' && {
        recipientVknTckno: dbData.recipientVknTckno,
        recipientName: dbData.recipientName,
        recipientAddress: dbData.recipientAddress,
        recipientEmail: dbData.recipientEmail,
        recipientPhone: dbData.recipientPhone,
        sentAt: new Date(dbData.sentAt),
        deliveryStatus: dbData.deliveryStatus,
        deliveryAttempts: dbData.deliveryAttempts,
        lastDeliveryAttempt: dbData.lastDeliveryAttempt ? new Date(dbData.lastDeliveryAttempt) : undefined,
        deliveryErrorMessage: dbData.deliveryErrorMessage,
        isConfirmed: dbData.isConfirmed,
        confirmationDate: dbData.confirmationDate ? new Date(dbData.confirmationDate) : undefined,
        isArchived: dbData.isArchived
      })
    },
    deliveryAndOrderInfo: dbData.deliveryAndOrderInfo,
    orderInfo: dbData.orderInfo,
    returnInfoList: dbData.returnInfoList,
    withholdingTaxInfo: dbData.withholdingTaxInfo,
    shipmentInfo: dbData.shipmentInfo,
    paymentInfo: dbData.paymentInfo,
    currency: dbData.currency,
    exchangeRate: dbData.exchangeRate,
    includesVAT: dbData.includesVAT,
    isWithholdingTax: dbData.isWithholdingTax,
    bulkWithholdingType: dbData.bulkWithholdingType,
    selectedIstisna: dbData.selectedIstisna,
    items: dbData.items,
    documentNote: dbData.documentNote,
    activeDiscounts: dbData.activeDiscounts
  }

  // Birleşik JSON'a dönüştür
  const jsonData = convertCompleteInvoiceToJson(
    invoiceData.customer,
    invoiceData.differentCustomer,
    invoiceData.invoiceInfo,
    invoiceData.deliveryAndOrderInfo,
    invoiceData.orderInfo,
    invoiceData.returnInfoList,
    invoiceData.withholdingTaxInfo,
    invoiceData.shipmentInfo,
    invoiceData.paymentInfo,
    invoiceData.currency,
    invoiceData.exchangeRate,
    invoiceData.includesVAT,
    invoiceData.isWithholdingTax,
    false, false, false,
    invoiceData.bulkWithholdingType,
    invoiceData.selectedIstisna,
    invoiceData.items,
    invoiceData.documentNote,
    invoiceData.activeDiscounts,
    dbData.processingOptions,
    dbData.deliveryOptions,
    { userId: dbData.userId, companyId: dbData.companyId }
  )

  return jsonData
}

// Gelen fatura JSON dönüştürme örneği
export const convertIncomingInvoiceExample = () => {
  const sampleInvoice = createUnifiedSampleInvoice('incoming') as IncomingEInvoiceForm
  const jsonData = convertIncomingInvoiceFormToJson(sampleInvoice, {
    userId: 'USER001',
    companyId: 'COMP001'
  })
  
  console.log('Gelen Fatura JSON:', JSON.stringify(jsonData, null, 2))
  return jsonData
}

// Giden fatura JSON dönüştürme örneği
export const convertOutgoingInvoiceExample = () => {
  const sampleInvoice = createUnifiedSampleInvoice('outgoing') as OutgoingEInvoiceForm
  const jsonData = convertOutgoingInvoiceFormToJson(sampleInvoice, {
    userId: 'USER001',
    companyId: 'COMP001'
  })
  
  console.log('Giden Fatura JSON:', JSON.stringify(jsonData, null, 2))
  return jsonData
}

// Fatura türü kontrolü örnekleri
export const checkInvoiceTypeExamples = () => {
  const incomingInvoice = createUnifiedSampleInvoice('incoming')
  const outgoingInvoice = createUnifiedSampleInvoice('outgoing')
  
  const incomingJson = convertIncomingInvoiceFormToJson(incomingInvoice as IncomingEInvoiceForm)
  const outgoingJson = convertOutgoingInvoiceFormToJson(outgoingInvoice as OutgoingEInvoiceForm)
  
  console.log('Gelen fatura kontrolü:', isIncomingInvoice(incomingJson)) // true
  console.log('Giden fatura kontrolü:', isOutgoingInvoice(outgoingJson)) // true
  console.log('Genel fatura kontrolü:', isGeneralInvoice(incomingJson)) // false
  
  return {
    incomingIsIncoming: isIncomingInvoice(incomingJson),
    outgoingIsOutgoing: isOutgoingInvoice(outgoingJson),
    incomingIsGeneral: isGeneralInvoice(incomingJson),
    outgoingIsGeneral: isGeneralInvoice(outgoingJson)
  }
}

// API kullanım örnekleri
export const apiUsageExamples = {
  // Birleşik fatura API örnekleri
  unified: {
    // GET - Tüm faturaları listele
    getAllInvoices: async () => {
      const response = await fetch('/api/e-invoice?page=1&limit=10')
      return response.json()
    },
    
    // POST - Yeni fatura ekle (otomatik tür belirleme)
    createInvoice: async (invoiceData: CompleteInvoiceJson) => {
      const response = await fetch('/api/e-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    },
    
    // PUT - Fatura güncelle
    updateInvoice: async (id: string, invoiceData: Partial<CompleteInvoiceJson>) => {
      const response = await fetch(`/api/e-invoice/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    }
  },
  
  // Gelen fatura API örnekleri
  incoming: {
    // GET - Gelen faturaları listele
    getIncomingInvoices: async () => {
      const response = await fetch('/api/e-invoice/incoming?page=1&limit=10')
      return response.json()
    },
    
    // POST - Yeni gelen fatura ekle
    createIncomingInvoice: async (invoiceData: IncomingInvoiceJson) => {
      const response = await fetch('/api/e-invoice/incoming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    },
    
    // PUT - Gelen fatura güncelle
    updateIncomingInvoice: async (id: string, invoiceData: Partial<IncomingInvoiceJson>) => {
      const response = await fetch(`/api/e-invoice/incoming/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    }
  },
  
  // Giden fatura API örnekleri
  outgoing: {
    // GET - Giden faturaları listele
    getOutgoingInvoices: async () => {
      const response = await fetch('/api/e-invoice/outgoing?page=1&limit=10')
      return response.json()
    },
    
    // POST - Yeni giden fatura ekle
    createOutgoingInvoice: async (invoiceData: OutgoingInvoiceJson) => {
      const response = await fetch('/api/e-invoice/outgoing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    },
    
    // PUT - Giden fatura güncelle
    updateOutgoingInvoice: async (id: string, invoiceData: Partial<OutgoingInvoiceJson>) => {
      const response = await fetch(`/api/e-invoice/outgoing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      return response.json()
    }
  }
}

// Başlangıç JSON verilerini alma örnekleri
export const getInitialJsonExamples = () => {
  const initialIncoming = getInitialIncomingInvoiceJson()
  const initialOutgoing = getInitialOutgoingInvoiceJson()
  
  console.log('Başlangıç Gelen Fatura JSON:', JSON.stringify(initialIncoming, null, 2))
  console.log('Başlangıç Giden Fatura JSON:', JSON.stringify(initialOutgoing, null, 2))
  
  return {
    initialIncoming,
    initialOutgoing
  }
}

// Kullanım örneği
export const usageExample = () => {
  console.log('=== E-Fatura JSON Dönüştürme Örnekleri ===')
  
  // Başlangıç JSON verilerini al
  getInitialJsonExamples()
  
  // Gelen fatura örneği
  console.log('\n=== Gelen Fatura Örneği ===')
  convertIncomingInvoiceExample()
  
  // Giden fatura örneği
  console.log('\n=== Giden Fatura Örneği ===')
  convertOutgoingInvoiceExample()
  
  // Birleşik JSON örneği
  console.log('\n=== Birleşik JSON Örneği ===')
  convertUnifiedInvoiceExample()
  
  // Fatura türü kontrolü
  console.log('\n=== Fatura Türü Kontrolü ===')
  checkInvoiceTypeExamples()
  
  // Veritabanı işleme örneği
  console.log('\n=== Veritabanı İşleme Örneği ===')
  const sampleDbData = {
    invoiceType: 'incoming',
    customer: { id: 'CUST001', name: 'ABC Şirketi' },
    senderVknTckno: '9876543210',
    senderName: 'XYZ Ticaret',
    // ... diğer veritabanı alanları
  }
  const processedData = processDatabaseInvoiceData(sampleDbData)
  console.log('İşlenmiş Veritabanı Verisi:', JSON.stringify(processedData, null, 2))
  
  console.log('\n=== API Kullanım Örnekleri ===')
  console.log('API örnekleri yukarıda tanımlanmıştır.')
}

// Test fonksiyonları
export const testJsonConverters = () => {
  try {
    // Gelen fatura testi
    const incomingInvoice = createUnifiedSampleInvoice('incoming') as IncomingEInvoiceForm
    const incomingJson = convertIncomingInvoiceFormToJson(incomingInvoice)
    
    // Giden fatura testi
    const outgoingInvoice = createUnifiedSampleInvoice('outgoing') as OutgoingEInvoiceForm
    const outgoingJson = convertOutgoingInvoiceFormToJson(outgoingInvoice)
    
    // Birleşik JSON testi
    const unifiedExample = convertUnifiedInvoiceExample()
    
    console.log('✅ JSON dönüştürme testleri başarılı!')
    console.log('Gelen fatura JSON boyutu:', JSON.stringify(incomingJson).length)
    console.log('Giden fatura JSON boyutu:', JSON.stringify(outgoingJson).length)
    console.log('Birleşik JSON boyutu:', JSON.stringify(unifiedExample.incomingJson).length)
    
    return {
      success: true,
      incomingJson,
      outgoingJson,
      unifiedJson: unifiedExample
    }
  } catch (error) {
    console.error('❌ JSON dönüştürme testleri başarısız:', error)
    return {
      success: false,
      error
    }
  }
} 
