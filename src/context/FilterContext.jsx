import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';

// Contexte pour centraliser les sélections de filtres et générer les tags dynamiques
const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  // Sélections catégorielles
  const [selectedTypeVerres, setSelectedTypeVerres] = useState([]); // ids
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTailles, setSelectedTailles] = useState([]);
  const [isSurMesureSelected, setIsSurMesureSelected] = useState(false);
  const [selectedFormes, setSelectedFormes] = useState([]); // names
  const [selectedColors, setSelectedColors] = useState([]); // names
  const [selectedMateriaux, setSelectedMateriaux] = useState([]); // names
  const [selectedMontures, setSelectedMontures] = useState([]); // ids

  // Bornes initiales (définies après appel API dans ProductFilter)
  const [initialBounds, setInitialBounds] = useState({
    minPrix: null,
    maxPrix: null,
  });

  // Valeurs de prix courantes
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  // Fonction pour initialiser les bornes une seule fois (ou les mettre à jour)
  const initBounds = useCallback((bounds) => {
    setInitialBounds((prev) => ({ ...prev, ...bounds }));
    if (bounds.minPrix != null && bounds.maxPrix != null) {
      setPriceRange({ min: bounds.minPrix, max: bounds.maxPrix });
    }
  }, []);

  // Helpers de toggle génériques
  const toggleValue = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const removeValue = (setter) => (value) => {
    setter((prev) => prev.filter((v) => v !== value));
  };

  // Generation des tags à afficher
  const tags = useMemo(() => {
    const list = [];
    const pushTag = (category, value, keyOverride) => {
      if (value == null || value === '') return;
      list.push({ category, value, key: keyOverride || `${category}:${value}` });
    };

    selectedTypeVerres.forEach((v) => pushTag('Type de verre', v));
    selectedGenres.forEach((v) => pushTag('Genre', v));
    selectedTailles.forEach((v) => pushTag('Taille', v));
    selectedFormes.forEach((v) => pushTag('Forme', v));
    selectedColors.forEach((v) => pushTag('Couleur', v));
    selectedMateriaux.forEach((v) => pushTag('Matériau', v));
    selectedMontures.forEach((v) => pushTag('Type de monture', v));

    // Tag prix si modifié
    if (initialBounds.minPrix != null && initialBounds.maxPrix != null && priceRange.min != null && priceRange.max != null) {
      const changed = priceRange.min !== initialBounds.minPrix || priceRange.max !== initialBounds.maxPrix;
      if (changed) {
        pushTag('Prix', `${priceRange.min} - ${priceRange.max} DT`, 'prix-range');
      }
    }

    return list;
  }, [selectedTypeVerres, selectedGenres, selectedTailles, selectedFormes, selectedColors, selectedMateriaux, selectedMontures, initialBounds, priceRange]);

  // Suppression d’un tag par sa clé
  const removeTag = useCallback((key) => {
    if (key === 'prix-range') {
      // reset price
      if (initialBounds.minPrix != null && initialBounds.maxPrix != null) {
        setPriceRange({ min: initialBounds.minPrix, max: initialBounds.maxPrix });
      }
      return;
    }
    const [category, value] = key.split(':');
    switch (category) {
      case 'Type de verre':
        removeValue(setSelectedTypeVerres)(value);
        break;
      case 'Genre':
        removeValue(setSelectedGenres)(value);
        break;
      case 'Taille':
        removeValue(setSelectedTailles)(value);
        if (value === 'taille-sur-mesure') setIsSurMesureSelected(false);
        break;
      case 'Forme':
        removeValue(setSelectedFormes)(value);
        break;
      case 'Couleur':
        removeValue(setSelectedColors)(value);
        break;
      case 'Matériau':
        removeValue(setSelectedMateriaux)(value);
        break;
      case 'Type de monture':
        removeValue(setSelectedMontures)(value);
        break;
      default:
        break;
    }
  }, [initialBounds]);

  const clearAll = useCallback(() => {
    setSelectedTypeVerres([]);
    setSelectedGenres([]);
    setSelectedTailles([]);
    setIsSurMesureSelected(false);
    setSelectedFormes([]);
    setSelectedColors([]);
    setSelectedMateriaux([]);
    setSelectedMontures([]);
    if (initialBounds.minPrix != null && initialBounds.maxPrix != null) {
      setPriceRange({ min: initialBounds.minPrix, max: initialBounds.maxPrix });
    }
  }, [initialBounds]);

  const value = {
    // états
    selectedTypeVerres,
    selectedGenres,
    selectedTailles,
    isSurMesureSelected,
    selectedFormes,
    selectedColors,
    selectedMateriaux,
    selectedMontures,
    priceRange,
    initialBounds,
    // setters / toggles
    setSelectedTypeVerres,
    setSelectedGenres,
    setSelectedTailles,
    setIsSurMesureSelected,
    setSelectedFormes,
    setSelectedColors,
    setSelectedMateriaux,
    setSelectedMontures,
    setPriceRange,
    initBounds,
    toggleTypeVerre: toggleValue(setSelectedTypeVerres),
    toggleGenre: toggleValue(setSelectedGenres),
    toggleTaille: (val) => {
      toggleValue(setSelectedTailles)(val);
      if (val === 'taille-sur-mesure') {
        setIsSurMesureSelected((prev) => !prev);
      }
    },
    toggleForme: toggleValue(setSelectedFormes),
    toggleCouleur: toggleValue(setSelectedColors),
    toggleMateriau: toggleValue(setSelectedMateriaux),
    toggleMonture: toggleValue(setSelectedMontures),
    // tags
    tags,
    removeTag,
    clearAll,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
};

