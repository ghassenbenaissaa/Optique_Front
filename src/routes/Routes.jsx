import { lazy } from 'react';
import ProtectedRoute from '@/components/security/ProtectedRoute';
import PageWrapper from '@/components/PageWrapper';

// admin Ecommerce
const Cart = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/cart'));
const Orders = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/orders'));

//admin use
const AdminDashboard = lazy(() => import('@/app/(admin)/(dashboards)/index'));
const Couleur = lazy(() => import('@/app/(admin)/(pages)/couleur'));
const PromoCode = lazy(() => import('@/app/(admin)/(pages)/promocode'));
const Materiaux = lazy(() => import('@/app/(admin)/(pages)/materiaux'));
const Forme = lazy(() => import('@/app/(admin)/(pages)/forme'));
const Marque = lazy(() => import('@/app/(admin)/(pages)/marque'));
const Verre = lazy(() => import('@/app/(admin)/(pages)/verre'));
const Monture = lazy(() => import('@/app/(admin)/(pages)/monture'));
const Entreprise = lazy(() => import('@/app/(admin)/(pages)/entreprise'));
const Newsletter = lazy(() => import('@/app/(admin)/(pages)/newsletter'));

// USers
const UserGrid = lazy(() => import('@/app/(admin)/(app)/(users)/users-grid'));
const UserList = lazy(() => import('@/app/(admin)/(app)/(users)/users-list'));

// layouts (admin demos)
const DarkMode = lazy(() => import('@/app/(admin)/(layouts)/dark-mode'));
const SideNavHidden = lazy(() => import('@/app/(admin)/(layouts)/sidenav-hidden'));
const SideOffcanvas = lazy(() => import('@/app/(admin)/(layouts)/sidenav-offcanvas'));

//Pages
const Faq = lazy(() => import('@/app/(admin)/(pages)/faqs'));

//auth
const BoxedLogin = lazy(() => import('@/app/(auth)/boxed-login'));
const BoxedRegister = lazy(() => import('@/app/(auth)/boxed-register'));
const BoxedBanned = lazy(() => import('@/app/(auth)/boxed-banned'));
const EmailConfirmation = lazy(() => import('@/app/(auth)/email-confirmation'));
const ResendVerification = lazy(() => import('@/app/(auth)/resend-verification'));
const ForgotPassword = lazy(() => import('@/app/(auth)/forgot-password'));
const ResetPassword = lazy(() => import('@/app/(auth)/reset-password'));

//  landing (public)
const ProductLanding = lazy(() => import('@/app/(landing)/product-landing'));
const ProductGrid = lazy(() => import('@/app/(landing)/product-grid'));
const GuideForm = lazy(() => import('@/app/(landing)/guide-form'));

//Other
const Error404 = lazy(() => import('@/app/(others)/404'));
const CommingSoon = lazy(() => import('@/app/(others)/coming-soon'));
const Maintenance = lazy(() => import('@/app/(others)/maintenance'));
const Offline = lazy(() => import('@/app/(others)/offline'));

export const layoutsRoutes = [{
  path: '/admin/dashboard',
  name: 'AdminDashboard',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <AdminDashboard />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin',
  name: 'AdminRoot',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <AdminDashboard />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/entreprise',
  name: 'Entreprise',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Entreprise />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/cart',
  name: 'Cart',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Cart />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/orders',
  name: 'Orders',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Orders />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/users-grid',
  name: 'UserGrid',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <UserGrid />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/users',
  name: 'UserList',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <UserList />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/dark-mode',
  name: 'DarkMode',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <DarkMode />
      </PageWrapper>
    </ProtectedRoute>
  )
},{
  path: '/admin/sidenav-hidden',
  name: 'SideNavHidden',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <SideNavHidden />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/sidenav-offcanvas',
  name: 'SideNavOffcanvas',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <SideOffcanvas />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/faqs',
  name: 'Faqs',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Faq />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/couleur',
  name: 'Couleur',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Couleur />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/promocode',
  name: 'Promo Code',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <PromoCode />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/materiaux',
  name: 'Matériaux',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Materiaux />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/forme',
  name: 'Forme',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Forme />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/marque',
  name: 'Marque',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Marque />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/verre',
  name: 'Verre',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Verre />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/monture',
  name: 'Monture',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Monture />
      </PageWrapper>
    </ProtectedRoute>
  )
}, {
  path: '/admin/newsletter',
  name: 'Newsletter',
  element: (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <PageWrapper>
        <Newsletter />
      </PageWrapper>
    </ProtectedRoute>
  )
}];

// Routes publiques (hors admin)
export const singlePageRoutes = [{
  // Page publique principale
  path: '/',
  name: 'ProductLanding',
  element: <ProductLanding />
}, {
  path: '/product',
  name: 'ProductGrid',
  element: <ProductGrid />
}, {
  path: '/guide-form',
  name: 'GuideForm',
  element: <GuideForm />
}, {
  path: '/login',
  name: 'LoginAlias',
  element: <BoxedLogin />
}, {
  path: '/register',
  name: 'Register',
  element: <BoxedRegister />
}, {
  path: '/banned',
  name: 'Banned',
  element: <BoxedBanned />
}, {
  path: '/emailConfirmation',
  name: 'EmailConfirmation',
  element: <EmailConfirmation />
}, {
  path: '/resend-verification',
  name: 'ResendVerification',
  element: <ResendVerification />
}, {
  path: '/auth/forgot-password',
  name: 'ForgotPassword',
  element: <ForgotPassword />
}, {
  path: '/auth/reset-password',
  name: 'ResetPassword',
  element: <ResetPassword />
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
