import type { Tbl } from '@/types/apps/cariTypes'

// Cari bilgilerini JSON formatına dönüştüren interface
export interface CariJsonData {
  // Temel bilgiler
  id: string
  customerCode: string
  name: string
  firstName?: string
  lastName?: string
  
  // İletişim bilgileri
  phone: string
  mobilePhone1?: string
  mobilePhone2?: string
  fax?: string
  email?: string
  website?: string
  
  // Adres bilgileri
  address: string
  country: string
  city: string
  district: string
  postalCode?: string
  
  // Vergi bilgileri
  taxOffice: string
  taxNumber: string
  
  // İş bilgileri
  customerType: string
  limit?: number
  dueDate?: number
  
  // Durum bilgileri
  isActive: boolean
  isPassive: boolean
  isDeleted: boolean
  
  // Logo
  logo?: string | null | undefined
}

// Tbl tipinden JSON formatına dönüştürme
export const convertTblToJson = (tbl: Tbl): CariJsonData => {
  return {
    // Temel bilgiler
    id: tbl.VN || '',
    customerCode: tbl.VN || '',
    name: tbl.UNVAN || '',
    firstName: tbl.AD || '',
    lastName: tbl.SOYAD || '',
    
    // İletişim bilgileri
    phone: tbl.TEL || '',
    mobilePhone1: tbl.GSM_1 || '',
    mobilePhone2: tbl.GSM_2 || '',
    fax: tbl.FAKS || '',
    email: tbl.EPOSTA || '',
    website: tbl.WEB || '',
    
    // Adres bilgileri
    address: tbl.ADRES || '',
    country: tbl.ULKE || '',
    city: tbl.IL || '',
    district: tbl.ILCE || '',
    postalCode: tbl.POSTA_KODU || '',
    
    // Vergi bilgileri
    taxOffice: tbl.VD || '',
    taxNumber: tbl.VN || '',
    
    // İş bilgileri
    customerType: tbl.CAR_TIP || '',
    limit: tbl.LIMIT || 0,
    dueDate: tbl.VADE || 0,
    
    // Durum bilgileri
    isActive: !tbl.PASIF,
    isPassive: tbl.PASIF || false,
    isDeleted: tbl.SILINDI || false,
    
    // Logo
    logo: tbl.LOGO ?? null
  }
}

// Birden fazla cari bilgisini JSON formatına dönüştürme
export const convertTblArrayToJson = (tblArray: Tbl[]): CariJsonData[] => {
  return tblArray.map(tbl => convertTblToJson(tbl))
}

// JSON formatından Tbl tipine dönüştürme
export const convertJsonToTbl = (jsonData: CariJsonData): Tbl => {
  return {
    IND: 0, 
    CAR_TIP: jsonData.customerType,
    LOGO: jsonData.logo||null,
    CARI_KOD: jsonData.customerCode,
    MUH_ENT_CARI_KOD: jsonData.customerCode,
    UNVAN: jsonData.name,
    AD: jsonData.firstName || '',
    SOYAD: jsonData.lastName || '',
    GSM_1: jsonData.mobilePhone1 || '',
    GSM_2: jsonData.mobilePhone2 || '',
    TEL: jsonData.phone,
    FAKS: jsonData.fax || '',
    ADRES: jsonData.address,
    ULKE: jsonData.country,
    IL: jsonData.city,
    ILCE: jsonData.district,
    POSTA_KODU: jsonData.postalCode || '',
    VD: jsonData.taxOffice,
    VN: jsonData.taxNumber,
    EPOSTA: jsonData.email || '',
    WEB: jsonData.website || '',
    LIMIT: jsonData.limit || 0,
    VADE: jsonData.dueDate || 0,
    OK: jsonData.isActive,
    OT: jsonData.isPassive,
    GK: false, 
    GT: false,
    PASIF: jsonData.isPassive,
    SILINDI: jsonData.isDeleted
  }
}

// JSON formatından Tbl array'ine dönüştürme
export const convertJsonArrayToTbl = (jsonArray: CariJsonData[]): Tbl[] => {
  return jsonArray.map(jsonData => convertJsonToTbl(jsonData))
}

// Cari bilgilerini JSON string formatına dönüştürme
export const convertTblToJsonString = (tbl: Tbl): string => {
  const jsonData = convertTblToJson(tbl)
  return JSON.stringify(jsonData, null, 2)
}

// Birden fazla cari bilgisini JSON string formatına dönüştürme
export const convertTblArrayToJsonString = (tblArray: Tbl[]): string => {
  const jsonArray = convertTblArrayToJson(tblArray)
  return JSON.stringify(jsonArray, null, 2)
}

// JSON string'den Tbl tipine dönüştürme
export const convertJsonStringToTbl = (jsonString: string): Tbl => {
  const jsonData: CariJsonData = JSON.parse(jsonString)
  return convertJsonToTbl(jsonData)
}

// JSON string'den Tbl array'ine dönüştürme
export const convertJsonStringToTblArray = (jsonString: string): Tbl[] => {
  const jsonArray: CariJsonData[] = JSON.parse(jsonString)
  return convertJsonArrayToTbl(jsonArray)
}

// Cari bilgilerini filtreleme ve JSON'a dönüştürme
export const filterAndConvertToJson = (
  tblArray: Tbl[], 
  filterFn: (tbl: Tbl) => boolean
): CariJsonData[] => {
  const filteredArray = tblArray.filter(filterFn)
  return convertTblArrayToJson(filteredArray)
}

// Aktif carileri JSON'a dönüştürme
export const getActiveCarisAsJson = (tblArray: Tbl[]): CariJsonData[] => {
  return filterAndConvertToJson(tblArray, tbl => !tbl.PASIF && !tbl.SILINDI)
}

// Müşteri tipindeki carileri JSON'a dönüştürme
export const getCustomerCarisAsJson = (tblArray: Tbl[]): CariJsonData[] => {
  return filterAndConvertToJson(tblArray, tbl => tbl.CAR_TIP === 'Müşteri')
}

// Tedarikçi tipindeki carileri JSON'a dönüştürme
export const getSupplierCarisAsJson = (tblArray: Tbl[]): CariJsonData[] => {
  return filterAndConvertToJson(tblArray, tbl => tbl.CAR_TIP === 'Tedarikçi')
} 
