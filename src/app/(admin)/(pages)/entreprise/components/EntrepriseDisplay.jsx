import { useState, useEffect } from 'react';
import { entrepriseService } from '../services/entrepriseService';

const EntrepriseDisplay = ({ onEdit, onAdd }) => {
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntreprise();
  }, []);

  const fetchEntreprise = async () => {
    setLoading(true);
    try {
      const result = await entrepriseService.getEntreprise();
      if (result.success) {
        setEntreprise(result.data);
        setError(null);
      } else {
        // Si l'erreur est 404, cela signifie qu'aucune entreprise n'existe
        if (result.status === 404) {
          setEntreprise(null);
          setError(null);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="p-6">
          <div className="flex justify-center items-center py-8">
            <i className="mgc_loading_3_line animate-spin text-2xl text-primary me-3"></i>
            <span className="text-default-600">Chargement des informations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="p-6">
          <div className="text-center py-8">
            <i className="mgc_close_circle_line text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-default-900 mb-2">Erreur</h3>
            <p className="text-default-600 mb-4">{error}</p>
            <button
              onClick={fetchEntreprise}
              className="btn btn-primary"
            >
              <i className="mgc_refresh_1_line me-2"></i>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!entreprise) {
    return (
      <div className="card">
        <div className="p-6">
          <div className="text-center py-12">
            <i className="mgc_building_2_line text-6xl text-default-300 mb-6"></i>
            <h3 className="text-xl font-semibold text-default-900 mb-3">
              Aucune entreprise configurée
            </h3>
            <p className="text-default-600 mb-6 max-w-md mx-auto">
              Vous devez d'abord ajouter les informations de votre entreprise pour pouvoir utiliser toutes les fonctionnalités du système.
            </p>
            <button
              onClick={onAdd}
              className="btn btn-primary btn-lg"
            >
              <i className="mgc_add_line me-2"></i>
              Ajouter une entreprise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h4 className="card-title flex items-center">
            <i className="mgc_building_2_line me-2"></i>
            Informations de l'entreprise
          </h4>
          <button
            onClick={() => onEdit(entreprise)}
            className="btn btn-sm btn-primary"
          >
            <i className="mgc_edit_line me-1"></i>
            Modifier
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-default-500 mb-1">
              Nom de l'entreprise
            </label>
            <p className="text-default-900 font-semibold text-lg">{entreprise.nom}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-default-500 mb-1">
              Email
            </label>
            <p className="text-default-900">
              <a href={`mailto:${entreprise.email}`} className="text-primary hover:underline">
                {entreprise.email}
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-default-500 mb-1">
              Téléphone
            </label>
            <p className="text-default-900">
              <a href={`tel:${entreprise.telephone}`} className="text-primary hover:underline">
                {entreprise.telephone}
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-default-500 mb-1">
              Numéro fiscal
            </label>
            <p className="text-default-900 font-mono">{entreprise.numeroFiscal}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-default-500 mb-1">
              Adresse
            </label>
            <p className="text-default-900">{entreprise.adresse}</p>
          </div>
        </div>

        {/* Informations fiscales */}
        <div className="mt-8">
          <h5 className="text-lg font-semibold text-default-900 mb-4 flex items-center">
            <i className="mgc_receipt_line me-2"></i>
            Informations fiscales
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                TVA
              </label>
              <p className="text-blue-900 dark:text-blue-300 text-xl font-bold">{entreprise.tva}%</p>
            </div>
            <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-lg">
              <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                Timbre fiscal
              </label>
              <p className="text-green-900 dark:text-green-300 text-xl font-bold">{entreprise.timbreFiscale} DT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepriseDisplay;
