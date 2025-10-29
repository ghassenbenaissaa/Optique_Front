import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import api from '@/lib/axios';
import PageMeta from '@/components/PageMeta';

const NewsletterConfirm = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmation manquant.');
        return;
      }

      try {
        const res = await api.get(`/newsletter/confirm?token=${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Votre inscription à la newsletter a été confirmée avec succès !');
      } catch (err) {
        setStatus('error');
        const errorMsg = err?.response?.data?.message || 'Une erreur est survenue lors de la confirmation.';
        setMessage(errorMsg);
      }
    };

    confirmSubscription();
  }, [token]);

  return (
    <>
      <PageMeta title="Confirmation Newsletter" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-purple-500/5 dark:from-default-900 dark:via-default-900 dark:to-default-900 px-4">
        <div className="max-w-md w-full">
          {/* Carte de confirmation */}
          <div className="bg-white dark:bg-default-800 rounded-2xl shadow-2xl border border-default-200 dark:border-default-700 overflow-hidden">
            <div className="p-8">
              {/* Loading State */}
              {status === 'loading' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <svg className="w-10 h-10 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-default-900 dark:text-default-100 mb-2">
                    Confirmation en cours...
                  </h1>
                  <p className="text-default-600 dark:text-default-400">
                    Veuillez patienter pendant que nous confirmons votre inscription.
                  </p>
                </div>
              )}

              {/* Success State */}
              {status === 'success' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-default-900 dark:text-default-100 mb-3">
                    Inscription confirmée !
                  </h1>
                  <p className="text-default-600 dark:text-default-400 mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                    >
                      Retour à l'accueil
                    </Link>
                    <p className="text-sm text-default-500 dark:text-default-400">
                      Vous recevrez bientôt nos dernières nouveautés et offres exclusives.
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === 'error' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                    <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-default-900 dark:text-default-100 mb-3">
                    Erreur de confirmation
                  </h1>
                  <p className="text-default-600 dark:text-default-400 mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                    >
                      Retour à l'accueil
                    </Link>
                    <p className="text-sm text-default-500 dark:text-default-400">
                      Le lien a peut-être expiré ou a déjà été utilisé.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de carte décoratif */}
            <div className="h-2 bg-gradient-to-r from-primary to-purple-600"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsletterConfirm;

