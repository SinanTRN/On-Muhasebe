// TCMB xml tarihinin güncel olup olmadığını kontrol eder
export function isTCMBRateCurrent(xmlDate: string): boolean {
  if (!xmlDate) return true
  const today = new Date()
  const todayStr = today.toLocaleDateString('tr-TR').replace(/\//g, '.')
  return xmlDate === todayStr
} 
