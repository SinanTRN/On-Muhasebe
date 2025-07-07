'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Autocomplete from '@mui/material/Autocomplete'

import type { Tbl } from '../../../../types/cariTypes'
import { CariTipEnum } from '../../../../types/cariTypes'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onFormSubmit: (formData: Tbl) => void
  defaultData?: Tbl | null
  mode?: 'add' | 'edit'
}

export type CustomerFormDataType = Omit<Tbl, 'IND'> & { IND?: number }

// Vars
export const initialFormData: CustomerFormDataType = {
  CAR_TIP: '',
  LOGO: null,
  CARI_KOD: '',
  MUH_ENT_CARI_KOD: '',
  UNVAN: '',
  AD: '',
  SOYAD: '',
  GSM_1: '',
  GSM_2: '',
  TEL: '',
  FAKS: '',
  ADRES: '',
  ULKE: 'Türkiye',
  IL: '',
  ILCE: '',
  POSTA_KODU: '',
  VD: '',
  VN: '',
  EPOSTA: '',
  WEB: '',
  LIMIT: 0,
  VADE: 0,
  OK: true,
  OT: false,
  GK: false,
  GT: false,
  PASIF: false,
  SILINDI: false
}

const countryList = [
  'Türkiye',
  'Almanya',
  'Amerika Birleşik Devletleri',
  'Fransa',
  'İngiltere',
  'İtalya',
  'İspanya',
  'Rusya',
  'Çin',
  'Japonya',
  'Kanada',
  'Avustralya',
  'Azerbaycan',
  'Belçika',
  'Brezilya',
  'Bulgaristan',
  'Danimarka',
  'Finlandiya',
  'Güney Kore',
  'Hindistan',
  'Hollanda',
  'Irak',
  'İran',
  'İsrail',
  'İsveç',
  'İsviçre',
  'Katar',
  'Kazakistan',
  'Kırgızistan',
  'Kuveyt',
  'Libya',
  'Lübnan',
  'Mısır',
  'Norveç',
  'Özbekistan',
  'Pakistan',
  'Polonya',
  'Portekiz',
  'Romanya',
  'Sırbistan',
  'Suudi Arabistan',
  'Türkmenistan',
  'Ukrayna',
  'Ürdün',
  'Yunanistan'
]

