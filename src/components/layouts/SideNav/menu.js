import {
  LuBlocks,
  LuCalendar1,
  LuCircuitBoard,
  LuClipboardList,
  LuCodesandbox,
  LuFactory,
  LuFileText,
  LuFingerprint,
  LuFrame,
  LuGlasses,
  LuLayers,
  LuLayoutPanelLeft,
  LuLigature,
  LuLoaderCircle,
  LuLock,
  LuMail,
  LuMessagesSquare,
  LuMonitorDot,
  LuPackage,
  LuPalette,
  LuPercent,
  LuPictureInPicture2,
  LuScanEye,
  LuShapes,
  LuShare2,
  LuShieldCheck,
  LuShoppingBag,
  LuSquareUserRound,
} from 'react-icons/lu';
export const menuItemsData = [ {
  key: 'Dashboards',
  label: 'Dashboards',
  icon: LuMonitorDot,
  href: '/index'
},{
  key: 'Verre',
  label: 'Verre',
  icon: LuScanEye,
  href: '/verre'
},{
  key: 'Monture',
  label: 'Monture',
  icon: LuGlasses,
  href: '/monture'
}, {
  key: 'Couleur',
  label: 'Couleur',
  icon: LuPalette,
  href: '/couleur'
},{
  key: 'PromoCode',
  label: 'Promo Code',
  icon: LuPercent,
  href: '/promocode'
},{
  key: 'Matériaux',
  label: 'Matériaux',
  icon: LuBlocks,
  href: '/materiaux'
},{
  key: 'Forme',
  label: 'Forme',
  icon: LuShapes,
  href: '/forme'
},{
  key: 'Marque',
  label: 'Marque',
  icon: LuFactory,
  href: '/marque'
}, {
  key: 'Ecommerce',
  label: 'Ecommerce',
  icon: LuShoppingBag,
  children: [ {
    key: 'Products Grid',
    label: 'Products Grid',
    href: '/product-grid'
  }, {
    key: 'Shopping Cart',
    label: 'Shopping Cart',
    href: '/cart'
  }, {
    key: 'Orders',
    label: 'Orders',
    href: '/orders'
  }]
}, {
  key: 'Users',
  label: 'Users',
  icon: LuSquareUserRound,
  children: [{
    key: 'List View',
    label: 'List View',
    href: '/users-list'
  }, {
    key: 'Grid View',
    label: 'Grid View',
    href: '/users-grid'
  }]
}, {
  key: 'Extra',
  label: 'Extra',
  isTitle: true
}, {
  key: 'Pages',
  label: 'Pages',
  icon: LuCodesandbox,
  children: [ {
    key: 'FAQ',
    label: 'FAQ',
    href: '/faqs'
  }, {
    key: 'Maintenance',
    label: 'Maintenance',
    href: '/maintenance'
  }, {
    key: 'Coming Soon',
    label: 'Coming Soon',
    href: '/coming-soon'
  }, {
    key: '404',
    label: '404',
    href: '/404'
  }, {
    key: 'Offline',
    label: 'Offline',
    href: '/offline'
  }]
}, {
  key: 'Boxed Auth',
  label: 'Boxed Auth',
  icon: LuPackage,
  children: [{
    key: 'Login',
    label: 'Login',
    href: '/boxed-login'
  }, {
    key: 'Register',
    label: 'Register',
    href: '/boxed-register'
  }, {
    key: 'Verify Email',
    label: 'Verify Email',
    href: '/boxed-verify-email'
  }, {
    key: 'Two Steps',
    label: 'Two Steps',
    href: '/boxed-two-steps'
  }, {
    key: 'Logout',
    label: 'Logout',
    href: '/boxed-logout'
  }, {
    key: 'Reset Password',
    label: 'Reset Password',
    href: '/boxed-reset-password'
  }, {
    key: 'Create Password',
    label: 'Create Password',
    href: '/boxed-create-password'
  }]
},{
  key: 'Landing Page',
  label: 'Landing Page',
  icon: LuPictureInPicture2,
  children: [{
    key: 'One Page',
    label: 'One Page',
    href: '/onepage-landing',
    target: '_blank'
  }, {
    key: 'Product',
    label: 'Product',
    href: '/product-landing',
    target: '_blank'
  }]
}];
