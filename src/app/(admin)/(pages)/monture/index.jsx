import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import MontureList from './components/Tableau';
import Formulaire from './components/Formulaire';
import FormulaireModification from './components/FormulaireModification';

const Index = () => {
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [montureToEdit, setMontureToEdit] = useState(null);

  const handleShowFormulaire = () => {
    setShowFormulaire(true);
    setShowModification(false);
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false);
  };

  const handleShowModification = (monture) => {
    setMontureToEdit(monture);
    setShowModification(true);
    setShowFormulaire(false);
  };

  const handleCloseModification = () => {
    setShowModification(false);
    setMontureToEdit(null);
  };

  const handleUpdateSuccess = () => {
    setShowModification(false);
    setMontureToEdit(null);
    // Le tableau se mettra à jour automatiquement grâce au rechargement
  };

  return (
    <>
      <PageMeta title="Montures" />
      <main>
        <PageBreadcrumb title="Montures" />
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
              monture={montureToEdit}
              onSuccess={handleUpdateSuccess}
              onCancel={handleCloseModification}
            />
          </div>
        ) : (
          <MontureList
            onAddMonture={handleShowFormulaire}
            onEditMonture={handleShowModification}
          />
        )}
      </main>
    </>
  );
};

export default Index;
