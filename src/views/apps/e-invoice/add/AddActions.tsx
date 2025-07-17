'use client'

import { Card, CardContent, Button } from '@mui/material'

const AddActions = () => {
  // State'ler

  return (
    <Card className='flex flex-row  rounded-md shadow-md'>
      <CardContent className='flex flex-col gap-2 sm:flex-row'>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          startIcon={<i className='ri-send-plane-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ '&:hover': { backgroundColor: 'primary.main' }, transition: 'none' }}
          className='max-width-[200px]'
        >
          Fatura Gönder
        </Button>

        <Button
          fullWidth
          variant='outlined'
          color='secondary'
          startIcon={<i className='ri-eye-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ transition: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          className='max-width-[200px]'
        >
          Önizleme
        </Button>

        <Button
          fullWidth
          variant='contained'
          color='success'
          startIcon={<i className='ri-save-line' />}
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{ transition: 'none', '&:hover': { backgroundColor: 'success.main' } }}
          className='max-width-[200px]'
        >
          Kaydet
        </Button>
      </CardContent>
    </Card>
  )
}

export default AddActions
