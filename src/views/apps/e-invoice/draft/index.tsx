import { Stack } from '@mui/material'
import DraftInvoiceListTable, { DraftInvoice } from './DraftInvoiceListTable'

const sampleDrafts: DraftInvoice[] = [
  {
    id: '1',
    invoiceNo: 'DRAFT-2024001',
    date: '2024-06-01T10:00:00',
    vknTckn: '12345678901',
    title: 'ABC Yazılım',
    amount: 1500,
    unit: 'TRY',
    scenario: 'TEMEL',
    type: 'E-Fatura'
  },
  {
    id: '2',
    invoiceNo: 'DRAFT-2024002',
    date: '2024-06-02T11:30:00',
    vknTckn: '98765432109',
    title: 'MNO Bilişim',
    amount: 3200,
    unit: 'TRY',
    scenario: 'TİCARİ',
    type: 'E-Arşiv'
  },
  {
    id: '3',
    invoiceNo: 'DRAFT-2024003',
    date: '2024-06-03T09:45:00',
    vknTckn: '11122233344',
    title: 'QRS Yazılım',
    amount: 4500,
    unit: 'TRY',
    scenario: 'KAMU',
    type: 'E-Fatura'
  }
]

const DraftPage = () => {
  return (
    <Stack spacing={2}>
      <DraftInvoiceListTable data={sampleDrafts} />
    </Stack>
  )
}

export default DraftPage
