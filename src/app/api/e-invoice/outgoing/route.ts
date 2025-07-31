import { NextRequest, NextResponse } from 'next/server'
import { sampleOutgoingInvoiceJsons } from '@/data/sampleOutgoingInvoices'

// GET - Giden faturaları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const deliveryStatus = searchParams.get('deliveryStatus')
    const isConfirmed = searchParams.get('isConfirmed')
    const isArchived = searchParams.get('isArchived')
    const search = searchParams.get('search')

    let filteredInvoices = [...sampleOutgoingInvoiceJsons]

    // Filtreleme
    if (status) {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status)
    }

    if (deliveryStatus) {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.deliveryStatus === deliveryStatus)
    }

    if (isConfirmed !== null) {
      const isConfirmedBoolean = isConfirmed === 'true'
      filteredInvoices = filteredInvoices.filter(invoice => invoice.isConfirmed === isConfirmedBoolean)
    }

    if (isArchived !== null) {
      const isArchivedBoolean = isArchived === 'true'
      filteredInvoices = filteredInvoices.filter(invoice => invoice.isArchived === isArchivedBoolean)
    }

    if (search) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.documentNo.toLowerCase().includes(search.toLowerCase()) ||
        invoice.description.toLowerCase().includes(search.toLowerCase()) ||
        invoice.recipientName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.recipientVknTckno.includes(search)
      )
    }

    // Sayfalama
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedInvoices,
      pagination: {
        page,
        limit,
        total: filteredInvoices.length,
        totalPages: Math.ceil(filteredInvoices.length / limit)
      }
    })
  } catch (error) {
    console.error('Giden faturalar listelenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Giden faturalar listelenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni giden fatura ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Yeni fatura oluştur
    const newInvoice = {
      ...body,
      documentNo: `EFTR-${Date.now()}`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'pending',
      deliveryAttempts: 0,
      isConfirmed: false,
      isArchived: false,
      tags: body.tags || [],
      notes: body.notes || '',
      meta: {
        type: "outgoing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0",
        source: "e-fatura-sistemi"
      }
    }

    // Gerçek uygulamada burada veritabanına kayıt yapılır
    console.log('Yeni giden fatura eklendi:', newInvoice)

    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: 'Giden fatura başarıyla eklendi'
    })
  } catch (error) {
    console.error('Giden fatura eklenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Giden fatura eklenemedi' },
      { status: 500 }
    )
  }
} 
