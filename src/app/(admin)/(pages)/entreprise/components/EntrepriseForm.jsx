import { useState, useEffect } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { validateEntreprise } from '../types';

const EntrepriseForm = ({ entreprise, onSuccess, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: 0,
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    numeroFiscal: '',
    timbreFiscale: 0,
    tva: 0
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (entreprise) {
      setFormData(entreprise);
    }
  }, [entreprise]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
    const validation = validateEntreprise(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await onSuccess(formData);
      setSuccessMessage(isEditing ? 'Entreprise mise à jour avec succès !' : 'Entreprise ajoutée avec succès !');

      // Appeler onCancel après un délai pour laisser voir le message de succès
      if (onCancel) {
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setErrors({ general: error.message || 'Une erreur est survenue lors de la sauvegarde.' });
      }
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            {isEditing ? 'Modifier les informations de l\'entreprise' : 'Ajouter une nouvelle entreprise'}
          </h4>
          <p className="text-base text-default-500">Remplissez les informations ci-dessous</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:check-circle" className="mr-2" />
              {successMessage}
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:alert-circle" className="mr-2" />
              {errors.general}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom de l'entreprise */}
            <div>
              <label htmlFor="nom" className="block font-medium text-default-900 text-sm mb-2">
                Nom de l'entreprise <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`form-input ${errors.nom ? 'border-red-500' : ''}`}
                placeholder="Nom de l'entreprise"
                disabled={isLoading}
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="contact@entreprise.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="block font-medium text-default-900 text-sm mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className={`form-input ${errors.telephone ? 'border-red-500' : ''}`}
                placeholder="+216 XX XXX XXX"
                disabled={isLoading}
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
              )}
            </div>

            {/* Numéro fiscal */}
            <div>
              <label htmlFor="numeroFiscal" className="block font-medium text-default-900 text-sm mb-2">
                Numéro fiscal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numeroFiscal"
                name="numeroFiscal"
                value={formData.numeroFiscal}
                onChange={handleInputChange}
                className={`form-input ${errors.numeroFiscal ? 'border-red-500' : ''}`}
                placeholder="1234567X"
                disabled={isLoading}
              />
              {errors.numeroFiscal && (
                <p className="text-red-500 text-sm mt-1">{errors.numeroFiscal}</p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="mt-4">
            <label htmlFor="adresse" className="block font-medium text-default-900 text-sm mb-2">
              Adresse <span className="text-red-500">*</span>
            </label>
            <textarea
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              rows={3}
              className={`form-input ${errors.adresse ? 'border-red-500' : ''}`}
              placeholder="Adresse complète de l'entreprise"
              disabled={isLoading}
            />
            {errors.adresse && (
              <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* TVA */}
            <div>
              <label htmlFor="tva" className="block font-medium text-default-900 text-sm mb-2">
                TVA (%)
              </label>
              <input
                type="number"
                id="tva"
                name="tva"
                value={formData.tva}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className={`form-input ${errors.tva ? 'border-red-500' : ''}`}
                placeholder="19.00"
                disabled={isLoading}
              />
              {errors.tva && (
                <p className="text-red-500 text-sm mt-1">{errors.tva}</p>
              )}
            </div>

            {/* Timbre fiscal */}
            <div>
              <label htmlFor="timbreFiscale" className="block font-medium text-default-900 text-sm mb-2">
                Timbre fiscal (DT)
              </label>
              <input
                type="number"
                id="timbreFiscale"
                name="timbreFiscale"
                value={formData.timbreFiscale}
                onChange={handleInputChange}
                min="0"
                step="0.001"
                className={`form-input ${errors.timbreFiscale ? 'border-red-500' : ''}`}
                placeholder="0.600"
                disabled={isLoading}
              />
              {errors.timbreFiscale && (
                <p className="text-red-500 text-sm mt-1">{errors.timbreFiscale}</p>
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn bg-primary text-white w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon="mdi:loading" className="animate-spin mr-2" />
                  {isEditing ? 'Mise à jour en cours...' : 'Ajout en cours...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon={isEditing ? "mdi:pencil" : "mdi:plus"} className="mr-2" />
                  {isEditing ? 'Mettre à jour l\'entreprise' : 'Ajouter l\'entreprise'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntrepriseForm;
