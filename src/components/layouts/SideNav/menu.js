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
  LuStore,
} from 'react-icons/lu';
export const menuItemsData = [ {
  key: 'Dashboards',
  label: 'Tableau de bord',
  icon: LuMonitorDot,
  href: '/admin/dashboard'
},{
  key: 'Vos Donnees',
  label: 'Vos Données',
  icon: LuStore,
  href: '/admin/entreprise'
},{
  key: 'Verre',
  label: 'Verre',
  icon: LuScanEye,
  href: '/admin/verre'
},{
  key: 'Monture',
  label: 'Monture',
  icon: LuGlasses,
  href: '/admin/monture'
}, {
  key: 'Couleur',
  label: 'Couleur',
  icon: LuPalette,
  href: '/admin/couleur'
},{
  key: 'Materiaux',
  label: 'Matériaux',
  icon: LuBlocks,
  href: '/admin/materiaux'
},{
  key: 'Forme',
  label: 'Forme',
  icon: LuShapes,
  href: '/admin/forme'
},{
  key: 'Marque',
  label: 'Marque',
  icon: LuFactory,
  href: '/admin/marque'
},{
  key: 'PromoCode',
  label: 'Codes Promo',
  icon: LuPercent,
  href: '/admin/promocode'
}, {
  key: 'Ecommerce',
  label: 'Ecommerce',
  icon: LuShoppingBag,
  children: [ {
    key: 'Products Grid',
    label: 'Produits (grille)',
    href: '/admin/product-grid'
  }, {
    key: 'Shopping Cart',
    label: 'Panier',
    href: '/admin/cart'
  }, {
    key: 'Orders',
    label: 'Commandes',
    href: '/admin/orders'
  }]
}, {
  key: 'Utilisateurs',
  label: 'Utilisateurs',
  icon: LuSquareUserRound,
  href: '/admin/users'
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
    href: '/admin/faqs'
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
}];
