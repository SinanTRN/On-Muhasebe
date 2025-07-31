import { NextRequest, NextResponse } from 'next/server'
import { sampleIncomingInvoiceJsons } from '@/data/sampleIncomingInvoices'

// GET - Gelen faturaları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const processingStatus = searchParams.get('processingStatus')
    const isRead = searchParams.get('isRead')
    const isArchived = searchParams.get('isArchived')
    const search = searchParams.get('search')

    let filteredInvoices = [...sampleIncomingInvoiceJsons]

    // Filtreleme
    if (status) {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status)
    }

    if (processingStatus) {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.processingStatus === processingStatus)
    }

    if (isRead !== null) {
      const isReadBoolean = isRead === 'true'
      filteredInvoices = filteredInvoices.filter(invoice => invoice.isRead === isReadBoolean)
    }

    if (isArchived !== null) {
      const isArchivedBoolean = isArchived === 'true'
      filteredInvoices = filteredInvoices.filter(invoice => invoice.isArchived === isArchivedBoolean)
    }

    if (search) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.documentNo.toLowerCase().includes(search.toLowerCase()) ||
        invoice.description.toLowerCase().includes(search.toLowerCase()) ||
        invoice.senderName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.senderVknTckno.includes(search)
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
    console.error('Gelen faturalar listelenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Gelen faturalar listelenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni gelen fatura ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Yeni fatura oluştur
    const newInvoice = {
      ...body,
      documentNo: `EFTR-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      processingStatus: 'pending',
      isRead: false,
      isArchived: false,
      deliveryAttempts: 0,
      isConfirmed: false,
      tags: body.tags || [],
      notes: body.notes || '',
      meta: {
        type: "incoming",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0",
        source: "e-fatura-sistemi"
      }
    }

    // Gerçek uygulamada burada veritabanına kayıt yapılır
    console.log('Yeni gelen fatura eklendi:', newInvoice)

    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: 'Gelen fatura başarıyla eklendi'
    })
  } catch (error) {
    console.error('Gelen fatura eklenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Gelen fatura eklenemedi' },
      { status: 500 }
    )
  }
} 
