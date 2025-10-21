import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import EntrepriseDisplay from './components/EntrepriseDisplay';
import EntrepriseForm from './components/EntrepriseForm';
import { entrepriseService } from './services/entrepriseService';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [entrepriseToEdit, setEntrepriseToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleShowForm = () => {
    setShowForm(true);
    setEntrepriseToEdit(null);
  };

  const handleEditEntreprise = (entreprise) => {
    setEntrepriseToEdit(entreprise);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEntrepriseToEdit(null);
  };

  const handleFormSuccess = async (formData) => {
    try {
      let result;

      if (entrepriseToEdit) {
        // Mise à jour d'une entreprise existante
        result = await entrepriseService.updateEntreprise(formData);
      } else {
        // Ajout d'une nouvelle entreprise
        result = await entrepriseService.addEntreprise(formData);
      }

      if (result.success) {
        // Afficher un message de succès (vous pouvez utiliser une notification toast ici)
        console.log(result.message);

        // Fermer le formulaire
        setShowForm(false);
        setEntrepriseToEdit(null);

        // Rafraîchir l'affichage
        setRefreshKey(prev => prev + 1);
      } else {
        // Gérer l'erreur (vous pouvez afficher une notification d'erreur ici)
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Vous pouvez ici afficher une notification d'erreur à l'utilisateur
      alert(`Erreur: ${error.message}`);
      throw error; // Re-throw pour que le formulaire puisse gérer l'état de loading
    }
  };

  return (
    <>
      <PageMeta title="Entreprise" />
      <main>
        <PageBreadcrumb
          title="Gestion de l'entreprise"
          subtitle="Votre entreprise"
        />

        <div className="grid grid-cols-1 gap-6">
          {showForm ? (
            <div className="grid grid-cols-1 gap-5">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleCloseForm}
                  className="btn bg-default-100 text-default-600 hover:bg-default-200"
                >
                  ← Retour à la liste
                </button>
              </div>
              <EntrepriseForm
                entreprise={entrepriseToEdit}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
                isEditing={!!entrepriseToEdit}
              />
            </div>
          ) : (
            <EntrepriseDisplay
              key={refreshKey}
              onEdit={handleEditEntreprise}
              onAdd={handleShowForm}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Index;
