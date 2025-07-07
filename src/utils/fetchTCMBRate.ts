// TCMB'den döviz kuru çeker. TRY dışındaki bir para birimi için ForexSelling ve tarih döner. Tarih güncelliğini kontrol etmek için kullanılır.
// src/utils/fetchTCMBRate.ts
export async function fetchTCMBRate(currency: string): Promise<{ rate: string; date: string }> {
  if (currency === 'TRY') return { rate: '', date: '' }
  const res = await fetch(`/api/tcmb-rate?currency=${currency}`)

  return await res.json()
}
