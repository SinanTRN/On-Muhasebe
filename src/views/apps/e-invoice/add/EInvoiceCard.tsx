'use client'

import React from 'react'
import {
  useTheme,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Autocomplete,
  Box,
  Stack
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Icon } from '@iconify/react'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomInput from '@/views/apps/e-invoice/shared/components/PickersCustomInput'
import CustomerSelector from '@/views/apps/e-invoice/shared/components/CustomerSelector'
import AddCustomerDrawer from './AddCustomerDrawer'
import { sampleCustomers } from '../../../../data/sampleCustomers'
import type { Tbl } from '../../../../types/apps/cariTypes'
import { fetchTCMBRate } from '@/utils/fetchTCMBRate'
import { isTCMBRateCurrent } from '@/utils/isTCMBRateCurrent'
import { kdvTevkifatOrnekleri } from '../shared/examples/kdvWithholdingExamples'

interface EInvoiceCardProps {
  includesVAT: boolean
  setIncludesVAT: (v: boolean) => void
  currency: string
  setCurrency: (v: string) => void
  exchangeRate: string
  setExchangeRate: (v: string) => void
  currentInvoiceType: string
  setCurrentInvoiceType: (v: string) => void
  isWithholdingTax: boolean
  setIsWithholdingTax: (v: boolean) => void
  bulkWithholdingType?: string
  setBulkWithholdingType?: (v: string) => void
  selectedCustomer: string
  setSelectedCustomer: (v: string) => void
  showDifferentCustomer: boolean
  setShowDifferentCustomer: (v: boolean) => void
  differentCustomer: string
  setDifferentCustomer: (v: string) => void
  invoiceInfo: any
  setInvoiceInfo: (v: any) => void
  deliveryAndOrderInfo: any
  setDeliveryAndOrderInfo: (v: any) => void
  orderInfo: any
  setOrderInfo: (v: any) => void
  returnInfoList: any[]
  setReturnInfoList: (v: any[]) => void
  withholdingTaxInfo: any
  setWithholdingTaxInfo: (v: any) => void
  shipmentInfo: any
  setShipmentInfo: (v: any) => void
  paymentInfo: any
  setPaymentInfo: (v: any) => void
}

const EInvoiceCard = ({
  includesVAT,
  setIncludesVAT,
  currency,
  setCurrency,
  exchangeRate,
  setExchangeRate,
  currentInvoiceType,
  setCurrentInvoiceType,
  isWithholdingTax,
  setIsWithholdingTax,
  bulkWithholdingType,
  setBulkWithholdingType,
  selectedCustomer,
  setSelectedCustomer,
  showDifferentCustomer,
  setShowDifferentCustomer,
  differentCustomer,
  setDifferentCustomer,
  invoiceInfo,
  setInvoiceInfo,
  deliveryAndOrderInfo,
  setDeliveryAndOrderInfo,
  orderInfo,
  setOrderInfo,
  returnInfoList,
  setReturnInfoList,
  withholdingTaxInfo,
  setWithholdingTaxInfo,
  shipmentInfo,
  setShipmentInfo,
  paymentInfo,
  setPaymentInfo
}: EInvoiceCardProps) => {
  const theme = useTheme()
  const [customerDrawerOpen, setCustomerDrawerOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Tbl | null>(null)
  const [customers, setCustomers] = React.useState<Tbl[]>(sampleCustomers)
  const [deliveryAndOrder, setDeliveryAndOrder] = React.useState(false)
  const siteOptions = ['n11', 'hepsiburada', 'trendyol']
  const paymentOptions = ['KREDI/BANKA KARTI', 'EFT/HAVALE', 'KAPIDA ODEME', 'DİĞER']

  // Cari Bilgileri için ekleme/güncelleme
  const handleCustomerSubmitCari = (formData: Tbl) => {
    if (editingCustomer) {
      setCustomers((prev: Tbl[]) => prev.map(c => (c.VN === formData.VN ? formData : c)))
    } else {
      setCustomers([...customers, formData])
      setSelectedCustomer(formData.VN)
    }
    setCustomerDrawerOpen(false)
  }

  // Ödeme Yapacak Müşteri için ekleme/güncelleme
  const handleCustomerSubmitOdeyen = (formData: Tbl) => {
    if (editingCustomer) {
      setCustomers((prev: Tbl[]) => prev.map(c => (c.VN === formData.VN ? formData : c)))
    } else {
      setCustomers([...customers, formData])
      setDifferentCustomer(formData.VN)
    }
    setCustomerDrawerOpen(false)
  }

  // Farklı müşteri alanı kapatıldığında seçimi temizle
  const handleShowDifferentCustomer = (checked: boolean) => {
    setShowDifferentCustomer(checked)
    if (!checked) setDifferentCustomer('')
  }

  return (
    <Box className=' w-full '>
      <Stack spacing={2}>
        <Box
          sx={{ background: theme.palette.background.paper }}
          className='flex flex-col sm:flex-row gap-2 p-4 w-full rounded-md shadow-md'
        >
          {/* Cari Bilgileri ve (varsa) Ödeme Yapacak Müşteri */}
          <Box className='w-full'>
            <Box sx={{ background: theme.palette.background.paper }} className='  w-full max-w-[70%]'>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Cari Bilgileri
              </Typography>
              <CustomerSelector
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelect={setSelectedCustomer}
                onEdit={(customer: Tbl) => {
                  setEditingCustomer(customer)
                  setCustomerDrawerOpen(true)
                }}
                onAddCustomer={() => {
                  setEditingCustomer(null)
                  setCustomerDrawerOpen(true)
                }}
              />
              <FormControlLabel
                className='mt-2'
                control={
                  <Switch
                    checked={showDifferentCustomer}
                    onChange={e => handleShowDifferentCustomer(e.target.checked)}
                    color='primary'
                  />
                }
                label='Ödeme Yapacak Müşteri'
              />
            </Box>
            {/* Farklı müşteri alanı */}
            {showDifferentCustomer && (
              <Box className='  w-full max-w-[70%] '>
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Ödeme Yapacak Müşteri
                </Typography>
                <CustomerSelector
                  customers={customers}
                  selectedCustomer={differentCustomer}
                  onSelect={setDifferentCustomer}
                  onEdit={(customer: Tbl) => {
                    setEditingCustomer(customer)
                    setCustomerDrawerOpen(true)
                  }}
                  onAddCustomer={() => {
                    setEditingCustomer(null)
                    setCustomerDrawerOpen(true)
                  }}
                />
              </Box>
            )}
          </Box>
          {/* Fatura Bilgileri */}
          <Box className='w-full'>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Fatura Bilgileri
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} className='flex flex-col gap-4 max-w-[70%]'>
                <TextField
                  fullWidth
                  label='Fatura No'
                  value={invoiceInfo.documentNo}
                  onChange={e => setInvoiceInfo({ ...invoiceInfo, documentNo: e.target.value })}
                  InputProps={{ style: { background: theme.palette.background.default } }}
                />
                <TextField
                  fullWidth
                  label='Açıklama'
                  value={invoiceInfo.description}
                  onChange={e => setInvoiceInfo({ ...invoiceInfo, description: e.target.value })}
                  InputProps={{ style: { background: theme.palette.background.default } }}
                />
                {/* Diğer fatura alanları aynı şekilde devam edecek */}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default EInvoiceCard
