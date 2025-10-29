import { useState } from 'react';
import api from '@/lib/axios';

const Cta = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsError(true);
      setMessage('Veuillez entrer un email valide.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 4000);
      return;
    }

    setLoading(true);
    setMessage('');
    setShowMessage(false);

    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setIsError(false);
      setMessage(res.data.message || 'Email d\'inscription envoyé.');
      setShowMessage(true);
      setEmail('');

      // Masquer le message après 5 secondes
      setTimeout(() => setShowMessage(false), 5000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Une erreur est survenue.';
      setIsError(true);
      setMessage(msg);
      setShowMessage(true);

      // Masquer le message après 5 secondes
      setTimeout(() => setShowMessage(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-purple-500/5 relative">
      <div className="container">
        {/* Message de retour (succès ou erreur) */}
        {showMessage && (
          <div
            className={`max-w-2xl mx-auto mb-6 p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-500 transform ${
              showMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            } ${
              isError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}
          >
            {isError ? (
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p
              className={`font-medium flex-1 ${
                isError
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-green-700 dark:text-green-300'
              }`}
            >
              {message}
            </p>
            <button
              onClick={() => setShowMessage(false)}
              className="text-default-400 hover:text-default-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Titre à gauche */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-default-900 dark:text-default-100 mb-2">
              Inscrivez-vous à notre newsletter
            </h2>
            <p className="text-sm text-default-600 dark:text-default-400">
              Recevez nos offres exclusives et nouveautés en avant-première
            </p>
          </div>

          {/* Formulaire à droite */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                disabled={loading}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border bg-white dark:bg-default-800 text-default-900 dark:text-default-100 focus:outline-none focus:ring-2 transition-all ${
                  isError && showMessage
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                    : 'border-default-300 dark:border-default-700 focus:ring-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Envoi...</span>
                </>
              ) : (
                <span>S'inscrire</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Cta;
