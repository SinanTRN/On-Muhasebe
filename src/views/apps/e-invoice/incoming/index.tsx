import EInvoiceListTable from './EInvoiceListTable'

const EInvoiceIncoming = () => {
  // Örnek veri
  const invoiceData = [
    { id: 'EFTR-2025001', sender: 'ABC Ltd. Şti.', receiver: 'XYZ A.Ş.', date: '2025-06-01', amount: 12500.75, status: 'Kabul Edildi' },
    { id: 'EFTR-2025002', sender: 'MNO Bilişim', receiver: 'XYZ A.Ş.', date: '2025-06-02', amount: 9800.00, status: 'Beklemede' },
    { id: 'EFTR-2025003', sender: 'QRS Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-03', amount: 4500.50, status: 'Reddedildi' },
    { id: 'EFTR-2025004', sender: 'Beta Teknoloji', receiver: 'XYZ A.Ş.', date: '2025-06-04', amount: 3200.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025005', sender: 'Delta Sistem', receiver: 'XYZ A.Ş.', date: '2025-06-05', amount: 7600.80, status: 'Beklemede' },
    { id: 'EFTR-2025006', sender: 'Sigma Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-06', amount: 21500.25, status: 'Kabul Edildi' },
    { id: 'EFTR-2025007', sender: 'Omicron Bilgisayar', receiver: 'XYZ A.Ş.', date: '2025-06-07', amount: 5400.00, status: 'Reddedildi' },
    { id: 'EFTR-2025008', sender: 'Alfa Teknoloji', receiver: 'XYZ A.Ş.', date: '2025-06-08', amount: 11800.00, status: 'Beklemede' },
    { id: 'EFTR-2025009', sender: 'Vega Danışmanlık', receiver: 'XYZ A.Ş.', date: '2025-06-09', amount: 3300.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025010', sender: 'Orion Elektronik', receiver: 'XYZ A.Ş.', date: '2025-06-10', amount: 2750.45, status: 'Reddedildi' },
    { id: 'EFTR-2025011', sender: 'Nova Medya', receiver: 'XYZ A.Ş.', date: '2025-06-11', amount: 8800.00, status: 'Beklemede' },
    { id: 'EFTR-2025012', sender: 'Penta Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-12', amount: 6900.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025013', sender: 'Lambda Mühendislik', receiver: 'XYZ A.Ş.', date: '2025-06-13', amount: 13400.20, status: 'Reddedildi' },
    { id: 'EFTR-2025014', sender: 'Theta Telekom', receiver: 'XYZ A.Ş.', date: '2025-06-14', amount: 7200.00, status: 'Beklemede' },
    { id: 'EFTR-2025015', sender: 'Zeta Güvenlik', receiver: 'XYZ A.Ş.', date: '2025-06-15', amount: 8600.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025016', sender: 'Gamma Web', receiver: 'XYZ A.Ş.', date: '2025-06-16', amount: 9700.00, status: 'Beklemede' },
    { id: 'EFTR-2025017', sender: 'Omega Lojistik', receiver: 'XYZ A.Ş.', date: '2025-06-17', amount: 3400.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025018', sender: 'Kappa Teknoloji', receiver: 'XYZ A.Ş.', date: '2025-06-18', amount: 4400.55, status: 'Reddedildi' },
    { id: 'EFTR-2025019', sender: 'Iota Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-19', amount: 5100.00, status: 'Beklemede' },
    { id: 'EFTR-2025020', sender: 'Eta Enerji', receiver: 'XYZ A.Ş.', date: '2025-06-20', amount: 8300.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025021', sender: 'Teta Ajans', receiver: 'XYZ A.Ş.', date: '2025-06-21', amount: 9300.00, status: 'Beklemede' },
    { id: 'EFTR-2025022', sender: 'Mu Bilgisayar', receiver: 'XYZ A.Ş.', date: '2025-06-22', amount: 11000.00, status: 'Reddedildi' },
    { id: 'EFTR-2025023', sender: 'Nu Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-23', amount: 4400.40, status: 'Kabul Edildi' },
    { id: 'EFTR-2025024', sender: 'Xi Medya', receiver: 'XYZ A.Ş.', date: '2025-06-24', amount: 6200.00, status: 'Beklemede' },
    { id: 'EFTR-2025025', sender: 'Om Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-25', amount: 3900.00, status: 'Reddedildi' },
    { id: 'EFTR-2025026', sender: 'San Telekom', receiver: 'XYZ A.Ş.', date: '2025-06-26', amount: 15000.00, status: 'Kabul Edildi' },
    { id: 'EFTR-2025027', sender: 'Pi Çözümleri', receiver: 'XYZ A.Ş.', date: '2025-06-27', amount: 10200.00, status: 'Beklemede' },
    { id: 'EFTR-2025028', sender: 'Rho Network', receiver: 'XYZ A.Ş.', date: '2025-06-28', amount: 7100.00, status: 'Reddedildi' },
    { id: 'EFTR-2025029', sender: 'Psi Yazılım', receiver: 'XYZ A.Ş.', date: '2025-06-29', amount: 5400.00, status: 'Beklemede' },
    { id: 'EFTR-2025030', sender: 'Chi Teknoloji', receiver: 'XYZ A.Ş.', date: '2025-06-30', amount: 12600.00, status: 'Kabul Edildi' }
  ]
  

  return <EInvoiceListTable invoiceData={invoiceData} />
}

export default EInvoiceIncoming 
