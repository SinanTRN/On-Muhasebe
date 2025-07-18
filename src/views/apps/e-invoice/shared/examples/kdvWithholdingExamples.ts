import type { KdvTevkifat } from '../../../../../types/apps/kdvWithholdingTypes'

export const kdvTevkifatOrnekleri: KdvTevkifat[] = [
  {
    kod: 601,
    hizmet: 'Yapım İşleri ile Bu İşlerle Birlikte İfa Edilen Mühendislik-Mimarlık ve Etüt-Proje Hizmetleri',
    oran: 40 // 4/10 oranı için 40 yazıldı
  },
  {
    kod: 602,
    hizmet: 'Etüt, Plan-Proje, Danışmanlık, Denetim ve Benzeri Hizmetler',
    oran: 90 // 9/10 oranı için 90 yazıldı
  },
  {
    kod: 603,
    hizmet: 'Makine, Teçhizat, Demirbaş ve Taşıtlara Ait Tadil, Bakım ve Onarım',
    oran: 70 // 7/10 oranı için 70 yazıldı
  },
  {
    kod: 604,
    hizmet: 'Yemek Servis Hizmeti',
    oran: 50 // 5/10 oranı için 50 yazıldı
  }
]
