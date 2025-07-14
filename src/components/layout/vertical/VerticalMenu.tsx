// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
        </SubMenu>
        <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='ri-file-copy-line' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            {dictionary['navigation'].landing}
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            {dictionary['navigation'].pricing}
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            {dictionary['navigation'].payment}
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            {dictionary['navigation'].checkout}
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            {dictionary['navigation'].helpCenter}
          </MenuItem>
        </SubMenu>
        <MenuSection label={dictionary['navigation'].create}>
          <MenuItem href={`/${locale}/apps/e-invoice/add`} icon={<i className='ri-article-line' />}>
            {dictionary['navigation'].eInvoice}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-archive/add`} icon={<i className='ri-archive-2-line' />}>
            {dictionary['navigation'].eArchive}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-delivery-note/add`} icon={<i className='ri-truck-line' />}>
            {dictionary['navigation'].eDeliveryNote}
          </MenuItem>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].draft}>
          <MenuItem href={`/${locale}/apps/e-invoice/draft`} icon={<i className='ri-article-line' />}>
            {dictionary['navigation'].eInvoice}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-archive/draft`} icon={<i className='ri-archive-2-line' />}>
            {dictionary['navigation'].eArchive}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-delivery-note/draft`} icon={<i className='ri-truck-line' />}>
            {dictionary['navigation'].eDeliveryNote}
          </MenuItem>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].incoming}>
          <MenuItem href={`/${locale}/apps/e-invoice/incoming`} icon={<i className='ri-article-line' />}>
            {dictionary['navigation'].eInvoice}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-archive/incoming`} icon={<i className='ri-archive-2-line' />}>
            {dictionary['navigation'].eArchive}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-delivery-note/incoming`} icon={<i className='ri-truck-line' />}>
            {dictionary['navigation'].eDeliveryNote}
          </MenuItem>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].outgoing}>
          <MenuItem href={`/${locale}/apps/e-invoice/outgoing`} icon={<i className='ri-article-line' />}>
            {dictionary['navigation'].eInvoice}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-archive/outgoing`} icon={<i className='ri-archive-2-line' />}>
            {dictionary['navigation'].eArchive}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/e-delivery-note/outgoing`} icon={<i className='ri-truck-line' />}>
            {dictionary['navigation'].eDeliveryNote}
          </MenuItem>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].reports}>
          <MenuItem href={`/${locale}/reports/sales`} icon={<i className='ri-bar-chart-line' />}>
            {dictionary['navigation'].salesReport}
          </MenuItem>
          <MenuItem href={`/${locale}/reports/stock`} icon={<i className='ri-database-2-line' />}>
            {dictionary['navigation'].stockReport}
          </MenuItem>
        </MenuSection>

        <MenuSection label={dictionary['navigation'].settings}>
          <MenuItem href={`/${locale}/settings/profile`} icon={<i className='ri-user-settings-line' />}>
            {dictionary['navigation'].profileSettings}
          </MenuItem>
          <MenuItem href={`/${locale}/settings/system`} icon={<i className='ri-settings-3-line' />}>
            {dictionary['navigation'].systemSettings}
          </MenuItem>
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
