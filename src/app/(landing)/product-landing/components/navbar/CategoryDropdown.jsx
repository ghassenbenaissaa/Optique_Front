// filepath: d:\GHASSEN\Projet Optique\OptiqueFront\src\app\(landing)\product-landing\components\navbar\CategoryDropdown.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilterContext } from '@/context/FilterContext';

/**
 * CategoryDropdown
 * Contenu du menu déroulant pour Lunettes de vue / Lunettes de soleil
 * - Grille élégante (4 colonnes) de catégories en français, sans emojis
 * - Fond opaque (non transparent) pour une meilleure lisibilité
 */
const CategoryDropdown = ({ variant = 'eyeglasses' }) => {
  const isSunglasses = variant === 'sunglasses';
  const navigate = useNavigate();
  const { setSelectedGenres, setSelectedTypeVerres, setSelectedTailles, setIsSurMesureSelected } = useFilterContext();

  const handleClick = (key) => (e) => {
    e.preventDefault();
    // Reset rapides des catégories pertinentes
    setSelectedGenres([]);
    setSelectedTailles([]);
    setIsSurMesureSelected(false);
    // Type de verre
    if (isSunglasses) {
      setSelectedTypeVerres(['type-soleil']);
    } else {
      setSelectedTypeVerres(['type-vue']);
    }
    // Genre
    if (key === 'men') {
      setSelectedGenres(['genre-homme']);
    } else if (key === 'women') {
      setSelectedGenres(['genre-femme']);
    } else if (key === 'kids') {
      // "enfant" s’ajoute en plus (on inclut juste enfant, laisser l’utilisateur cocher homme/femme ensuite si besoin)
      setSelectedGenres(['genre-enfant']);
    } else if (key === 'all') {
      // Tous: pas de genre, juste type de verre
      setSelectedGenres([]);
    }
    navigate('/product');
  };

  const items = isSunglasses
    ? [
        { key: 'men', label: 'Homme', href: '/product' },
        { key: 'women', label: 'Femme', href: '/product' },
        { key: 'kids', label: 'Enfant', href: '/product' },
        { key: 'all', label: 'Tous les solaires', href: '/product' },
      ]
    : [
        { key: 'men', label: 'Homme', href: '/product' },
        { key: 'women', label: 'Femme', href: '/product' },
        { key: 'kids', label: 'Enfant', href: '/product' },
        { key: 'all', label: 'Tous les optiques', href: '/product' },
      ];

  const imagesEyeglasses = {
    men: '/images/men.jpg',
    women: '/images/women.jpg',
    kids: '/images/kids.jpg',
    all: '/images/all.jpg',
  };

  const imagesSunglasses = {
    men: '/images/men.sg.jpg',
    women: '/images/women.sg.jpg',
    kids: '/images/kids.sg.jpg',
    all: '/images/all.jpg',
  };

  const imageMap = isSunglasses ? imagesSunglasses : imagesEyeglasses;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(92vw,56rem)]">
      <div className="rounded-xl border border-default-200/70 bg-card shadow-lg ring-1 ring-black/5 p-4 md:p-5">
        {/* Bandeau d'en-tête inspiré carrousel */}
        <div className="mb-4">
          <div className="font-semibold text-default-800">Sélection {isSunglasses ? 'solaire' : 'optique'}</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <a
              key={it.key}
              href={it.href}
              onClick={handleClick(it.key)}
              className="group rounded-xl overflow-hidden border border-default-200/70 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md bg-default-50 dark:bg-default-50/10"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-default-100 to-default-200 dark:from-default-50/10 dark:to-default-100/10">
                {imageMap[it.key] ? (
                  <img
                    src={imageMap[it.key]}
                    alt={it.label}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <div className="text-base md:text-[15px] font-semibold text-default-800 dark:text-default-100">{it.label}</div>
                <div className="mt-1 text-xs text-default-500">Découvrir la collection</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
