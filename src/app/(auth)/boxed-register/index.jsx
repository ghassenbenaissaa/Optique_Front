import authBgDark from '@/assets/images/auth-bg-dark.jpg';
import authBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import { Link, useNavigate } from 'react-router';
import PageMeta from '@/components/PageMeta';
import { useState } from 'react';
import { registerService } from './services/registerService';

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    numTel: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Fonctions de validation
  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
        if (!value.trim()) return 'Le prénom est obligatoire';
        if (value.length < 2 || value.length > 50) return 'Le prénom doit contenir entre 2 et 50 caractères';
        return '';

      case 'lastname':
        if (!value.trim()) return 'Le nom est obligatoire';
        if (value.length < 2 || value.length > 50) return 'Le nom doit contenir entre 2 et 50 caractères';
        return '';

      case 'email':
        if (!value.trim()) return 'L\'email est obligatoire';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Veuillez saisir un email valide';
        return '';

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
        if (value !== formData.password) return 'Les mots de passe ne correspondent pas';
        return '';

      case 'numTel':
        if (!value.trim()) return 'Le numéro de téléphone est obligatoire';
        const phoneRegex = /^[+]?[0-9]+$/;
        if (!phoneRegex.test(value)) return 'Le numéro doit contenir uniquement des chiffres ou le caractère +';
        return '';

      case 'address':
        if (!value.trim()) return 'L\'adresse est obligatoire';
        if (value.length < 5 || value.length > 255) return 'L\'adresse doit contenir entre 5 et 255 caractères';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validation en temps réel
    const errorMessage = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    // Validation spéciale pour confirmPassword quand password change
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setLoading(true);

    // Validation complète de tous les champs
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });

    // Validation spéciale pour confirmPassword
    const confirmError = validateField('confirmPassword', formData.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;

    // Si des erreurs existent, les afficher et arrêter
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Veuillez corriger les erreurs dans le formulaire');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        numTel: formData.numTel,
        address: formData.address
      };

      await registerService.register(payload);
      setUserEmail(formData.email);
      setShowConfirmation(true);
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err?.message || 'Erreur lors de l\'inscription';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return <>
      <PageMeta title="Inscription" />
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
            {/* Hauteur unifiée avec Login/Banned */}
            <div className="grid lg:grid-cols-12 grid-cols-1 min-h-[500px] lg:min-h-[600px]">
              <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 2xl:col-span-6">
                <div className="text-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                  {!showConfirmation ? (
                    <>
                      <h4 className="mb-3 text-xl sm:text-2xl font-semibold text-purple-500">Créer un compte</h4>
                      <p className="text-sm sm:text-base text-default-500">Rejoignez-nous dès aujourd'hui sur Tailwick.</p>

                      <form onSubmit={handleSubmit} className="text-left w-full mt-10">
                        {error && (
                          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                            {error}
                          </div>
                        )}

                        {/* ...existing form fields... */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="firstname" className="block font-medium text-default-900 text-sm mb-2">
                              Prénom
                            </label>
                            <input
                              type="text"
                              id="firstname"
                              name="firstname"
                              className={`form-input w-full ${fieldErrors.firstname ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Entrez votre prénom"
                              value={formData.firstname}
                              onChange={handleChange}
                              required
                              autoComplete="given-name"
                            />
                            {fieldErrors.firstname && (
                              <p className="text-red-500 text-xs mt-1">{fieldErrors.firstname}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="lastname" className="block font-medium text-default-900 text-sm mb-2">
                              Nom
                            </label>
                            <input
                              type="text"
                              id="lastname"
                              name="lastname"
                              className={`form-input w-full ${fieldErrors.lastname ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Entrez votre nom"
                              value={formData.lastname}
                              onChange={handleChange}
                              required
                              autoComplete="family-name"
                            />
                            {fieldErrors.lastname && (
                              <p className="text-red-500 text-xs mt-1">{fieldErrors.lastname}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                              Adresse e-mail
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className={`form-input w-full ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Entrez votre e-mail"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              autoComplete="email"
                            />
                            {fieldErrors.email && (
                              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="numTel" className="block font-medium text-default-900 text-sm mb-2">
                              Numéro de téléphone
                            </label>
                            <input
                              type="tel"
                              id="numTel"
                              name="numTel"
                              className={`form-input w-full ${fieldErrors.numTel ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Entrez votre numéro"
                              value={formData.numTel}
                              onChange={handleChange}
                              required
                              autoComplete="tel"
                            />
                            {fieldErrors.numTel && (
                              <p className="text-red-500 text-xs mt-1">{fieldErrors.numTel}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="address" className="block font-medium text-default-900 text-sm mb-2">
                            Adresse
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            className={`form-input w-full ${fieldErrors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="Entrez votre adresse complète"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            autoComplete="street-address"
                          />
                          {fieldErrors.address && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="password" className="block font-medium text-default-900 text-sm mb-2">
                            Mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              className={`form-input w-full pr-10 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Entrez votre mot de passe"
                              value={formData.password}
                              onChange={handleChange}
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

                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="block font-medium text-default-900 text-sm mb-2">
                            Confirmer le mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`form-input w-full pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                              placeholder="Confirmez votre mot de passe"
                              value={formData.confirmPassword}
                              onChange={handleChange}
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
                            {loading ? 'Inscription…' : 'S\'inscrire'}
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
                      </form>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>

                      <h4 className="mb-4 text-xl sm:text-2xl font-semibold text-purple-500">Vérifiez votre email</h4>

                      <div className="mb-6">
                        <p className="text-sm sm:text-base text-default-600 mb-3">
                          Un email de confirmation vous a été envoyé à :
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded border">
                          {userEmail}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-default-500 mb-8">
                        Veuillez vérifier votre boîte mail (y compris les spams) et cliquer sur le lien de confirmation pour activer votre compte.
                      </p>

                      <div className="space-y-4">
                        <button
                          onClick={handleGoToLogin}
                          className="btn bg-primary text-white w-full py-3 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-all duration-200"
                        >
                          Aller au login
                        </button>

                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="btn bg-gray-100 text-gray-700 w-full py-3 text-sm sm:text-base rounded-lg hover:bg-gray-200 transition-all duration-200"
                        >
                          Retour à l'inscription
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Colonne illustration masquée sur mobile (alignée à Login/Banned) */}
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
