import type { NextApiRequest, NextApiResponse } from 'next'
import xml2js from 'xml2js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { currency } = req.query

  if (!currency || currency === 'TRY') {
    return res.status(200).json({ rate: '', date: '' })
  }

  try {
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml')
    const xml = await response.text()

    xml2js.parseString(xml, (err, result) => {
      if (err) return res.status(500).json({ rate: '', date: '', error: 'Parse error' })
      const tarih = result.Tarih_Date.$.Tarih
      const currencies = result.Tarih_Date.Currency
      const found = currencies.find((c: any) => c.$.CurrencyCode === currency)
      const rate = found?.ForexSelling?.[0] || ''

      return res.status(200).json({ rate, date: tarih })
    })
  } catch (e) {
    return res.status(500).json({ rate: '', date: '', error: 'Fetch error' })
  }
}
