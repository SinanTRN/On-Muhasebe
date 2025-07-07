'use client'

import { Grid, Card, CardContent, Button } from '@mui/material'

const AddActions = () => {
  // State'ler

  return (
    <Grid container>
      <Grid item xs={6}>
        <Card>
          <CardContent className='flex flex-row gap-4'>
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
      </Grid>
    </Grid>
  )
}

export default AddActions
