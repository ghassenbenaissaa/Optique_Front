import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import Tableau from './components/Tableau.jsx';

const Index = () => {
  return <>
    <PageMeta title="Newsletter" />
    <main>
      <PageBreadcrumb title="Newsletter" />
      <Tableau />
    </main>
  </>;
};

export default Index;

