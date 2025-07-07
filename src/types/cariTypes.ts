export interface Tbl {
  IND: number
  CAR_TIP: string
  LOGO: string | null
  CARI_KOD: string
  MUH_ENT_CARI_KOD: string
  UNVAN: string
  AD: string
  SOYAD: string
  GSM_1: string
  GSM_2: string
  TEL: string
  FAKS: string
  ADRES: string
  ULKE: string
  IL: string
  ILCE: string
  POSTA_KODU: string
  VD: string
  VN: string
  EPOSTA: string
  WEB: string
  LIMIT: number
  VADE: number
  OK: boolean
  OT: boolean
  GK: boolean
  GT: boolean
  PASIF: boolean
  SILINDI: boolean
}

export interface FINANS_CARI_TIP {
  IND: number
  TIP: string
  OK: boolean
  OT: boolean
  GK: boolean
  GT: boolean
  PASIF: boolean
  SILINDI: boolean
}

export enum CariTipEnum {
  Tedarikci = 1,
  Musteri = 2
}
