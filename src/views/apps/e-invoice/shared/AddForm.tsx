import React, { useState } from 'react'

//MUI Imports
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import Label from '@mui/material/InputLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const AddForm = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    amount: '',
    date: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Send formData to backend
    console.log('Form submitted:', formData)
  }

  return (
    <Card className='max-w-xl mx-auto mt-6'>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='invoiceNumber'>Invoice Number</Label>
            <Input
              id='invoiceNumber'
              name='invoiceNumber'
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='customerName'>Customer Name</Label>
            <Input
              id='customerName'
              name='customerName'
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='amount'>Amount</Label>
            <Input id='amount' name='amount' type='number' value={formData.amount} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor='date'>Date</Label>
            <Input id='date' name='date' type='date' value={formData.date} onChange={handleChange} required />
          </div>

          <Button type='submit' className='w-full'>
            Create Invoice
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddForm
