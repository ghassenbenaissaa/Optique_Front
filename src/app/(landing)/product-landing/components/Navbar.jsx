import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import { LuLogIn, LuLogOut, LuShoppingBag } from 'react-icons/lu';
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header>
      <nav className="fixed inset-x-0 top-0 z-50 bg-card py-6 border-b border-default-150 flex justify-between items-center">
        <div className="container">
          <div className="grid lg:grid-cols-12 md:grid-cols-10 grid-cols-3 items-center">
            <div className="lg:col-span-2 md:col-span-2 col-span-1">
              <Link to="/">
                <img src={logoDark} alt="logo dark" className="h-6 block dark:hidden" width={111} />
                <img src={logoLight} alt="logo light" className="h-6 hidden dark:block" width={111} />
              </Link>
            </div>

            <div className="lg:col-span-8 md:col-span-6 md:block hidden">
              <ul className="flex items-center justify-center lg:gap-8 md:gap-6 font-medium text-sm">
                <li>
                  <a href="#home" className="text-default-800  hover:text-primary transition duration-300">
                    Home
                  </a>
                </li>

                <li>
                  <a href="#product" className="text-default-800  hover:text-primary transition duration-300">
                    Our Products
                  </a>
                </li>

                <li>
                  <a href="#Features" className="text-default-800  hover:text-primary transition duration-300">
                    Features
                  </a>
                </li>

                <li>
                  <a href="#About" className="text-default-800  hover:text-primary transition duration-300">
                    About Us
                  </a>
                </li>

                <li>
                  <a href="#Feedback" className="text-default-800  hover:text-primary transition duration-300">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2 md:col-span-2 col-span-2 flex items-center justify-end gap-4">
              <MobileMenu />
              <button type="button" aria-label="Panier">
                <LuShoppingBag className="size-4 text-default-500 hover:text-primary transition-all" />
              </button>

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
