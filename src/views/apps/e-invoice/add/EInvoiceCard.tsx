'use client'

import { useState, useEffect } from 'react'

import {
  useTheme,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Autocomplete,
  Checkbox,
  Snackbar,
  Tooltip,
  Box,
  Stack
} from '@mui/material'

import Grid from '@mui/material/Grid'

//import { set } from 'react-hook-form'

import { Icon } from '@iconify/react'

import MenuItem from '@mui/material/MenuItem'

import Popover from '@mui/material/Popover'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomInput from '@/views/apps/e-invoice/shared/PickersCustomInput'
import CustomerSelector from '@/views/apps/e-invoice/shared/CustomerSelector'
import AddCustomerDrawer from './AddCustomerDrawer'
import { sampleCustomers } from '../../../../data/sampleCustomers'
import type { Tbl } from '../../../../types/apps/cariTypes'
import { fetchTCMBRate } from '@/utils/fetchTCMBRate'
import { isTCMBRateCurrent } from '@/utils/isTCMBRateCurrent'
import { kdvTevkifatOrnekleri } from '../shared/kdvWithholdingExamples'

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

  //bulkWithholdingType,
  setBulkWithholdingType
}: EInvoiceCardProps) => {
  // State'ler
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [showDifferentCustomer, setShowDifferentCustomer] = useState(false)
  const [differentCustomer, setDifferentCustomer] = useState('')
  const [dueDateAndPaymentMethod, setDueDateAndPaymentMethod] = useState(false)
  const [customers, setCustomers] = useState<Tbl[]>(sampleCustomers)

  const [invoiceInfo, setInvoiceInfo] = useState({
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
  })

  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Tbl | null>(null)

  const [orderInfo, setOrderInfo] = useState({
    site: '',
    orderNo: '',
    orderDate: null as Date | null
  })

  const [returnInfoList, setReturnInfoList] = useState([{ returnNo: '', returnDate: null as Date | null }])

  const [withholdingTaxInfo, setWithholdingTaxInfo] = useState({
    type: '' // KDV Tevkifat Türü
  })

  const [shipmentInfo, setShipmentInfo] = useState({
    vknTckno: '',
    title: '',
    shipmentDate: null as Date | null
  })

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'KREDI/BANKA KARTI',
    paymentDate: null as Date | null,
    agent: ''
  })

  const siteOptions = ['n11', 'hepsiburada', 'trendyol']
  const paymentOptions = ['KREDI/BANKA KARTI', 'EFT/HAVALE', 'KAPIDA ODEME', 'DİĞER']

  const istisnaTurleri = [
    { kod: '001', ad: 'Konaklama Diplomatik İstisna' },
    { kod: '101', ad: 'İhracat İstisnası' },
    { kod: '102', ad: 'Diplomatik İstisna' },
    { kod: '103', ad: 'Askeri Amaçlı İstisna' },
    { kod: '104', ad: 'Petrol Arama Faaliyetlerinde Bulunanlara Yapılan Teslimler' },
    { kod: '105', ad: 'Uluslararası Anlaşmadan Doğan İstisna' }
  ]

  const currencyOptions = ['TRY', 'USD', 'EUR', 'GBP']
  const [isRateCurrent, setIsRateCurrent] = useState(true)
  const [rateDate, setRateDate] = useState('')

  const theme = useTheme()

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const [kdvPopoverAnchor, setKdvPopoverAnchor] = useState<null | HTMLElement>(null)
  const [kdvSearch, setKdvSearch] = useState('')

  const [istisnaPopoverAnchor, setIstisnaPopoverAnchor] = useState<null | HTMLElement>(null)
  const [istisnaSearch, setIstisnaSearch] = useState('')
  const [selectedIstisna, setSelectedIstisna] = useState<string>('') // sadece kod saklanıyor

  const filteredKdvList = kdvTevkifatOrnekleri.filter(
    opt => opt.hizmet.toLowerCase().includes(kdvSearch.toLowerCase()) || opt.kod.toString().includes(kdvSearch)
  )

  const filteredIstisnaList = istisnaTurleri.filter(
    opt => opt.kod.includes(istisnaSearch) || opt.ad.toLowerCase().includes(istisnaSearch.toLowerCase())
  )

  // Renk ve stil değişkenleri
  const inputBg = { background: theme.palette.customColors.greyLightBg }
  const warningColor = theme.palette.warning.main
  const warningContrast = theme.palette.warning.contrastText || '#fff'

  useEffect(() => {
    if (currency !== 'TRY') {
      fetchTCMBRate(currency)
        .then(({ rate, date }) => {
          setExchangeRate(rate)
          setRateDate(date)
          setIsRateCurrent(isTCMBRateCurrent(date))
          if (!isTCMBRateCurrent(date)) setShowSnackbar(true)
        })
        .catch(() => {
          setExchangeRate('')
          setIsRateCurrent(true)
          setRateDate('')
        })
    } else {
      setExchangeRate('')
      setIsRateCurrent(true)
      setRateDate('')
    }
  }, [currency])

  // İade fatura bilgileri için ekleme ve silme fonksiyonları
  const handleAddReturnInfo = () => {
    setReturnInfoList([...returnInfoList, { returnNo: '', returnDate: null }])
  }

  const handleRemoveReturnInfo = (index: number) => {
    setReturnInfoList(returnInfoList.filter((_, i) => i !== index))
  }

  // Drawer kapatma ve editingCustomer sıfırlama fonksiyonu
  const handleCustomerDrawerClose = () => {
    setCustomerDrawerOpen(false)
    setEditingCustomer(null)
  }

  // Cari Bilgileri için ekleme/güncelleme
  const handleCustomerSubmitCari = (formData: Tbl) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => (c.VN === formData.VN ? formData : c)))
    } else {
      setCustomers([...customers, formData])
      setSelectedCustomer(formData.VN)
    }

    handleCustomerDrawerClose()
  }

  // Ödeme Yapacak Müşteri için ekleme/güncelleme
  const handleCustomerSubmitOdeyen = (formData: Tbl) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => (c.VN === formData.VN ? formData : c)))
    } else {
      setCustomers([...customers, formData])
      setDifferentCustomer(formData.VN)
    }

    handleCustomerDrawerClose()
  }

  const scenarioOptions = ['TEMELFATURA', 'TICARIFATURA', 'KAMU', 'EARSIVFATURA', 'IHRACAT']

  const invoiceTypeOptions = ['NORMAL', 'IADE', 'TEVKIFAT', 'ISTISNA', 'IHRACKAYITLI', 'SGK', 'OZELMATRAH']

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
                <div className='flex-1  max-w-full'>
                  <Autocomplete
                    freeSolo
                    options={scenarioOptions}
                    value={invoiceInfo.scenario}
                    onInputChange={(_, newValue) => setInvoiceInfo({ ...invoiceInfo, scenario: newValue })}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Senaryo'
                        fullWidth
                        InputProps={{ ...params.InputProps, style: inputBg }}
                      />
                    )}
                  />
                </div>
                <div className='flex-1  max-w-full '>
                  <Autocomplete
                    freeSolo
                    options={invoiceTypeOptions}
                    value={invoiceInfo.invoiceType}
                    onInputChange={(_, newValue) => {
                      setInvoiceInfo({ ...invoiceInfo, invoiceType: newValue })
                      setCurrentInvoiceType(newValue)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Fatura Tipi'
                        fullWidth
                        InputProps={{ ...params.InputProps, style: inputBg }}
                      />
                    )}
                  />
                </div>
                <div className='flex-1  max-w-full '>
                  <Autocomplete
                    options={currencyOptions}
                    value={currency}
                    onChange={(_, newValue) => setCurrency(newValue || 'TRY')}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Para Birimi'
                        fullWidth
                        InputProps={{ ...params.InputProps, style: inputBg }}
                      />
                    )}
                  />
                </div>
                {currency !== 'TRY' && (
                  <div className='flex-1  max-w-full  relative'>
                    <TextField
                      fullWidth
                      label='Döviz Kuru (TL Karşılığı)'
                      value={exchangeRate}
                      type='number'
                      inputProps={{ min: 0, step: 'any' }}
                      onChange={e => setExchangeRate(e.target.value)}
                      InputProps={{ style: inputBg }}
                    />
                    {!isRateCurrent && rateDate && (
                      <Tooltip
                        title={`TCMB döviz kuru güncel değil! (${rateDate} tarihi için gösteriliyor)`}
                        open={tooltipOpen}
                        onOpen={() => setTooltipOpen(true)}
                        onClose={() => setTooltipOpen(false)}
                      >
                        <span
                          className='absolute top-2 right-2 z-10 cursor-pointer'
                          onMouseEnter={() => setTooltipOpen(true)}
                          onMouseLeave={() => setTooltipOpen(false)}
                          tabIndex={-1}
                        >
                          <Icon icon='ri:information-line' color='#ed6c02' width={18} height={18} />
                        </span>
                      </Tooltip>
                    )}
                    <Snackbar
                      open={showSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setShowSnackbar(false)}
                      message={`TCMB döviz kuru güncel değil! (${rateDate} tarihi için gösteriliyor)`}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      ContentProps={{
                        sx: { backgroundColor: warningColor, color: warningContrast }
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </Box>
          {/*Tarih Bilgileri */}
          <Box className='w-full'>
            <Typography variant='h6' className='my-4 sm:mt-0 '>
              Tarih Bilgileri
            </Typography>
            <Box className='flex flex-col gap-4 max-w-[70%]'>
              <Box className='flex-1'>
                <AppReactDatepicker
                  selected={invoiceInfo.issueDate}
                  onChange={(date: Date | null) => setInvoiceInfo({ ...invoiceInfo, issueDate: date || new Date() })}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={15}
                  dateFormat='dd.MM.yyyy HH:mm'
                  customInput={
                    <CustomInput
                      label='DÜZENLEME TARİHİ'
                      fullWidth
                      size='small'
                      InputProps={{
                        style: {
                          ...inputBg,
                          height: 56,
                          fontSize: 16,
                          paddingLeft: 16,
                          paddingRight: 16
                        }
                      }}
                    />
                  }

                  //boxProps={{ width: '100%' }}
                />
              </Box>
              <Box className='flex-1'>
                <AppReactDatepicker
                  selected={invoiceInfo.shipmentDate}
                  onChange={(date: Date | null) => setInvoiceInfo({ ...invoiceInfo, shipmentDate: date || new Date() })}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={15}
                  dateFormat='dd.MM.yyyy HH:mm'
                  customInput={
                    <CustomInput
                      label='SEVK TARİHİ'
                      fullWidth
                      size='small'
                      InputProps={{
                        style: {
                          ...inputBg,
                          height: 56,
                          fontSize: 16,
                          paddingLeft: 16,
                          paddingRight: 16
                        }
                      }}
                    />
                  }
                  boxProps={{ width: '100%' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* İade Fatura Bilgileri */}
        {currentInvoiceType === 'IADE' && (
          <Box
            className='flex flex-col  gap-2 p-4 w-full rounded-md shadow-md'
            sx={{ background: theme.palette.background.paper }}
          >
            <Typography variant='h6' className='mb-4'>
              İade Fatura Bilgileri
            </Typography>

            <Grid container className=' flex flex-col w-full gap-4'>
              {returnInfoList.map((info, index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  className='flex flex-col gap-4 rounded-md p-4'
                  sx={{
                    background: theme.palette.customColors.greyLightBg
                  }}
                >
                  {returnInfoList.length > 1 && (
                    <Box className='relative'>
                      <IconButton
                        onClick={() => handleRemoveReturnInfo(index)}
                        size='small'
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <Icon icon='mdi:close' width={18} height={18} />
                      </IconButton>
                    </Box>
                  )}
                  <div className='flex flex-col sm:flex-row gap-4 mt-5 w-full'>
                    <TextField
                      label={`Numarası ${index + 1}`}
                      value={info.returnNo}
                      onChange={e => {
                        const newList = [...returnInfoList]

                        newList[index].returnNo = e.target.value
                        setReturnInfoList(newList)
                      }}
                      InputProps={{ style: inputBg }}
                    />

                    <AppReactDatepicker
                      selected={info.returnDate}
                      onChange={date => {
                        const newList = [...returnInfoList]

                        newList[index].returnDate = date
                        setReturnInfoList(newList)
                      }}
                      showTimeSelect
                      timeFormat='HH:mm'
                      timeIntervals={15}
                      dateFormat='dd.MM.yyyy HH:mm'
                      customInput={
                        <CustomInput
                          label={`Tarihi ${index + 1}`}
                          fullWidth
                          InputProps={{
                            style: {
                              ...inputBg,
                              height: 56,
                              fontSize: 16,
                              paddingLeft: 16,
                              paddingRight: 16
                            }
                          }}
                        />
                      }
                    />
                  </div>
                </Grid>
              ))}
            </Grid>

            <Box mt={2}>
              <Button disableRipple variant='outlined' onClick={handleAddReturnInfo}>
                + İade Bilgisi Ekle
              </Button>
            </Box>
          </Box>
        )}

        {/* Sipariş ve Gönderim Bilgileri */}
        {(invoiceInfo.isEInvoice || dueDateAndPaymentMethod) && (
          <Box
            className='flex flex-col gap-4 sm:flex-row sm:gap-6 p-4 rounded-md shadow-md'
            sx={{ background: theme.palette.background.paper }}
          >
            {/* Sipariş ve Gönderim sadece e-Fatura ise gösterilir */}
            {invoiceInfo.isEInvoice && (
              <>
                {/* Sipariş Bilgileri */}
                <Box className='flex-1 w-full min-w-[260px]'>
                  <Typography variant='h6' sx={{ mb: 4 }}>
                    Sipariş
                  </Typography>
                  <Grid container direction='column' spacing={0} className=' flex flex-col gap-4 max-w-[70%]'>
                    <Grid item>
                      <Autocomplete
                        freeSolo
                        options={siteOptions}
                        value={orderInfo.site}
                        onInputChange={(_, newValue) => setOrderInfo(prev => ({ ...prev, site: newValue }))}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Site'
                            fullWidth
                            InputProps={{ ...params.InputProps, style: inputBg }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label='Sipariş No'
                        value={orderInfo.orderNo}
                        onChange={e => setOrderInfo(prev => ({ ...prev, orderNo: e.target.value }))}
                        InputProps={{ style: inputBg }}
                      />
                    </Grid>
                    <Grid item>
                      <AppReactDatepicker
                        selected={orderInfo.orderDate}
                        onChange={date => setOrderInfo(prev => ({ ...prev, orderDate: date }))}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        dateFormat='dd.MM.yyyy HH:mm'
                        customInput={<CustomInput label='Sipariş Tarihi' fullWidth InputProps={{ style: inputBg }} />}
                        boxProps={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Gönderim Bilgisi */}
                <Box className='flex-1 w-full min-w-[260px]'>
                  <Typography variant='h6' sx={{ mb: 4 }}>
                    Gönderim Şekli
                  </Typography>
                  <Grid container direction='column' spacing={0} className='flex flex-col gap-4 max-w-[70%]'>
                    <Grid item>
                      <TextField
                        fullWidth
                        label='VKN/TCKNO'
                        value={shipmentInfo.vknTckno}
                        onChange={e => setShipmentInfo(prev => ({ ...prev, vknTckno: e.target.value }))}
                        InputProps={{ style: inputBg }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label='Ünvan'
                        value={shipmentInfo.title}
                        onChange={e => setShipmentInfo(prev => ({ ...prev, title: e.target.value }))}
                        InputProps={{ style: inputBg }}
                      />
                    </Grid>
                    <Grid item>
                      <AppReactDatepicker
                        selected={shipmentInfo.shipmentDate}
                        onChange={date => setShipmentInfo(prev => ({ ...prev, shipmentDate: date }))}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        dateFormat='dd.MM.yyyy HH:mm'
                        customInput={<CustomInput label='Gönderi Tarihi' fullWidth InputProps={{ style: inputBg }} />}
                        boxProps={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {/* Ödeme Bilgisi */}
            <Box className={`${invoiceInfo.isEInvoice ? 'flex-1' : 'w-full sm:w-1/2 lg:w-1/3'} min-w-[260px]`}>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Ödeme Bilgisi
              </Typography>
              <Grid container direction='column' spacing={0} className='flex flex-col gap-4 max-w-[70%]'>
                <Grid item>
                  <Autocomplete
                    freeSolo
                    options={paymentOptions}
                    value={paymentInfo.method}
                    onInputChange={(_, newValue) => setPaymentInfo(prev => ({ ...prev, method: newValue }))}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Ödeme Yöntemi'
                        fullWidth
                        InputProps={{ ...params.InputProps, style: inputBg }}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label='Aracı'
                    value={paymentInfo.agent}
                    onChange={e => setPaymentInfo(prev => ({ ...prev, agent: e.target.value }))}
                    InputProps={{ style: inputBg }}
                  />
                </Grid>
                <Grid item>
                  <AppReactDatepicker
                    selected={paymentInfo.paymentDate}
                    onChange={date => setPaymentInfo(prev => ({ ...prev, paymentDate: date }))}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    dateFormat='dd.MM.yyyy HH:mm'
                    customInput={<CustomInput label='Ödeme Tarihi' fullWidth InputProps={{ style: inputBg }} />}
                    boxProps={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        {/*Checkbox'lar */}
        <Box
          className='flex flex-col sm:flex-row gap-4 p-4  rounded-md shadow-md'
          sx={{ background: theme.palette.background.paper }}
        >
          <FormControlLabel
            control={
              <Checkbox checked={includesVAT} onChange={e => setIncludesVAT(e.target.checked)} color='primary' />
            }
            label='KDV Dahil'
            className='sm:mr-4'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={dueDateAndPaymentMethod}
                onChange={e => setDueDateAndPaymentMethod(e.target.checked)}
                color='primary'
              />
            }
            label='Vade Tarihi ve Ödeme Şekli Ekle'
            className='sm:mr-4'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={invoiceInfo.isEInvoice}
                onChange={e => setInvoiceInfo({ ...invoiceInfo, isEInvoice: e.target.checked })}
                color='primary'
              />
            }
            label='E-Ticaret'
          />
          {currentInvoiceType === 'TEVKIFAT' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isWithholdingTax}
                  onChange={e => setIsWithholdingTax(e.target.checked)}
                  color='primary'
                />
              }
              label='Toplu Tevkifat'
              className='sm:mr-4'
            />
          )}
        </Box>
        {/* Toplu Tevkifat Bilgileri */}
        {isWithholdingTax && currentInvoiceType === 'TEVKIFAT' && (
          <Box
            className='flex flex-col gap-4 sm:flex-row sm:gap-6 p-4 rounded-md shadow-md'
            sx={{ background: theme.palette.background.paper }}
          >
            <Box className='w-full max-w-[70%]'>
              <Typography variant='h6' className='mb-4'>
                Toplu Tevkifat Bilgileri
              </Typography>
              <Grid
                container
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0}
                className=' flex flex-row gap-4 w-full'
              >
                <Grid item className='w-full sm:w-1/2 lg:w-1/3'>
                  <Button
                    fullWidth
                    variant='outlined'
                    disableRipple
                    onClick={e => setKdvPopoverAnchor(e.currentTarget)}
                    className='flex flex-col items-start justify-start gap-[2px] text-left p-[10px] min-h-[80px] !transition-none'
                    sx={{
                      background: theme.palette.background.paper,
                      color: withholdingTaxInfo.type ? 'text.primary' : 'text.secondary',
                      borderColor: theme.palette.divider
                    }}
                  >
                    {withholdingTaxInfo.type ? (
                      <span className='flex flex-row items-center gap-2'>
                        <span
                          className='inline-block text-left'
                          style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                        >
                          {withholdingTaxInfo.type}
                        </span>
                        -
                        <span className='flex-1'>
                          {kdvTevkifatOrnekleri.find(o => o.kod.toString() === withholdingTaxInfo.type)?.hizmet || ''}
                        </span>
                      </span>
                    ) : (
                      'Türü'
                    )}
                  </Button>
                  <Popover
                    open={Boolean(kdvPopoverAnchor)}
                    anchorEl={kdvPopoverAnchor}
                    onClose={() => {
                      setKdvPopoverAnchor(null)
                      setKdvSearch('')
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: { width: kdvPopoverAnchor?.clientWidth || 300, maxWidth: '100%' }
                    }}
                  >
                    <div className='flex flex-col max-h-[400px] w-full'>
                      <div className='p-2 border-b'>
                        <TextField
                          fullWidth
                          size='small'
                          placeholder='Tür ara...'
                          value={kdvSearch}
                          onChange={e => setKdvSearch(e.target.value)}
                        />
                      </div>
                      <div className='overflow-y-auto flex-1'>
                        {filteredKdvList.length > 0 ? (
                          filteredKdvList.map(opt => (
                            <MenuItem
                              key={opt.kod}
                              onClick={() => {
                                setWithholdingTaxInfo(prev => ({ ...prev, type: opt.kod.toString() }))
                                if (setBulkWithholdingType) setBulkWithholdingType(opt.kod.toString())
                                setKdvPopoverAnchor(null)
                                setKdvSearch('')
                              }}
                            >
                              <span className='flex flex-row items-right gap-2'>
                                <span
                                  className='inline-block text-left'
                                  style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                                >
                                  {opt.kod}
                                </span>
                                -{' '}
                                <span
                                  className='inline-block text-left'
                                  style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                                >
                                  {opt.oran / 10}/10
                                </span>
                                <span className='flex-1'>{opt.hizmet}</span>
                              </span>
                            </MenuItem>
                          ))
                        ) : (
                          <div className='p-4 text-center text-gray-500'>Eşleşen tür bulunamadı.</div>
                        )}
                      </div>
                    </div>
                  </Popover>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        {/* İstisna Türü Seçimi */}
        {currentInvoiceType === 'ISTISNA' && (
          <Box
            className='flex flex-col gap-4 sm:flex-row sm:gap-6 p-4 rounded-md shadow-md'
            sx={{ background: theme.palette.background.paper }}
          >
            <Box className='w-full max-w-[70%]'>
              <Typography variant='h6' className='mb-4'>
                İstisna Bilgileri
              </Typography>
              <Grid
                container
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0}
                className=' flex flex-row gap-4 w-full'
              >
                <Grid item className='w-full sm:w-1/2 lg:w-1/3'>
                  <Button
                    fullWidth
                    variant='outlined'
                    disableRipple
                    onClick={e => setIstisnaPopoverAnchor(e.currentTarget)}
                    className='flex flex-col items-start justify-start gap-[2px] text-left p-[10px] min-h-[80px] !transition-none'
                    sx={{
                      background: theme.palette.background.paper,
                      color: selectedIstisna ? 'text.primary' : 'text.secondary',
                      borderColor: theme.palette.divider
                    }}
                  >
                    {selectedIstisna ? (
                      <span className='flex flex-row items-center gap-2'>
                        <span
                          className='inline-block text-left'
                          style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                        >
                          {selectedIstisna}
                        </span>
                        -<span className='flex-1'>{istisnaTurleri.find(o => o.kod === selectedIstisna)?.ad || ''}</span>
                      </span>
                    ) : (
                      'İstisna Türü'
                    )}
                  </Button>

                  <Popover
                    open={Boolean(istisnaPopoverAnchor)}
                    anchorEl={istisnaPopoverAnchor}
                    onClose={() => {
                      setIstisnaPopoverAnchor(null)
                      setIstisnaSearch('')
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: { width: istisnaPopoverAnchor?.clientWidth || 300, maxWidth: '100%' }
                    }}
                  >
                    <div className='flex flex-col max-h-[400px] w-full'>
                      <div className='p-2 border-b'>
                        <TextField
                          fullWidth
                          size='small'
                          placeholder='İstisna türü ara...'
                          value={istisnaSearch}
                          onChange={e => setIstisnaSearch(e.target.value)}
                        />
                      </div>
                      <div className='overflow-y-auto flex-1'>
                        {filteredIstisnaList.length > 0 ? (
                          filteredIstisnaList.map(opt => (
                            <MenuItem
                              key={opt.kod}
                              onClick={() => {
                                setSelectedIstisna(opt.kod)
                                setIstisnaPopoverAnchor(null)
                                setIstisnaSearch('')
                              }}
                            >
                              <span className='flex flex-row items-right gap-2'>
                                <span
                                  className='inline-block text-left'
                                  style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                                >
                                  {opt.kod}
                                </span>
                                <span className='flex-1'>{opt.ad}</span>
                              </span>
                            </MenuItem>
                          ))
                        ) : (
                          <div className='p-4 text-center text-gray-500'>Eşleşen istisna bulunamadı.</div>
                        )}
                      </div>
                    </div>
                  </Popover>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Stack>
      {/* Müşteri Ekleme/Güncelleme Drawer */}
      <AddCustomerDrawer
        open={customerDrawerOpen}
        setOpen={open => {
          setCustomerDrawerOpen(open)
          if (!open) setEditingCustomer(null)
        }}
        onFormSubmit={
          showDifferentCustomer && editingCustomer === null && differentCustomer === ''
            ? handleCustomerSubmitOdeyen
            : handleCustomerSubmitCari
        }
        defaultData={editingCustomer}
        mode={editingCustomer ? 'edit' : 'add'}
      />
    </Box>
  )
}

export default EInvoiceCard
