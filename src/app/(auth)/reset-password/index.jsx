import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import PageMeta from '@/components/PageMeta';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { useMemo, useState, useEffect } from 'react';
import api from '@/lib/axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Ajouts: champs et états de validation/affichage (alignés sur register)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  // Redirection après succès
  const [redirectIn, setRedirectIn] = useState(5);
  const [progress, setProgress] = useState(0);

  // Validation réutilisant les règles de register
  const validateField = (name, value) => {
    switch (name) {
      case 'password':
        if (!value) return 'Le mot de passe est obligatoire';
        if (value.length < 8 || value.length > 100) return 'Le mot de passe doit contenir entre 8 et 100 caractères';
        if (!/(?=.*[a-z])/.test(value)) return 'Le mot de passe doit contenir au moins une minuscule';
        if (!/(?=.*[A-Z])/.test(value)) return 'Le mot de passe doit contenir au moins une majuscule';
        if (!/(?=.*\d)/.test(value)) return 'Le mot de passe doit contenir au moins un chiffre';
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) return 'Le mot de passe doit contenir au moins un caractère spécial';
        return '';
      case 'confirmPassword':
        if (!value) return 'La confirmation du mot de passe est obligatoire';
        if (value !== newPassword) return 'Les mots de passe ne correspondent pas';
        return '';
      default:
        return '';
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    const pwdError = validateField('password', value);
    setFieldErrors((prev) => ({ ...prev, password: pwdError }));

    // Revalider la confirmation si déjà saisie
    if (confirmPassword) {
      const confirmErr = validateField('confirmPassword', confirmPassword);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const confirmErr = validateField('confirmPassword', value);
    setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
  };

  // Démarrer un compte à rebours et une barre de progression sur succès
  useEffect(() => {
    if (!success) return;
    const total = 5000; // 5 secondes
    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(pct);
      const secondsLeft = Math.max(0, Math.ceil((total - elapsed) / 1000));
      setRedirectIn(secondsLeft);
      if (elapsed >= total) {
        clearInterval(interval);
        navigate('/login', { replace: true });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Lien invalide ou token manquant.');
      return;
    }

    // Validation locale des mots de passe
    const errors = {};
    const pwdErr = validateField('password', newPassword);
    if (pwdErr) errors.password = pwdErr;
    const confirmErr = validateField('confirmPassword', confirmPassword);
    if (confirmErr) errors.confirmPassword = confirmErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess('Mot de passe réinitialisé avec succès.');
    } catch (err) {
      const backendMessage = err?.response?.data?.message || 'Une erreur est survenue.';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Réinitialiser le mot de passe" />
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
                  <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Réinitialiser le mot de passe</h4>
                  <p className="text-sm sm:text-base text-default-500">Choisissez un nouveau mot de passe pour votre compte.</p>

                  <form onSubmit={handleSubmit} className="text-left w-full mt-10">
                    {error && (
                      <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
                    )}
                    {success && (
                      <div className="mb-4">
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
                          {success}
                        </div>
                        {/* Barre de progression 5s + texte de redirection */}
                        <div className="mt-3">
                          <div className="w-full bg-green-100 border border-green-200 rounded h-2 overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-[width] duration-100"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-default-500 text-right">
                            Redirection vers la connexion dans {redirectIn}s…
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Nouveau mot de passe avec toggle œil */}
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block font-medium text-default-900 text-sm mb-2">Nouveau mot de passe</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="newPassword"
                          className={`form-input w-full pr-10 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="Entrez votre nouveau mot de passe"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-default-400 hover:text-default-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                      )}
                    </div>

                    {/* Confirmer le mot de passe avec toggle œil */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block font-medium text-default-900 text-sm mb-2">Confirmer le mot de passe</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          className={`form-input w-full pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="Confirmez votre mot de passe"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-default-400 hover:text-default-600 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                      <button type="submit" className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200" disabled={loading}>
                        {loading ? 'Réinitialisation…' : 'Réinitialiser'}
                      </button>
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                      <p className="text-sm sm:text-base text-default-500">
                        Retour à la {' '}
                        <Link to="/login" className="font-semibold underline hover:text-primary transition duration-200">connexion</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

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

export default ResetPasswordPage;
