import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import xml2js from 'xml2js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const currency = searchParams.get('currency')

  if (!currency || currency === 'TRY') {
    return NextResponse.json({ rate: '', date: '' })
  }

  try {
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml')
    const xml = await response.text()
    let tarih = ''
    let rate = ''

    await xml2js.parseStringPromise(xml).then(result => {
      tarih = result.Tarih_Date.$.Tarih
      const currencies = result.Tarih_Date.Currency
      const found = currencies.find((c: any) => c.$.CurrencyCode === currency)

      rate = found?.ForexBuying?.[0] || ''
    })

    return NextResponse.json({ rate, date: tarih })
  } catch (e) {
    return NextResponse.json({ rate: '', date: '', error: 'Fetch error' }, { status: 500 })
  }
}
