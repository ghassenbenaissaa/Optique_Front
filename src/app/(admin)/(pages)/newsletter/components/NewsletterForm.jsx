import { useState } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { newsletterService } from '../services/newsletterService';

const NewsletterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est obligatoire';
    } else if (formData.subject.length < 3) {
      newErrors.subject = 'Le sujet doit contenir au moins 3 caractères';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est obligatoire';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Le contenu doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const result = await newsletterService.sendNewsletter({
        subject: formData.subject,
        content: formData.content
      });

      setSuccessMessage(result.message || 'Newsletter envoyée avec succès à tous les abonnés confirmés.');
      setFormData({ subject: '', content: '' });

      // Appeler onSuccess après un délai pour laisser voir le message de succès
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      // Gestion des erreurs axios
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setErrors({
          general: error?.response?.data?.message || 'Erreur lors de l\'envoi de la newsletter.'
        });
      }
      console.error('Erreur lors de l\'envoi de la newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <IconifyIcon icon="mdi:email-send" className="text-3xl text-primary" />
          </div>
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Envoyer une Newsletter
          </h4>
          <p className="text-base text-default-500">
            Cette newsletter sera envoyée à tous les abonnés confirmés
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:check-circle" className="mr-2 text-xl" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:alert-circle" className="mr-2 text-xl" />
              <span className="font-medium">{errors.general}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left w-full space-y-4">
          <div>
            <label htmlFor="subject" className="block font-medium text-default-900 text-sm mb-2">
              Sujet de la newsletter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`form-input transition-all duration-200 ${
                errors.subject ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Ex: Nouvelles lunettes de la collection printemps"
              disabled={isLoading}
              required
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <IconifyIcon icon="mdi:alert-circle-outline" className="mr-1" />
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block font-medium text-default-900 text-sm mb-2">
              Contenu du message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="8"
              className={`form-input transition-all duration-200 ${
                errors.content ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Rédigez le contenu de votre newsletter ici..."
              disabled={isLoading}
              required
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <IconifyIcon icon="mdi:alert-circle-outline" className="mr-1" />
                {errors.content}
              </p>
            )}
            <p className="text-default-500 text-xs mt-1">
              {formData.content.length} caractères
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn bg-primary text-white hover:bg-primary-600 transition-all duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <IconifyIcon icon="mdi:loading" className="animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <IconifyIcon icon="mdi:send" className="mr-2" />
                  Envoyer la newsletter
                </>
              )}
            </button>

            {!isLoading && (
              <div className="text-sm text-default-500">
                <IconifyIcon icon="mdi:information-outline" className="inline mr-1" />
                Envoi à tous les abonnés confirmés
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterForm;

