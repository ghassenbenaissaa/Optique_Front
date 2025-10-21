import { LuAlignLeft } from 'react-icons/lu';
import { showBackdrop, toggleClassName } from '@/utils/layout';
import { useLayoutContext } from '@/context/useLayoutContext';

const SidenavToggle = () => {
  const { sidenav, updateSettings } = useLayoutContext();
  const { size } = sidenav;

  const toggleSidebar = () => {
    // 🔹 Alterner entre hidden et default uniquement
    const newSize = size === 'default' ? 'hidden' : 'default';

    updateSettings({
      sidenav: {
        ...sidenav,
        size: newSize
      }
    });

    // 🔹 Si on ouvre le menu, on peut afficher le backdrop (optionnel)
    if (newSize === 'default') {
      showBackdrop();
    }

    toggleClassName('sidenav-enable');
  };

  return (
    <button
      id="button-toggle-menu"
      className="btn btn-icon size-8 hover:bg-default-150 rounded"
      onClick={toggleSidebar}
    >
      <LuAlignLeft size={20} />
    </button>
  );
};

export default SidenavToggle;
