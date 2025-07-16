import EInvoiceListTable from './EInvoiceListTable'

const EInvoiceIncoming = () => {
  // Örnek veri
  const invoiceData = [
    {
      id: 'EFTR-2025001',
      vknTckn: '12345678901',
      title: 'ABC Ltd. Şti.',
      nameSurname: 'Ali Veli',
      type: 'E-Fatura',
      amount: 12500.75,
      unit: 'TRY',
      receivedAt: '2025-06-01T10:15:00',
      status: 'Alındı',
      response: 'Kanunen Kabul',
      envelopeStatus: 'Başarılı'
    },
    {
      id: 'EFTR-2025002',
      vknTckn: '98765432109',
      title: 'MNO Bilişim',
      nameSurname: 'Ayşe Demir',
      type: 'E-Arşiv',
      amount: 9800.00,
      unit: 'TRY',
      receivedAt: '2025-06-02T11:20:00',
      status: 'Yanıt bekliyor',
      response: 'Yanıt Bekliyor',
      envelopeStatus: 'Beklemede'
    },
    {
      id: 'EFTR-2025003',
      vknTckn: '11122233344',
      title: 'QRS Yazılım',
      nameSurname: 'Mehmet Yılmaz',
      type: 'E-Fatura',
      amount: 4500.50,
      unit: 'TRY',
      receivedAt: '2025-06-03T09:45:00',
      status: 'Kabul',
      response: 'Ulaştırıldı',
      envelopeStatus: 'Başarılı'
    },
    {
      id: 'EFTR-2025004',
      vknTckn: '55566677788',
      title: 'Beta Teknoloji',
      nameSurname: 'Fatma Kaya',
      type: 'E-Fatura',
      amount: 3200.00,
      unit: 'TRY',
      receivedAt: '2025-06-04T14:10:00',
      status: 'Kabul Başarısız',
      response: 'Yanıt Gerekmiyor',
      envelopeStatus: 'Hatalı'
    },
    {
      id: 'EFTR-2025005',
      vknTckn: '22233344455',
      title: 'Delta Sistem',
      nameSurname: 'Caner Toprak',
      type: 'E-Arşiv',
      amount: 7600.80,
      unit: 'TRY',
      receivedAt: '2025-06-05T16:30:00',
      status: 'Kabul işlemi Beklenen sürede tamamlanmadı',
      response: 'Yanıt Bekliyor',
      envelopeStatus: 'Beklemede'
    },
    {
      id: 'EFTR-2025006',
      vknTckn: '33344455566',
      title: 'Sigma Yazılım',
      nameSurname: 'Zeynep Aksoy',
      type: 'E-Fatura',
      amount: 21500.25,
      unit: 'TRY',
      receivedAt: '2025-06-06T13:00:00',
      status: 'Ret',
      response: 'Kanunen Kabul',
      envelopeStatus: 'Başarılı'
    },
    {
      id: 'EFTR-2025007',
      vknTckn: '44455566677',
      title: 'Omicron Bilgisayar',
      nameSurname: 'Burak Şahin',
      type: 'E-Fatura',
      amount: 5400.00,
      unit: 'TRY',
      receivedAt: '2025-06-07T08:50:00',
      status: 'Ret - Başarısız',
      response: 'Yanıt Gerekmiyor',
      envelopeStatus: 'Hatalı'
    },
    {
      id: 'EFTR-2025008',
      vknTckn: '55566677799',
      title: 'Alfa Teknoloji',
      nameSurname: 'Elif Güneş',
      type: 'E-Arşiv',
      amount: 11800.00,
      unit: 'TRY',
      receivedAt: '2025-06-08T17:25:00',
      status: 'Ret işlemi Beklenen sürede tamamlanmadı',
      response: 'Ulaştırıldı',
      envelopeStatus: 'Beklemede'
    },
    {
      id: 'EFTR-2025009',
      vknTckn: '66677788800',
      title: 'Vega Danışmanlık',
      nameSurname: 'Murat Öz',
      type: 'E-Fatura',
      amount: 3300.00,
      unit: 'TRY',
      receivedAt: '2025-06-09T12:40:00',
      status: 'Alındı',
      response: 'Yanıt Bekliyor',
      envelopeStatus: 'Başarılı'
    },
    {
      id: 'EFTR-2025010',
      vknTckn: '77788899911',
      title: 'Orion Elektronik',
      nameSurname: 'Seda Korkmaz',
      type: 'E-Fatura',
      amount: 2750.45,
      unit: 'TRY',
      receivedAt: '2025-06-10T15:55:00',
      status: 'Yanıt bekliyor',
      response: 'Yanıt Bekliyor',
      envelopeStatus: 'Beklemede'
    },
    { id: 'EFTR-2025011', vknTckn: '88899900022', title: 'Nova Medya', nameSurname: 'Yunus Karaca', type: 'E-Fatura', amount: 8800.00, unit: 'TRY', receivedAt: '2025-06-11T09:00:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025012', vknTckn: '99900011133', title: 'Penta Yazılım', nameSurname: 'Hilal Öztürk', type: 'E-Arşiv', amount: 6900.00, unit: 'TRY', receivedAt: '2025-06-12T10:30:00', status: 'Yanıt bekliyor', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025013', vknTckn: '00011122244', title: 'Lambda Mühendislik', nameSurname: 'Kerem Aras', type: 'E-Fatura', amount: 13400.20, unit: 'TRY', receivedAt: '2025-06-13T11:00:00', status: 'Kabul', response: 'Red', envelopeStatus: 'Hatalı' },
    { id: 'EFTR-2025014', vknTckn: '11122233355', title: 'Theta Telekom', nameSurname: 'Sevgi Tan', type: 'E-Fatura', amount: 7200.00, unit: 'TRY', receivedAt: '2025-06-14T13:15:00', status: 'Kabul', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025015', vknTckn: '22233344466', title: 'Zeta Güvenlik', nameSurname: 'İsmail Kurt', type: 'E-Arşiv', amount: 8600.00, unit: 'TRY', receivedAt: '2025-06-15T14:00:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025016', vknTckn: '33344455577', title: 'Gamma Web', nameSurname: 'Selin Yılmaz', type: 'E-Fatura', amount: 9700.00, unit: 'TRY', receivedAt: '2025-06-16T12:10:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025017', vknTckn: '44455566688', title: 'Omega Lojistik', nameSurname: 'Tuncay Arı', type: 'E-Fatura', amount: 3400.00, unit: 'TRY', receivedAt: '2025-06-17T08:00:00', status: 'Alındı', response: 'Red', envelopeStatus: 'Hatalı' },
    { id: 'EFTR-2025018', vknTckn: '55566677700', title: 'Kappa Teknoloji', nameSurname: 'Aslı Bilgin', type: 'E-Arşiv', amount: 4400.55, unit: 'TRY', receivedAt: '2025-06-18T16:20:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025019', vknTckn: '66677788899', title: 'Iota Yazılım', nameSurname: 'Gökhan Uçar', type: 'E-Fatura', amount: 5100.00, unit: 'TRY', receivedAt: '2025-06-19T10:45:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025020', vknTckn: '77788899900', title: 'Eta Enerji', nameSurname: 'Büşra Demir', type: 'E-Arşiv', amount: 8300.00, unit: 'TRY', receivedAt: '2025-06-20T15:30:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025021', vknTckn: '88899900033', title: 'Teta Ajans', nameSurname: 'Emre Duru', type: 'E-Arşiv', amount: 9300.00, unit: 'TRY', receivedAt: '2025-06-21T09:45:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025022', vknTckn: '99900011144', title: 'Mu Bilgisayar', nameSurname: 'Nazlı Özkan', type: 'E-Fatura', amount: 11000.00, unit: 'TRY', receivedAt: '2025-06-22T13:30:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025023', vknTckn: '00011122255', title: 'Nu Yazılım', nameSurname: 'Barış Yıldız', type: 'E-Fatura', amount: 4400.40, unit: 'TRY', receivedAt: '2025-06-23T14:20:00', status: 'Alındı', response: 'Red', envelopeStatus: 'Hatalı' },
    { id: 'EFTR-2025024', vknTckn: '11122233366', title: 'Xi Medya', nameSurname: 'Derya Gül', type: 'E-Arşiv', amount: 6200.00, unit: 'TRY', receivedAt: '2025-06-24T10:10:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025025', vknTckn: '22233344477', title: 'Om Yazılım', nameSurname: 'Serkan Polat', type: 'E-Fatura', amount: 3900.00, unit: 'TRY', receivedAt: '2025-06-25T11:50:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025026', vknTckn: '33344455588', title: 'San Telekom', nameSurname: 'Gizem Akın', type: 'E-Arşiv', amount: 15000.00, unit: 'TRY', receivedAt: '2025-06-26T15:40:00', status: 'Alındı', response: 'Red', envelopeStatus: 'Hatalı' },
    { id: 'EFTR-2025027', vknTckn: '44455566699', title: 'Pi Çözümleri', nameSurname: 'Mert Ekin', type: 'E-Fatura', amount: 10200.00, unit: 'TRY', receivedAt: '2025-06-27T09:35:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    { id: 'EFTR-2025028', vknTckn: '55566677711', title: 'Rho Network', nameSurname: 'Ece Yıldırım', type: 'E-Fatura', amount: 7100.00, unit: 'TRY', receivedAt: '2025-06-28T13:25:00', status: 'Alındı', response: 'Kabul', envelopeStatus: 'Başarılı' },
    { id: 'EFTR-2025029', vknTckn: '66677788822', title: 'Psi Yazılım', nameSurname: 'Onur Kılıç', type: 'E-Arşiv', amount: 5400.00, unit: 'TRY', receivedAt: '2025-06-29T12:15:00', status: 'Alındı', response: 'Red', envelopeStatus: 'Hatalı' },
    { id: 'EFTR-2025030', vknTckn: '77788899933', title: 'Chi Teknoloji', nameSurname: 'Melis Şen', type: 'E-Fatura', amount: 12600.00, unit: 'TRY', receivedAt: '2025-06-30T14:55:00', status: 'Alındı', response: 'Beklemede', envelopeStatus: 'Beklemede' },
    
  ];
  
  

  return <EInvoiceListTable invoiceData={invoiceData} />
}

export default EInvoiceIncoming 
