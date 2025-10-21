import { lazy } from 'react';

// admin Ecommerce

const Cart = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/cart'));
const Orders = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/orders'));
const ProductGrid = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/product-grid'));

//Ghassen Add
const Couleur = lazy(() => import('@/app/(admin)/(pages)/couleur'));
const PromoCode = lazy(() => import('@/app/(admin)/(pages)/promocode'));
const Matériaux = lazy(() => import('@/app/(admin)/(pages)/materiaux'));
const Forme = lazy(() => import('@/app/(admin)/(pages)/forme'));
const Marque = lazy(() => import('@/app/(admin)/(pages)/marque'));
const Verre = lazy(() => import('@/app/(admin)/(pages)/verre'));
const Monture = lazy(() => import('@/app/(admin)/(pages)/monture'));
const Entreprise = lazy(() => import('@/app/(admin)/(pages)/entreprise'));
// USers
const UserGrid = lazy(() => import('@/app/(admin)/(app)/(users)/users-grid'));
const UserList = lazy(() => import('@/app/(admin)/(app)/(users)/users-list'));

// dashboard
const Ecommerce = lazy(() => import('@/app/(admin)/(dashboards)/index'));

// layouts
const DarkMode = lazy(() => import('@/app/(admin)/(layouts)/dark-mode'));
const SideNavHidden = lazy(() => import('@/app/(admin)/(layouts)/sidenav-hidden'));
const SideOffcanvas = lazy(() => import('@/app/(admin)/(layouts)/sidenav-offcanvas'));

//Pages

const Faq = lazy(() => import('@/app/(admin)/(pages)/faqs'));

//auth
const BoxedCreatePassword = lazy(() => import('@/app/(auth)/boxed-create-password'));
const BoxedLogin = lazy(() => import('@/app/(auth)/boxed-login'));
const BoxedRegister = lazy(() => import('@/app/(auth)/boxed-register'));
const BoxedResetPassword = lazy(() => import('@/app/(auth)/boxed-reset-password'));
const BoxedLogout = lazy(() => import('@/app/(auth)/boxed-logout'));
const BoxedTwoStep = lazy(() => import('@/app/(auth)/boxed-two-steps'));

//  landing

const OnePageLanding = lazy(() => import('@/app/(landing)/onepage-landing'));
const ProductLanding = lazy(() => import('@/app/(landing)/product-landing'));

//Other

const Error404 = lazy(() => import('@/app/(others)/404'));
const CommingSoon = lazy(() => import('@/app/(others)/coming-soon'));
const Maintenance = lazy(() => import('@/app/(others)/maintenance'));
const Offline = lazy(() => import('@/app/(others)/offline'));
export const layoutsRoutes = [{
  path: '/',
  name: 'Ecommerce',
  element: <Ecommerce />
}, {
  path: '/index',
  name: 'Ecommerce',
  element: <Ecommerce />
}, {
  path: '/entreprise',
  name: 'Entreprise',
  element: <Entreprise />
}, {
  path: '/cart',
  name: 'Cart',
  element: <Cart />
}, {
  path: '/orders',
  name: 'Orders',
  element: <Orders />
}, {
  path: '/product-grid',
  name: 'ProductGrid',
  element: <ProductGrid />
}, {
  path: '/users-grid',
  name: 'UserGrid',
  element: <UserGrid />
}, {
  path: '/users-list',
  name: 'UserList',
  element: <UserList />
}, {
  path: '/',
  name: 'Ecommerce',
  element: <Ecommerce />
}, {
  path: '/dark-mode',
  name: 'DarkMode',
  element: <DarkMode />
},{
  path: '/sidenav-hidden',
  name: 'SideNavHidden',
  element: <SideNavHidden />
}, {
  path: '/sidenav-offcanvas',
  name: 'SideNavOffcanvas',
  element: <SideOffcanvas />
}, {
  path: '/faqs',
  name: 'Faqs',
  element: <Faq />
}, {
  path: '/couleur',
  name: 'Couleur',
  element: <Couleur />
}, {
  path: '/promocode',
  name: 'Promo Code',
  element: <PromoCode />
}, {
  path: '/promocode',
  name: 'Promo Code',
  element: <PromoCode />
}, {
  path: '/materiaux',
  name: 'Matériaux',
  element: <Matériaux />
}, {
  path: '/forme',
  name: 'Forme',
  element: <Forme />
}, {
  path: '/marque',
  name: 'Marque',
  element: <Marque />
}, {
  path: '/verre',
  name: 'Verre',
  element: <Verre />
}, {
  path: '/monture',
  name: 'Monture',
  element: <Monture />
}];
export const singlePageRoutes = [{
  path: '/boxed-login',
  name: 'BoxedLogin',
  element: <BoxedLogin />
}, {
  path: '/boxed-register',
  name: 'BoxedRegister',
  element: <BoxedRegister />
}, {
  path: '/boxed-create-password',
  name: 'BoxedCreatePassword',
  element: <BoxedCreatePassword />
}, {
  path: '/boxed-reset-password',
  name: 'BoxedResetPassword',
  element: <BoxedResetPassword />
}, {
  path: '/boxed-logout',
  name: 'BoxedLogout',
  element: <BoxedLogout />
}, {
  path: '/boxed-two-steps',
  name: 'BoxedTwoStep',
  element: <BoxedTwoStep />
}, {
  path: '/onepage-landing',
  name: 'OnePageLanding',
  element: <OnePageLanding />
}, {
  path: '/product-landing',
  name: 'ProductLanding',
  element: <ProductLanding />
}, {
  path: '/404',
  name: '404',
  element: <Error404 />
}, {
  path: '/coming-soon',
  name: 'ComingSoon',
  element: <CommingSoon />
}, {
  path: '/maintenance',
  name: 'Maintenance',
  element: <Maintenance />
}, {
  path: '/offline',
  name: 'Offline',
  element: <Offline />
}];
