import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour détecter les clics en dehors d'un élément
 * @param {Function} handler - Fonction à exécuter lors du clic en dehors
 * @returns {Object} - Ref à attacher à l'élément
 */
export const useClickOutside = (handler) => {
  const ref = useRef();

  // 🔹 Mémoriser le handler pour éviter les re-renders
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        memoizedHandler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [memoizedHandler]);

  return ref;
};
