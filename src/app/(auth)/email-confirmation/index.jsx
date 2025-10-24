import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import { Link, useNavigate, useLocation } from 'react-router';
import PageMeta from '@/components/PageMeta';
import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';

// Cache module-scopé pour éviter les doubles appels en dev (StrictMode)
const confirmationCache = new Map(); // token -> 'success' | 'error'
const inFlightConfirmations = new Map(); // token -> Promise<'success'|'error'>

const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState('pending'); // 'pending' | 'success' | 'error'
  const queryToken = useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search || '');
      return sp.get('token') || '';
    } catch {
      return '';
    }
  }, [location.search]);

  useEffect(() => {
    let isActive = true;

    async function confirm() {
      if (!queryToken) {
        if (isActive) setStatus('error');
        return;
      }

      // 1) Si déjà traité, restaurer l'état sans rappeler l'API
      if (confirmationCache.has(queryToken)) {
        if (isActive) setStatus(confirmationCache.get(queryToken));
        return;
      }

      // 2) Si une requête est déjà en cours pour ce token, attendre son résultat
      if (inFlightConfirmations.has(queryToken)) {
        if (isActive) setStatus('pending');
        try {
          const result = await inFlightConfirmations.get(queryToken);
          if (isActive) setStatus(result);
        } catch {
          if (isActive) setStatus('error');
        }
        return;
      }

      // 3) Lancer la requête et l'enregistrer comme in-flight
      const encoded = encodeURIComponent(queryToken);
      const p = (async () => {
        try {
          await api.get(`/auth/verify?token=${encoded}`);
          return 'success';
        } catch {
          return 'error';
        }
      })();
      inFlightConfirmations.set(queryToken, p);
      if (isActive) setStatus('pending');
      const result = await p;
      confirmationCache.set(queryToken, result);
      inFlightConfirmations.delete(queryToken);
      if (isActive) setStatus(result);
    }

    confirm();
    return () => {
      isActive = false;
    };
  }, [queryToken]);

  const handleBackToLogin = (e) => {
    e?.preventDefault?.();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageMeta title="Confirmation de l'email" />
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
              {/* Colonne contenu (égale à l'illustration sur desktop) */}
              <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
                <div className="text-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                  <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Confirmation de l'email</h4>

                  {status === 'pending' && (
                    <>
                      <p className="text-sm sm:text-base text-default-600 mb-6">Validation en cours…</p>
                      <div className="flex justify-center mt-4">
                        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </div>
                    </>
                  )}

                  {status === 'success' && (
                    <>
                      <p className="text-sm sm:text-base text-default-600 mb-6">Votre email a été confirmé avec succès !</p>
                      <div className="text-left w-full mt-6">
                        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
                          Vous pouvez maintenant vous connecter avec vos identifiants.
                        </div>
                        <div className="mt-8 sm:mt-10 text-center">
                          <button onClick={handleBackToLogin} className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200">
                            Retour au login
                          </button>
                        </div>
                        <div className="mt-6 sm:mt-8 text-center">
                          <p className="text-sm sm:text-base text-default-500">
                            Revenir à la page de{' '}
                            <Link to="/login" className="font-semibold underline hover:text-primary transition duration-200">
                              connexion
                            </Link>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {status === 'error' && (
                    <>
                      <p className="text-sm sm:text-base text-default-600 mb-6">Le lien de confirmation est invalide ou expiré.</p>
                      <div className="text-left w-full mt-6">
                        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                          Veuillez demander un nouvel email de confirmation depuis la page d'inscription.
                        </div>
                        {status === 'error' && (
                          <div className="px-6 sm:px-8 lg:px-10 pb-8 -mt-4">
                            <p className="text-xs sm:text-sm text-default-500 text-center">
                              Vous n’avez pas reçu d’email de confirmation ?{' '}
                              <Link to="/resend-verification" className="font-semibold underline hover:text-primary transition duration-200">
                                Cliquez ici
                              </Link>
                            </p>
                          </div>
                        )}
                        <div className="mt-8 sm:mt-10 text-center">
                          <button onClick={handleBackToLogin} className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200">
                            Retour au login
                          </button>
                        </div>
                        <div className="mt-6 sm:mt-8 text-center">
                          <p className="text-sm sm:text-base text-default-500">
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login" className="font-semibold underline hover:text-primary transition duration-200">
                              Se connecter
                            </Link>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
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

export default EmailConfirmationPage;
