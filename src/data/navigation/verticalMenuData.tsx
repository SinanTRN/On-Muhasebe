// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboards,
    icon: 'ri-home-smile-line',
    suffix: {
      label: '5',
      color: 'error'
    },
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].crm,
        href: '/dashboards/crm'
      },
      {
        label: dictionary['navigation'].analytics,
        href: '/dashboards/analytics'
      },
      {
        label: dictionary['navigation'].eCommerce,
        href: '/dashboards/ecommerce'
      },
      {
        label: dictionary['navigation'].academy,
        href: '/dashboards/academy'
      },
      {
        label: dictionary['navigation'].logistics,
        href: '/dashboards/logistics'
      }
    ]
  },
  {
    label: dictionary['navigation'].frontPages,
    icon: 'ri-file-copy-line',
    children: [
      {
        label: dictionary['navigation'].landing,
        href: '/front-pages/landing-page',
        target: '_blank',
        excludeLang: true
      },
      {
        label: dictionary['navigation'].pricing,
        href: '/front-pages/pricing',
        target: '_blank',
        excludeLang: true
      },
      {
        label: dictionary['navigation'].payment,
        href: '/front-pages/payment',
        target: '_blank',
        excludeLang: true
      },
      {
        label: dictionary['navigation'].checkout,
        href: '/front-pages/checkout',
        target: '_blank',
        excludeLang: true
      },
      {
        label: dictionary['navigation'].helpCenter,
        href: '/front-pages/help-center',
        target: '_blank',
        excludeLang: true
      }
    ]
  },

  // Create Section
  {
    label: dictionary['navigation'].create,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].eInvoice,
        icon: 'ri-article-line'
      },
      {
        label: dictionary['navigation'].eDeliveryNote,
        icon: 'ri-truck-line'
      }
    ]
  },

  // Draft Section
  {
    label: dictionary['navigation'].draft,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].eInvoice,
        icon: 'ri-article-line'
      },
      {
        label: dictionary['navigation'].eDeliveryNote,
        icon: 'ri-truck-line'
      }
    ]
  },

  // Incoming Section
  {
    label: dictionary['navigation'].incoming,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].eInvoice,
        icon: 'ri-article-line'
      },
      {
        label: dictionary['navigation'].eDeliveryNote,
        icon: 'ri-truck-line'
      }
    ]
  },

  // Outgoing Section
  {
    label: dictionary['navigation'].outgoing,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].eInvoice,
        icon: 'ri-article-line'
      },
      {
        label: dictionary['navigation'].eDeliveryNote,
        icon: 'ri-truck-line'
      }
    ]
  },

  // Reports Section
  {
    label: dictionary['navigation'].reports,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].salesReport,
        icon: 'ri-bar-chart-line',
        href: '/reports/sales'
      },
      {
        label: dictionary['navigation'].stockReport,
        icon: 'ri-database-2-line',
        href: '/reports/stock'
      }
    ]
  },

  // Settings Section
  {
    label: dictionary['navigation'].settings,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].profileSettings,
        icon: 'ri-user-settings-line',
        href: '/settings/profile'
      },
      {
        label: dictionary['navigation'].systemSettings,
        icon: 'ri-settings-3-line',
        href: '/settings/system'
      }
    ]
  }
]

export default verticalMenuData