const AddCustomerDrawer = ({ open, setOpen, onFormSubmit, defaultData, mode }: Props) => {
  // States
  const [formData, setFormData] = useState<CustomerFormDataType>(initialFormData)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpen(false)

    const submitData: Tbl = {
      ...formData,
      IND: formData.IND || Date.now()
    }

    onFormSubmit(submitData)
    handleReset()
  }

  const handleReset = () => {
    setOpen(false)
    setFormData(initialFormData)
  }

  useEffect(() => {
    if (defaultData) {
      setFormData({ ...defaultData, CAR_TIP: defaultData.CAR_TIP || '' })
    }
  }, [defaultData])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 320, sm: 450 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{mode === 'edit' ? 'Cari Düzenle' : 'Yeni Cari Ekle'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            fullWidth
            label='Vergi Numarası (VN)'
            value={formData.VN}
            onChange={e => setFormData({ ...formData, VN: e.target.value })}
            required
          />
          <FormControl fullWidth>
            <InputLabel id='type'>Tür</InputLabel>
            <Select
              labelId='type'
              label='Tür'
              value={formData.CAR_TIP}
              onChange={e => setFormData({ ...formData, CAR_TIP: e.target.value })}
            >
              <MenuItem value={CariTipEnum.Musteri.toString()}>Müşteri</MenuItem>
              <MenuItem value={CariTipEnum.Tedarikci.toString()}>Tedarikçi</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label='Cari Kod'
            value={formData.CARI_KOD}
            onChange={e => setFormData({ ...formData, CARI_KOD: e.target.value })}
          />
          <TextField
            fullWidth
            label='Ünvan'
            value={formData.UNVAN}
            onChange={e => setFormData({ ...formData, UNVAN: e.target.value })}
          />
          <TextField
            fullWidth
            label='Ad'
            value={formData.AD}
            onChange={e => setFormData({ ...formData, AD: e.target.value })}
          />
          <TextField
            fullWidth
            label='Soyad'
            value={formData.SOYAD}
            onChange={e => setFormData({ ...formData, SOYAD: e.target.value })}
          />
          <TextField
            fullWidth
            label='GSM 1'
            value={formData.GSM_1}
            onChange={e => setFormData({ ...formData, GSM_1: e.target.value })}
          />
          <TextField
            fullWidth
            label='Telefon'
            value={formData.TEL}
            onChange={e => setFormData({ ...formData, TEL: e.target.value })}
          />
          <TextField
            fullWidth
            type='email'
            label='E-posta'
            value={formData.EPOSTA}
            onChange={e => setFormData({ ...formData, EPOSTA: e.target.value })}
          />
          <Autocomplete
            fullWidth
            options={countryList.sort((a, b) => a.localeCompare(b))}
            value={formData.ULKE}
            onChange={(_, newValue) => setFormData({ ...formData, ULKE: newValue || '' })}
            renderInput={params => <TextField {...params} label='Ülke' />}
            filterOptions={(options, state) =>
              options.filter(option => option.toLowerCase().includes(state.inputValue.toLowerCase()))
            }
          />
          <TextField
            fullWidth
            label='İl'
            value={formData.IL}
            onChange={e => setFormData({ ...formData, IL: e.target.value })}
          />
          <TextField
            fullWidth
            label='İlçe'
            value={formData.ILCE}
            onChange={e => setFormData({ ...formData, ILCE: e.target.value })}
          />
          <TextField
            fullWidth
            label='Adres'
            value={formData.ADRES}
            onChange={e => setFormData({ ...formData, ADRES: e.target.value })}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label='Vergi Dairesi'
            value={formData.VD}
            onChange={e => setFormData({ ...formData, VD: e.target.value })}
          />
          <TextField
            fullWidth
            label='Posta Kodu'
            value={formData.POSTA_KODU}
            onChange={e => setFormData({ ...formData, POSTA_KODU: e.target.value })}
          />

          <TextField
            fullWidth
            label='Web'
            value={formData.WEB}
            onChange={e => setFormData({ ...formData, WEB: e.target.value })}
          />
          <TextField
            fullWidth
            label='Limit'
            value={formData.LIMIT}
            onChange={e => setFormData({ ...formData, LIMIT: Number(e.target.value) })}
          />
          <TextField
            fullWidth
            label='Vade'
            value={formData.VADE}
            onChange={e => setFormData({ ...formData, VADE: Number(e.target.value) })}
          />
          <FormControlLabel
            control={
              <Switch checked={formData.OK} onChange={e => setFormData({ ...formData, OK: e.target.checked })} />
            }
            label='OK'
          />
          <FormControlLabel
            control={
              <Switch checked={formData.OT} onChange={e => setFormData({ ...formData, OT: e.target.checked })} />
            }
            label='OT'
          />
          <FormControlLabel
            control={
              <Switch checked={formData.GK} onChange={e => setFormData({ ...formData, GK: e.target.checked })} />
            }
            label='GK'
          />
          <FormControlLabel
            control={
              <Switch checked={formData.GT} onChange={e => setFormData({ ...formData, GT: e.target.checked })} />
            }
            label='GT'
          />
          <FormControlLabel
            control={
              <Switch checked={formData.PASIF} onChange={e => setFormData({ ...formData, PASIF: e.target.checked })} />
            }
            label='Pasif'
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.SILINDI}
                onChange={e => setFormData({ ...formData, SILINDI: e.target.checked })}
              />
            }
            label='Silindi'
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Kaydet
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleReset}>
              İptal
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddCustomerDrawer
