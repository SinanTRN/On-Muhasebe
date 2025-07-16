import EInvoiceListTable from '../shared/EInvoiceListTable'

// Örnek outgoing veri
const outgoingInvoices = [
  {
    id: '20240001',
    status: 'Kabul',
    vknTckn: '12345678901',
    title: 'Çıkış Müşterisi',
    nameSurname: 'Ahmet Çıkış',
    type: 'E-Arşiv',
    amount: 1500,
    unit: 'TRY',
    receivedAt: new Date().toISOString(),
    response: 'Ulaştırıldı',
    envelopeStatus: 'Başarılı',
    read: true
  }
]

const EInvoiceOutgoing = () => {
  return <EInvoiceListTable invoiceData={outgoingInvoices} />
}

export default EInvoiceOutgoing 
