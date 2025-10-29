import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import { LuMenu, LuX, LuChevronDown } from 'react-icons/lu';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [openVue, setOpenVue] = useState(false);
  const [openSoleil, setOpenSoleil] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState(null);

  useEffect(() => {
    if (openBrands && brands.length === 0 && !brandsLoading) {
      (async () => {
        try {
          setBrandsLoading(true);
          const res = await api.get('/marque/getAll');
          const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
          setBrands(list.slice(0, 8));
        } catch (e) {
          setBrandsError('Impossible de charger les marques.');
        } finally {
          setBrandsLoading(false);
        }
      })();
    }
  }, [openBrands, brands.length, brandsLoading]);

  // Ferme sur escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Empêche le scroll du body quand ouvert
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
  }, [open]);

  return (
    <>
      <button
        className="flex justify-center items-center size-9 bg-primary/90 hover:bg-primary text-white rounded md:hidden"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="navbarMenu"
        onClick={() => setOpen(true)}
      >
        <LuMenu />
      </button>

      {/* Backdrop contrôlé */}
      {open && (
        <div
          className="fixed inset-0 z-[69] bg-black/0"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 inset-x-0 z-[70] transition-transform duration-300 h-screen w-screen overflow-y-auto p-5 bg-card border-b border-default-100 md:hidden ${open ? 'translate-y-0' : '-translate-y-full'}`}
        role="dialog"
        aria-labelledby="navbarMenu-label"
        id="navbarMenu"
      >
        <div className="flex items-center justify-between">
          <Link to="#">
            <img src={logoDark} alt="logo dark" className="h-6 block dark:hidden" width={111} />
            <img src={logoLight} alt="logo light" className="h-6 hidden dark:block" width={111} />
          </Link>

          <button aria-label="Fermer" onClick={() => setOpen(false)} className="inline-flex justify-end items-center gap-x-2 rounded-full">
            <LuX className="size-4" />
          </button>
        </div>

        <div className="pt-8">
          <ul className="flex flex-col gap-y-2 font-semibold text-sm">
            {/* Lunettes de vue */}
            <li>
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-start text-default-800 hover:text-primary"
                onClick={() => setOpenVue((v) => !v)}
                aria-expanded={openVue}
              >
                <span>Lunettes de vue</span>
                <LuChevronDown className={`transition-transform ${openVue ? 'rotate-180' : ''}`} />
              </button>
              {openVue && (
                <div className="ps-3 pb-2">
                  <ul className="grid grid-cols-2 gap-2 text-default-600 font-medium">
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Homme</a></li>
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Femme</a></li>
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Enfant</a></li>
                    <li className="col-span-2"><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Tous les optiques</a></li>
                  </ul>
                </div>
              )}
            </li>

            {/* Lunettes de soleil */}
            <li>
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-start text-default-800 hover:text-primary"
                onClick={() => setOpenSoleil((v) => !v)}
                aria-expanded={openSoleil}
              >
                <span>Lunettes de soleil</span>
                <LuChevronDown className={`transition-transform ${openSoleil ? 'rotate-180' : ''}`} />
              </button>
              {openSoleil && (
                <div className="ps-3 pb-2">
                  <ul className="grid grid-cols-2 gap-2 text-default-600 font-medium">
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Homme</a></li>
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Femme</a></li>
                    <li><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Enfant</a></li>
                    <li className="col-span-2"><a href="#product" className="block py-2 px-3 rounded-lg border border-default-200/70 hover:border-primary/50">Tous les solaires</a></li>
                  </ul>
                </div>
              )}
            </li>

            {/* Marques Premium */}
            <li>
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-start text-default-800 hover:text-primary"
                onClick={() => setOpenBrands((v) => !v)}
                aria-expanded={openBrands}
              >
                <span>Marques Premium</span>
                <LuChevronDown className={`transition-transform ${openBrands ? 'rotate-180' : ''}`} />
              </button>
              {openBrands && (
                <div className="ps-3 pb-3">
                  {brandsLoading ? (
                    <div className="text-default-500 text-sm">Chargement…</div>
                  ) : brandsError ? (
                    <div className="text-danger text-sm">{brandsError}</div>
                  ) : brands.length === 0 ? (
                    <div className="text-default-500 text-sm">Aucune marque disponible.</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {brands.map((b, idx) => {
                        const name = b.name || b.nom || 'Marque';
                        const key = `mobile-brand-${idx}-${name}`;
                        const img = b.imageUrl || b.image || b.logo || null;
                        return (
                          <a key={key} href="#product" className="flex items-center gap-3 rounded-lg border border-default-200/70 p-2 hover:border-primary/50">
                            {img ? (
                              <img src={img} alt={name} className="h-7 w-7 object-contain" />
                            ) : (
                              <span className="h-7 w-7 rounded bg-default-200/70 flex items-center justify-center text-default-600 text-xs">{name.charAt(0)}</span>
                            )}
                            <span className="text-default-700 text-sm">{name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </li>

            {/* Verres */}
            <li>
              <a href="#product" className="block py-3 text-default-800 hover:text-primary">Verres</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default MobileMenu;
