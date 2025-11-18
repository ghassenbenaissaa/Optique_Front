// filepath: d:\GHASSEN\Projet Optique\OptiqueFront\src\app\(landing)\product-landing\components\navbar\BrandsDropdown.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useFilterContext } from '@/context/FilterContext';

/**
 * BrandsDropdown
 * - Récupère les marques via GET /marque/getAll
 * - Centre le contenu et adapte la grille dynamiquement selon le nombre
 * - Fond opaque (bg-card)
 */
const BrandsDropdown = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setSelectedMarques, clearAll } = useFilterContext();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/marque/getAll');
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        if (active) setBrands(list);
      } catch (e) {
        if (active) setError('Impossible de charger les marques.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const computed = useMemo(() => {
    const items = brands.slice(0, 8).map((b, idx) => ({
      id: b.id,
      uniqueKey: `brand-${idx}-${b.nom || b.name || 'marque'}`,
      name: b.nom || b.name || 'Marque',
      img: b.imageUrl || b.image || b.logo || null,
    }));
    const count = items.length;
    // Choisir des colonnes en fonction du nombre pour centrer
    let cols = 4;
    if (count <= 2) cols = 2;
    else if (count === 3) cols = 3;
    else if (count === 5) cols = 5;
    else if (count === 6) cols = 3; // 3x2 centré
    else if (count === 7) cols = 4; // 4x2 avec un vide visuel équilibré
    return { items, cols };
  }, [brands]);

  const handlePickBrand = (name) => (e) => {
    e.preventDefault();
    // Réinitialiser tous les filtres puis appliquer uniquement la marque choisie
    clearAll();
    setSelectedMarques([name]);
    navigate('/product');
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(92vw,56rem)]">
      <div className="rounded-xl border border-default-200/70 bg-card shadow-lg ring-1 ring-black/5 p-4 md:p-5">
        <div className="mb-3">
          <div className="font-semibold text-default-800">Marques Premium</div>
        </div>
        {loading ? (
          <div className="text-sm text-default-500">Chargement…</div>
        ) : error ? (
          <div className="text-sm text-danger">{error}</div>
        ) : computed.items.length === 0 ? (
          <div className="text-sm text-default-500">Aucune marque disponible.</div>
        ) : (
          <div className={`grid gap-4 justify-items-center ${computed.cols === 5 ? 'grid-cols-5' : computed.cols === 3 ? 'grid-cols-3' : 'grid-cols-4'} sm:${computed.cols === 5 ? 'grid-cols-5' : computed.cols === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {computed.items.map((b) => (
              <a
                key={b.uniqueKey}
                href="/product"
                onClick={handlePickBrand(b.name)}
                className="group w-full max-w-[140px] rounded-lg border border-default-200/70 hover:border-primary/50 bg-default-50 dark:bg-default-50/10 p-3 flex flex-col items-center text-center transition-colors shadow-sm hover:shadow-md"
              >
                {b.img ? (
                  <img src={b.img} alt={b.name} className="h-12 object-contain mb-2 opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="h-12 w-12 rounded bg-default-200/70 flex items-center justify-center text-default-600 mb-2 text-sm">
                    {b.name.charAt(0)}
                  </div>
                )}
                <div className="text-xs sm:text-sm text-default-700 dark:text-default-200 truncate w-full">{b.name}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsDropdown;
