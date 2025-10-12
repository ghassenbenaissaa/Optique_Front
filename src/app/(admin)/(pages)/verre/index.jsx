import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import Tableau from './components/Tableau';
import Formulaire from './components/Formulaire';
import FormulaireModification from './components/FormulaireModification.jsx';

const Index = () => {
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [verreToEdit, setVerreToEdit] = useState(null);

  const handleShowFormulaire = () => {
    setShowFormulaire(true);
    setShowModification(false);
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false);
  };

  const handleShowModification = (verre) => {
    setVerreToEdit(verre);
    setShowModification(true);
    setShowFormulaire(false);
  };

  const handleCloseModification = () => {
    setShowModification(false);
    setVerreToEdit(null);
  };

  const handleUpdateSuccess = () => {
    setShowModification(false);
    setVerreToEdit(null);
    // Le tableau se mettra à jour automatiquement grâce au rechargement
  };

  return <>
    <PageMeta title="Verres" />
    <main>
      <PageBreadcrumb title="Verres" />
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
            verre={verreToEdit}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCloseModification}
          />
        </div>
      ) : (
        <Tableau
          onAddVerre={handleShowFormulaire}
          onEditVerre={handleShowModification}
        />
      )}
    </main>
  </>;
};

export default Index;
