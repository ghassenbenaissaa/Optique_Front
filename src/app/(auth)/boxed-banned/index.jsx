import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import { Link, useNavigate } from 'react-router';
import PageMeta from '@/components/PageMeta';
import { useEffect } from 'react';
import { clearAuth } from '@/services/authService';

const BannedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyage immédiat des tokens côté client pour sécurité
    try {
      clearAuth();
    } catch {}

    // Notifier l'app (AuthContext) si elle écoute un event global
    try {
      const evt = new CustomEvent('auth:loggedOut');
      window.dispatchEvent(evt);
    } catch {}
  }, []);

  const handleBackToLogin = (e) => {
    e?.preventDefault?.();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageMeta title="Accès banni" />
      <div className="min-h-screen w-full flex justify-center items-center p-4">
        <div className="absolute inset-0">
          <div className="block dark:hidden h-full w-full relative">
            <img src={authBg} alt="Arrière-plan" className="object-cover w-full h-full" />
          </div>
          <div className="hidden dark:block h-full w-full relative">
            <img src={authBgDark} alt="Arrière-plan sombre" className="object-cover w-full h-full" />
          </div>
        </div>

        <div className="relative w-full max-w-7xl">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg w-full mx-auto shadow-2xl">
            <div className="grid lg:grid-cols-12 grid-cols-1 min-h-[500px] lg:min-h-[600px]">
              <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
                <div className="text-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                  <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Accès interdit</h4>
                  <p className="text-sm sm:text-base text-default-600 mb-6">
                    Votre compte a été banni et l'accès à l'application est désactivé.
                  </p>

                  <div className="text-left w-full mt-6">
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                      Pour des raisons de sécurité, votre session a été fermée et vos informations d'authentification ont été supprimées de cet appareil.
                    </div>

                    <div className="mb-6">
                      <p className="text-sm sm:text-base text-default-600">
                        Si vous pensez qu'il s'agit d'une erreur, contactez notre équipe de support à l'adresse suivante :
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded border inline-block mt-2">
                        contact@contact.com
                      </p>
                    </div>

                    <div className="mt-8 sm:mt-10 text-center">
                      <button onClick={handleBackToLogin} className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200">
                        Retour à la connexion
                      </button>
                    </div>
                    <div className="mt-6 sm:mt-8 text-center">
                      <p className="text-sm sm:text-base text-default-500">
                        Vous avez retrouvé l'accès ?{' '}
                        <Link to="/login" className="font-semibold underline hover:text-primary transition duration-200">
                          Se connecter
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne illustration, masquée sur mobile pour cohérence */}
              <div className="order-1 lg:order-2 hidden lg:block bg-card/60 mx-2 my-2 shadow-[0_14px_15px_-3px_#f1f5f9,0_4px_6px_-4px_#f1f5f9] dark:shadow-none rounded-lg lg:col-span-6 xl:col-span-6 2xl:col-span-6">
                <div className="pt-8 px-6 lg:px-8 h-full flex items-center justify-center">
                  <div className="w-full max-w-sm xl:max-w-md">
                    <img src={Boxed} alt="Illustration" className="w-full h-auto object-contain max-h-[420px] xl:max-h-[480px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannedPage;
