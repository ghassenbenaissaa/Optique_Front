import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import Tableau from './components/Tableau.jsx';
import NewsletterForm from './components/NewsletterForm.jsx';

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSendSuccess = () => {
    setShowForm(false);
    // Le tableau se mettra à jour automatiquement si nécessaire
  };

  return <>
    <PageMeta title="Newsletter" />
    <main>
      <PageBreadcrumb title="Newsletter" />

      {showForm ? (
        <div className="grid grid-cols-1 gap-5">
          <div className="flex justify-between items-center">
            <button
              onClick={handleCloseForm}
              className="btn bg-default-100 text-default-600 hover:bg-default-200 transition-all duration-200"
            >
              ← Retour à la liste
            </button>
          </div>
          <NewsletterForm onSuccess={handleSendSuccess} />
        </div>
      ) : (
        <Tableau onShowForm={handleShowForm} />
      )}
    </main>
  </>;
};

export default Index;

