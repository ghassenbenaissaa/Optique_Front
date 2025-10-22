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
      <div className="h-screen w-full flex justify-center items-center">
        <div className="absolute inset-0">
          <div className="block dark:hidden h-full w-full relative">
            <img src={authBg} alt="Arrière-plan" className="object-cover" />
          </div>
          <div className="hidden dark:block h-full w-full relative">
            <img src={authBgDark} alt="Arrière-plan sombre" className="object-cover" width={111} />
          </div>
        </div>
        <div className="relative dark:bg-[url('../images/auth-bg-dark.jpg')]">
          <div className="bg-card/70 rounded-lg w-2/3 mx-auto">
            <div className="grid lg:grid-cols-12 grid-cols-1 items-center gap-0">
              <div className="lg:col-span-5">
                <div className="text-center px-10 py-12">
                  <h4 className="mb-3 text-xl font-semibold text-purple-500">Bon retour !</h4>
                  <p className="text-base text-default-500">Connectez-vous pour continuer sur Tailwick.</p>

                  <form onSubmit={handleSubmit} className="text-left w-full mt-10">
                    {error && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                        {error}
                      </div>
                    )}
                    <div className="mb-4">
                      <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                        Adresse e-mail
                      </label>
                      <input type="email" id="email" className="form-input" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                    </div>

                    <div className="mb-4">
                      <Link to="/boxed-reset-password" className="text-primary font-medium text-sm mb-2 float-end">
                        Mot de passe oublié ?
                      </Link>
                      <label htmlFor="password" className="block font-medium text-default-900 text-sm mb-2">
                        Mot de passe
                      </label>
                      <input type="password" id="password" className="form-input" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                    </div>

                    <div className="mt-10 text-center">
                      <button type="submit" className="btn bg-primary text-white w-full" disabled={loading}>
                        {loading ? 'Connexion…' : 'Se connecter'}
                      </button>
                    </div>
                    <div className="mt-10 text-center">
                      <p className="text-base text-default-500">
                        Vous n'avez pas de compte ?{' '}
                        <Link to="/boxed-register" className="font-semibold underline hover:text-primary transition duration-200">
                          S'inscrire
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7 bg-card/60 mx-2 my-2 shadow-[0_14px_15px_-3px_#f1f5f9,0_4px_6px_-4px_#f1f5f9] dark:shadow-none rounded-lg">
                <div className="pt-10 px-10 h-full">
                  <div className="mt-auto">
                    <img src={Boxed} alt="Illustration" />
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
