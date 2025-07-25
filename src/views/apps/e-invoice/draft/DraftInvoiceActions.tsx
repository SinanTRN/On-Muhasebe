import React from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Card } from '@mui/material'

interface DraftInvoiceActionsProps {
  selected: string[]
}

const DraftInvoiceActions: React.FC<DraftInvoiceActionsProps> = ({ selected }) => {
  const hasSelection = selected.length > 0
  const isSingleSelection = selected.length === 1

  return (
    <Card className='p-4 rounded-md shadow-md'>
      <Stack direction='row' spacing={2}>
        <Button variant='outlined' disabled={!isSingleSelection} color='info' disableRipple>
          Düzenle
        </Button>
        <Button variant='outlined' disabled={!hasSelection} color='error' disableRipple>
          İptal Et
        </Button>
        <Button variant='outlined' disabled={!hasSelection} color='secondary' disableRipple>
          Yazdır
        </Button>
        <Button variant='outlined' disabled={!hasSelection} color='success' disableRipple>
          İndir
        </Button>
      </Stack>
    </Card>
  )
}

export default DraftInvoiceActions
