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

  {
    label: dictionary['navigation'].eInvoice,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].create,
        icon: 'ri-add-box-line',
        children: [
          {
            label: dictionary['navigation'].new,
            href: '/apps/e-invoice/add'
          },
          {
            label: dictionary['navigation'].draft,
            href: '/apps/e-invoice/draft'
          }
        ]
      },
      {
        label: dictionary['navigation'].status,
        icon: 'ri-bar-chart-box-line',
        children: [
          {
            label: dictionary['navigation'].incoming,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].outgoing,
            href: '/apps/ecommerce/manage-reviews'
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].eArchive,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].create,
        icon: 'ri-add-box-line',
        children: [
          {
            label: dictionary['navigation'].new,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].draft,
            href: '/apps/ecommerce/manage-reviews'
          }
        ]
      },
      {
        label: dictionary['navigation'].status,
        icon: 'ri-bar-chart-box-line',
        children: [
          {
            label: dictionary['navigation'].incoming,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].outgoing,
            href: '/apps/ecommerce/manage-reviews'
          }
        ]
      }
    ]
  },
  {
    label: dictionary['navigation'].eDeliveryNote,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].create,
        icon: 'ri-add-box-line',
        children: [
          {
            label: dictionary['navigation'].new,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].draft,
            href: '/apps/ecommerce/manage-reviews'
          }
        ]
      },
      {
        label: dictionary['navigation'].status,
        icon: 'ri-bar-chart-box-line',
        children: [
          {
            label: dictionary['navigation'].incoming,
            href: '/apps/ecommerce/dashboard'
          },
          {
            label: dictionary['navigation'].outgoing,
            href: '/apps/ecommerce/manage-reviews'
          }
        ]
      }
    ]
  },
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
