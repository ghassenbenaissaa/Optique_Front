import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import { Link, useNavigate, useLocation } from 'react-router';
import PageMeta from '@/components/PageMeta';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserRole } from '@/services/authService';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);

      // Si l'utilisateur est banni, on le redirige vers la page dédiée
      const isBanned = data?.Banned === true || data?.banned === true;
      if (isBanned) {
        navigate('/banned', { replace: true });
        return;
      }

      if (!data?.token) throw new Error('Réponse de connexion invalide');
      const role = getUserRole(data?.token) || 'ROLE_CLIENT';

      // Récupérer la destination d'origine depuis state ou query
      const stateFrom = location.state?.from;
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirectTo');
      let target = null;
      if (stateFrom?.pathname) {
        target = `${stateFrom.pathname}${stateFrom.search || ''}${stateFrom.hash || ''}`;
      } else if (redirectTo) {
        try { target = decodeURIComponent(redirectTo); } catch { target = redirectTo; }
      }

      // Garde: éviter d'envoyer un client sur /admin/*
      if (role === 'ROLE_CLIENT') {
        if (target && target.startsWith('/admin')) {
          target = '/';
        }
        navigate(target || '/', { replace: true });
        return;
      }

      if (role === 'ROLE_ADMIN') {
        navigate(target || '/admin/dashboard', { replace: true });
        return;
      }

      // Rôle inconnu: fallback public
      navigate(target || '/', { replace: true });
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err?.message || 'Erreur de connexion';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageMeta title="Connexion" />
    {/* Fond pleine page unifié */}
    <div className="min-h-screen w-full flex justify-center items-center p-4">
      <div className="absolute inset-0">
        <div className="block dark:hidden h-full w-full relative">
          <img src={authBg} alt="Arrière-plan" className="object-cover w-full h-full" />
        </div>
        <div className="hidden dark:block h-full w-full relative">
          <img src={authBgDark} alt="Arrière-plan sombre" className="object-cover w-full h-full" />
        </div>
      </div>

      {/* Carte centrale unifiée */}
      <div className="relative w-full max-w-7xl">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg w-full mx-auto shadow-2xl">
          <div className="grid lg:grid-cols-12 grid-cols-1 min-h-[500px] lg:min-h-[600px]">
            {/* Colonne formulaire */}
            <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
              <div className="text-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Bon retour !</h4>
                <p className="text-sm sm:text-base text-default-500">Connectez-vous pour continuer sur Tailwick.</p>

                <form onSubmit={handleSubmit} className="text-left w-full mt-10">
                  {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                      {error}
                    </div>
                  )}
                  {error && error.includes('Account not activated') && (
                    <div className="mt-4 text-center">
                      <p className="text-xs sm:text-sm text-default-500">
                        Vous n’avez pas reçu d’email de confirmation ?{' '}
                        <Link to="/resend-verification" className="font-semibold underline hover:text-primary transition duration-200">
                          Cliquez ici
                        </Link>
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                      Adresse e-mail
                    </label>
                    <input type="email" id="email" className="form-input w-full" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block font-medium text-default-900 text-sm mb-2">
                      Mot de passe
                    </label>
                    <input type="password" id="password" className="form-input w-full" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                    <div className="mt-2 text-right">
                      <Link to="/auth/forgot-password" className="text-primary font-medium text-sm">
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 text-center">
                    <button type="submit" className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200" disabled={loading}>
                      {loading ? 'Connexion…' : 'Se connecter'}
                    </button>
                  </div>
                  <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-sm sm:text-base text-default-500">
                      Vous n'avez pas de compte ?{' '}
                      <Link to="/register" className="font-semibold underline hover:text-primary transition duration-200">
                        S'inscrire
                      </Link>
                    </p>
                  </div>
                </form>
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
  </>;
};
export default Index;
