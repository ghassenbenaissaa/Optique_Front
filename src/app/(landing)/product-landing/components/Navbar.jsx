import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import { LuLogIn, LuLogOut, LuShoppingBag } from 'react-icons/lu';
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';
import { useEffect, useRef, useState } from 'react';
import CategoryDropdown from './navbar/CategoryDropdown';
import BrandsDropdown from './navbar/BrandsDropdown';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(null); // 'eyeglasses' | 'sunglasses' | 'brands' | null
  const timers = useRef({});
  const navRef = useRef(null);

  // Utilities pour hover-intent (éviter flicker)
  const scheduleOpen = (key) => {
    clearTimeout(timers.current.close);
    timers.current.open = setTimeout(() => setOpenMenu(key), 80);
  };
  const scheduleClose = () => {
    clearTimeout(timers.current.open);
    timers.current.close = setTimeout(() => setOpenMenu(null), 120);
  };

  // Expose la hauteur de nav dans une variable CSS --nav-height
  useEffect(() => {
    const setVar = () => {
      const h = navRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty('--nav-height', `${h}px`);
    };
    setVar();
    const ro = new ResizeObserver(() => setVar());
    if (navRef.current) ro.observe(navRef.current);
    window.addEventListener('resize', setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, []);

  useEffect(() => () => {
    clearTimeout(timers.current.open);
    clearTimeout(timers.current.close);
  }, []);

  return (
    <header className="relative">
      <nav
        ref={navRef}
        className="fixed inset-x-0 z-50 bg-card py-4 md:py-6 border-b border-default-150 flex justify-between items-center top-[var(--promo-offset,0px)] transition-[top] duration-300 will-change-[top]"
        style={{
          transitionProperty: 'top',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="container">
          <div className="grid lg:grid-cols-12 md:grid-cols-10 grid-cols-3 items-center">
            {/* Logo */}
            <div className="lg:col-span-2 md:col-span-2 col-span-1">
              <Link to="/">
                <img src={logoDark} alt="logo dark" className="h-6 block dark:hidden" width={111} />
                <img src={logoLight} alt="logo light" className="h-6 hidden dark:block" width={111} />
              </Link>
            </div>

            {/* Liens principaux */}
            <div className="lg:col-span-8 md:col-span-6 md:block hidden">
              <ul className="relative flex items-center justify-center lg:gap-8 md:gap-6 font-medium text-sm text-default-800">
                {/* Lunettes de vue */}
                <li
                  className="group relative"
                  onMouseEnter={() => scheduleOpen('eyeglasses')}
                  onMouseLeave={scheduleClose}
                >
                  <button className="px-2 py-1 rounded-md hover:text-primary transition-colors">Lunettes de vue</button>
                  {/* Dropdown */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ease-out ${
                      openMenu === 'eyeglasses' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                    onMouseEnter={() => scheduleOpen('eyeglasses')}
                    onMouseLeave={scheduleClose}
                  >
                    <CategoryDropdown variant="eyeglasses" />
                  </div>
                </li>

                {/* Lunettes de soleil */}
                <li
                  className="group relative"
                  onMouseEnter={() => scheduleOpen('sunglasses')}
                  onMouseLeave={scheduleClose}
                >
                  <button className="px-2 py-1 rounded-md hover:text-primary transition-colors">Lunettes de soleil</button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ease-out ${
                      openMenu === 'sunglasses' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                    onMouseEnter={() => scheduleOpen('sunglasses')}
                    onMouseLeave={scheduleClose}
                  >
                    <CategoryDropdown variant="sunglasses" />
                  </div>
                </li>

                {/* Marques Premium */}
                <li
                  className="group relative"
                  onMouseEnter={() => scheduleOpen('brands')}
                  onMouseLeave={scheduleClose}
                >
                  <button className="px-2 py-1 rounded-md hover:text-primary transition-colors">Marques Premium</button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ease-out ${
                      openMenu === 'brands' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                    onMouseEnter={() => scheduleOpen('brands')}
                    onMouseLeave={scheduleClose}
                  >
                    <BrandsDropdown />
                  </div>
                </li>

                {/* Verres */}

              </ul>
            </div>

            {/* Actions droites */}
            <div className="lg:col-span-2 md:col-span-2 col-span-2 flex items-center justify-end gap-4">
              <MobileMenu />

              {/* Icône panier améliorée - masqué en mobile */}
              <Link to="#cart" aria-label="Panier" className="relative hidden md:inline-flex group">
                <span className="sr-only">Ouvrir le panier</span>
                <span className="inline-flex items-center justify-center rounded-full bg-default-100 dark:bg-default-50/10 border border-default-200/70 shadow-sm group-hover:shadow transition-all h-10 w-10">
                  <LuShoppingBag className="h-[20px] w-[20px] text-default-700 dark:text-default-200 group-hover:text-primary transition-colors" />
                </span>
              </Link>

              {!isAuthenticated ? (
                <Link to="/login" className="flex justify-end">
                  <button className="btn border-0 bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white">
                    Se connecter
                    <LuLogIn className="size-4" />
                  </button>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="btn border-0 bg-gradient-to-r from-danger to-red-500 hover:from-red-500 hover:to-danger text-white"
                >
                  Se déconnecter
                  <LuLogOut className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
