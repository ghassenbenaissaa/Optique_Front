import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import Tableau from './components/Tableau.jsx';
import Formulaire from './components/Formulaire.jsx';
import FormulaireModification from './components/FormulaireModification.jsx';

const Index = () => {
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [formeToEdit, setFormeToEdit] = useState(null);

  const handleShowFormulaire = () => {
    setShowFormulaire(true);
    setShowModification(false);
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false);
  };

  const handleShowModification = (forme) => {
    setFormeToEdit(forme);
    setShowModification(true);
    setShowFormulaire(false);
  };

  const handleCloseModification = () => {
    setShowModification(false);
    setFormeToEdit(null);
  };

  const handleUpdateSuccess = () => {
    setShowModification(false);
    setFormeToEdit(null);
    // Le tableau se mettra à jour automatiquement grâce au rechargement
  };

  return <>
    <PageMeta title="Formes" />
    <main>
      <PageBreadcrumb title="Formes" />
      {showFormulaire ? (
        <div className="grid grid-cols-1 gap-5">
          <div className="flex justify-between items-center">
            <button
              onClick={handleCloseFormulaire}
              className="btn bg-default-100 text-default-600 hover:bg-default-200"
            >
              ← Retour à la liste
            </button>
          </div>
          <Formulaire onSuccess={handleCloseFormulaire} />
        </div>
      ) : showModification ? (
        <div className="grid grid-cols-1 gap-5">
          <div className="flex justify-between items-center">
            <button
              onClick={handleCloseModification}
              className="btn bg-default-100 text-default-600 hover:bg-default-200"
            >
              ← Retour à la liste
            </button>
          </div>
          <FormulaireModification
            forme={formeToEdit}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCloseModification}
          />
        </div>
      ) : (
        <Tableau
          onAddForme={handleShowFormulaire}
          onEditForme={handleShowModification}
        />
      )}
    </main>
  </>;
};

export default Index;
