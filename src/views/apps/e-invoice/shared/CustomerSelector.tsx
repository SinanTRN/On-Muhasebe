'use client'

import { useState } from 'react'

import { Button, MenuItem, Popover, TextField, Typography, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import Tooltip from '@mui/material/Tooltip'

import type { Tbl } from '@/types/apps/cariTypes'

//import theme from '@/@core/theme'

interface CustomerSelectorProps {
  customers: Tbl[]
  selectedCustomer: string
  onSelect: (cariKod: string) => void
  onEdit: (customer: Tbl) => void
  onAddCustomer: () => void
}

const CustomerSelector = ({ customers, selectedCustomer, onSelect, onEdit, onAddCustomer }: CustomerSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(c => {
    const search = searchTerm.toLowerCase()

    return (c.VN && c.VN.toLowerCase().includes(search)) || (c.UNVAN && c.UNVAN.toLowerCase().includes(search))
  })

  const selected = customers.find(c => c.VN === selectedCustomer)
  const theme = useTheme()

  return (  
    <>
      <Button
        fullWidth
        variant='outlined'
        disableElevation
        disableRipple
        disableFocusRipple
        onClick={event => setAnchorEl(event.currentTarget)}
        className='flex flex-col items-start justify-start gap-[2px] text-left p-[10px] min-h-[80px] !transition-none'
        sx={{
          background: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        {selected ? (
          <div className='flex flex-col items-start w-full relative'>
            <div className='flex flex-row items-start w-full'>
              <Typography
                variant='body1'
                style={{
                  fontWeight: 600,
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  flex: 1,
                  minWidth: 0
                }}
              >
                {selected.UNVAN}
              </Typography>
              <Icon
                icon='ri:edit-line'
                fontSize={20}
                className='cursor-pointer'
                style={{ marginLeft: 8, flexShrink: 0 }}
                onClick={(e: any) => {
                  e.stopPropagation()
                  onEdit(selected)
                }}
              />
            </div>
            <Typography variant='body2' color='textSecondary'>
              {selected.ADRES}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {[selected.ILCE, selected.IL, selected.ULKE].filter(Boolean).join(' / ')}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {[selected.VD, selected.VN].filter(Boolean).join(' / ')}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {selected.EPOSTA}
            </Typography>
          </div>
        ) : (
          'Cari Seçiniz'
        )}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
          setSearchTerm('')
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <div
          className='flex flex-col max-h-[400px]'
          style={{
            width: anchorEl?.clientWidth || 300
          }}
        >
          <div className='p-2 border-b'>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari ara...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='overflow-y-auto flex-1'>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <MenuItem
                  key={customer.VN}
                  onClick={() => {
                    onSelect(customer.VN)
                    setAnchorEl(null)
                    setSearchTerm('')
                  }}
                >
                  <span className='flex flex-row items-right gap-2'>
                    <span
                      className='flex-inline-block text-left'
                      style={{ minWidth: 25, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {customer.VN}
                    </span>
                    -{' '}
                    <span
                      className='flex-inline-block text-left'
                      style={{ minWidth: 100, fontVariantNumeric: 'tabular-nums', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      <Tooltip title={customer.UNVAN} placement='top' arrow disableInteractive>
                        <Typography variant='body1' noWrap style={{ maxWidth: 160, display: 'inline-block', verticalAlign: 'middle' }}>
                          {customer.UNVAN}
                        </Typography>
                      </Tooltip>
                    </span>
                  </span>
                </MenuItem>
              ))
            ) : (
              <div className='p-4 text-center text-gray-500'>Eşleşen cari bulunamadı.</div>
            )}
          </div>

          <div className='border-t p-2 sticky bottom-0 z-10'>
            <Button
              fullWidth
              color='success'
              variant='contained'
              startIcon={<Icon icon='ri:add-line' fontSize={24} />}
              onClick={() => {
                onAddCustomer()
                setAnchorEl(null)
                setSearchTerm('')
              }}
            >
              Yeni Cari Ekle
            </Button>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default CustomerSelector
