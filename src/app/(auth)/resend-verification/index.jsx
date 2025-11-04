import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import { useNavigate } from 'react-router';
import PageMeta from '@/components/PageMeta';
import { useState } from 'react';
import api from '@/lib/axios';

const ResendVerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMessage('');
    setError('');
    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/resend-verification', { email });
      setMessage(res?.data?.message || 'Email de vérification renvoyé.');
    } catch (err) {
      const rawMessage = err.response?.data?.message || err.message || 'Une erreur est survenue.';
      const cleanMessage = rawMessage.replace(/^\d{3} [A-Z_]+ "/, '').replace(/"$/, '');
      setError(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (e) => {
    e?.preventDefault?.();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageMeta title="Renvoyer l'email de confirmation" />
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
              {/* Colonne contenu */}
              <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
                <div className="text-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                  <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Renvoyer l'email de confirmation</h4>
                  <p className="text-sm sm:text-base text-default-600 mb-6">
                    Saisissez votre adresse e-mail ci-dessous pour recevoir à nouveau le lien de vérification.
                  </p>

                  <form onSubmit={handleSubmit} className="text-left w-full mt-6">
                    {error && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                        {error}
                      </div>
                    )}
                    {message && (
                      <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
                        {message}
                      </div>
                    )}

                    <div className="mb-4">
                      <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-input w-full"
                        placeholder="Entrez votre e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                      <button type="submit" className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200" disabled={loading}>
                        {loading ? 'Envoi…' : 'Renvoyer l\'email'}
                      </button>
                    </div>
                    <div className="mt-6 sm:mt-8 text-center">
                      <p className="text-sm sm:text-base text-default-500">
                        Retour à la{' '}
                        <button onClick={handleBackToLogin} className="font-semibold underline hover:text-primary transition duration-200">
                          connexion
                        </button>
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
    </>
  );
};

export default ResendVerificationPage;
