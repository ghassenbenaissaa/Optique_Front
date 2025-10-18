import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import MontureList from './components/MontureList';
import MontureForm from './components/MontureForm';

const Index = () => {
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [montureToEdit, setMontureToEdit] = useState(null);

  const handleShowFormulaire = () => {
    setShowFormulaire(true);
    setMontureToEdit(null);
  };

  const handleShowModification = (monture) => {
    setMontureToEdit(monture);
    setShowFormulaire(true);
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false);
    setMontureToEdit(null);
  };

  const handleSuccess = () => {
    setShowFormulaire(false);
    setMontureToEdit(null);
  };

  return (
    <>
      <PageMeta title="Montures" />
      <main>
        <PageBreadcrumb title="Montures" />
        {showFormulaire ? (
          <div className="grid grid-cols-1 gap-5">
            <MontureForm
              monture={montureToEdit}
              onSuccess={handleSuccess}
              onCancel={handleCloseFormulaire}
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
