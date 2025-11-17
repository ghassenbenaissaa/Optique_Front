import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import filtreService from '../services/filtreService';
import { DEFAULT_FILTER_VALUES } from '../types/filtre';
import { useNavigate } from 'react-router-dom';

const DoubleSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value1,
  value2,
  onChange,
  formatValue = (v) => `${v}`,
  ariaLabelFrom = 'Valeur minimale',
  ariaLabelTo = 'Valeur maximale',
  compact = false,
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const clamp = useCallback((v) => Math.min(max, Math.max(min, v)), [min, max]);
  const snap = useCallback(
    (v) => {
      const s = step > 0 ? step : 1;
      return Math.round(v / s) * s;
    },
    [step]
  );

  const valueToPercent = useCallback(
    (v) => ((v - min) / (max - min)) * 100,
    [min, max]
  );

  const clientXToValue = useCallback(
    (clientX) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return min;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      return clamp(snap(raw));
    },
    [clamp, max, min, snap]
  );

  const handleTrackClick = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const newVal = clientXToValue(clientX);
    const d1 = Math.abs(newVal - value1);
    const d2 = Math.abs(newVal - value2);
    if (d1 <= d2) onChange?.(newVal, value2);
    else onChange?.(value1, newVal);
  };

  // Gestion du drag
  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newVal = clientXToValue(clientX);
      if (dragging === 'from') {
        onChange?.(newVal, value2);
      } else if (dragging === 'to') {
        onChange?.(value1, newVal);
      }
    };

    const end = () => setDragging(null);

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', end);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', end);
    };
  }, [dragging, clientXToValue, onChange, value1, value2]);

  const handleKey = (which) => (e) => {
    let delta = 0;
    if (e.key === 'ArrowLeft') delta = -step;
    if (e.key === 'ArrowRight') delta = step;
    if (e.key === 'PageDown') delta = -step * 10;
    if (e.key === 'PageUp') delta = step * 10;
    if (e.key === 'Home') {
      if (which === 'from') onChange?.(min, value2);
      else onChange?.(value1, min);
      e.preventDefault();
      return;
    }
    if (e.key === 'End') {
      if (which === 'from') onChange?.(max, value2);
      else onChange?.(value1, max);
      e.preventDefault();
      return;
    }
    if (delta !== 0) {
      if (which === 'from') onChange?.(clamp(snap(value1 + delta)), value2);
      else onChange?.(value1, clamp(snap(value2 + delta)));
      e.preventDefault();
    }
  };

  const p1 = valueToPercent(value1);
  const p2 = valueToPercent(value2);
  const left = Math.min(p1, p2);
  const right = Math.max(p1, p2);

  return (
    <div className={`${compact ? 'space-y-1 py-1' : 'space-y-4 py-2 px-2'}`}>
      <div className={`relative w-full ${compact ? 'h-6' : 'h-10'} select-none`}>
        {/* Track interne */}
        <div
          ref={trackRef}
          className={`absolute left-2 right-2 top-1/2 -translate-y-1/2 ${compact ? 'h-1' : 'h-1.5'} cursor-pointer`}
          onMouseDown={handleTrackClick}
          onTouchStart={handleTrackClick}
        >
          <div className="absolute inset-0 bg-default-200 dark:bg-default-700 rounded-full" />
          <div
            className="absolute top-0 bottom-0 rounded-full shadow-sm bg-gradient-to-r from-primary via-purple-600 to-primary"
            style={{
              left: `${left}%`,
              width: `${right - left}%`,
              pointerEvents: 'none'
            }}
          />
          <button
            type="button"
            aria-label={ariaLabelFrom}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value1}
            onMouseDown={(e) => { e.stopPropagation(); setDragging('from'); }}
            onTouchStart={(e) => { e.stopPropagation(); setDragging('from'); }}
            onKeyDown={handleKey('from')}
            className={`group absolute ${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none hover:scale-110`}
            style={{
              left: `${p1}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: dragging === 'from' ? 30 : 20,
              transition: dragging === 'from' ? 'none' : 'transform 150ms ease-out',
              backgroundColor: '#3b82f6',
              border: '3px solid white',
              boxShadow: dragging === 'from' ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : '0 0 0 2px rgba(59, 130, 246, 0.2)'
            }}
          />
          <button
            type="button"
            aria-label={ariaLabelTo}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value2}
            onMouseDown={(e) => { e.stopPropagation(); setDragging('to'); }}
            onTouchStart={(e) => { e.stopPropagation(); setDragging('to'); }}
            onKeyDown={handleKey('to')}
            className={`group absolute ${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none hover:scale-110`}
            style={{
              left: `${p2}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: dragging === 'to' ? 30 : 20,
              transition: dragging === 'to' ? 'none' : 'transform 150ms ease-out',
              backgroundColor: '#3b82f6',
              border: '3px solid white',
              boxShadow: dragging === 'to' ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : '0 0 0 2px rgba(59, 130, 246, 0.2)'
            }}
          />
        </div>
      </div>
      {!compact && (
        <div className="flex items-center justify-between text-sm font-medium text-default-700 dark:text-default-300">
          <span className="from_display">{formatValue(Math.min(value1, value2))}</span>
          <span className="to_display">{formatValue(Math.max(value1, value2))}</span>
        </div>
      )}
    </div>
  );
};

const filterConfig = [{
  id: 'type-verre',
  title: 'Type de verre',
  options: [{ id: 'type-vue', label: 'Lunettes de vue' }, { id: 'type-soleil', label: 'Lunettes de soleil' }, { id: 'type-ia', label: 'Lunettes IA' }]
}, {
  id: 'genre',
  title: 'Genre',
  options: [{ id: 'genre-homme', label: 'Homme' }, { id: 'genre-femme', label: 'Femme' }, { id: 'genre-unisex', label: 'Unisexe' }, { id: 'genre-enfant', label: 'Enfant' }]
}, {
  id: 'taille',
  title: 'Taille',
  options: [{ id: 'taille-extra-petit', label: 'Extra Petit' }, { id: 'taille-petit', label: 'Petit' }, { id: 'taille-moyen', label: 'Moyen' }, { id: 'taille-grand', label: 'Grand' }, { id: 'taille-extra-grand', label: 'Extra Grand' }, { id: 'taille-sur-mesure', label: 'Sur mesure', isCustomSize: true }]
}, {
  id: 'forme',
  title: 'Forme',
  isDynamicForme: true,
  options: [] // dynamique
}, {
  id: 'couleur',
  title: 'Couleur',
  isDynamic: true,
  options: []
}, {
  id: 'materiau-dynamique',
  title: 'Matériau',
  isDynamicMateriau: true,
  options: [] // dynamique
}, {
  id: 'type-monture',
  title: 'Type de monture',
  options: [{ id: 'monture-cerclee', label: 'Cerclée' }, { id: 'monture-demi-cerclee', label: 'Demi-cerclée' }, { id: 'monture-sans', label: 'Sans monture' }]
}, {
  id: 'prix-avance',
  title: 'Prix',
  isSlider: true,
  fieldMin: 'minPrix',
  fieldMax: 'maxPrix',
  unit: 'DT',
  step: 1,
}];

const dimensionSliders = [{
  id: 'largeur-totale-avance',
  title: 'Largeur totale',
  isSlider: true,
  fieldMin: 'minLargeurTotale',
  fieldMax: 'maxLargeurTotale',
  unit: 'mm',
  step: 1,
}, {
  id: 'largeur-verre-avance',
  title: 'Largeur verre',
  isSlider: true,
  fieldMin: 'minLargeurVerre',
  fieldMax: 'maxLargeurVerre',
  unit: 'mm',
  step: 1,
}, {
  id: 'hauteur-verre-avance',
  title: 'Hauteur verre',
  isSlider: true,
  fieldMin: 'minHauteurVerre',
  fieldMax: 'maxHauteurVerre',
  unit: 'mm',
  step: 1,
}, {
  id: 'largeur-pont-avance',
  title: 'Largeur pont',
  isSlider: true,
  fieldMin: 'minLargeurPont',
  fieldMax: 'maxLargeurPont',
  unit: 'mm',
  step: 1,
}, {
  id: 'longueur-branche-avance',
  title: 'Longueur branche',
  isSlider: true,
  fieldMin: 'minLongueurBranche',
  fieldMax: 'maxLongueurBranche',
  unit: 'mm',
  step: 1,
}];

const ProductFilter = () => {
  const [filterValues, setFilterValues] = useState(null);
  const [filterLoading, setFilterLoading] = useState(true);

  const navigate = useNavigate();

  const [isSurMesureSelected, setIsSurMesureSelected] = useState(false);

  // État pour les couleurs dynamiques
  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [priceMin, setPriceMin] = useState(DEFAULT_FILTER_VALUES.minPrix);
  const [priceMax, setPriceMax] = useState(DEFAULT_FILTER_VALUES.maxPrix);
  const [largeurTotaleMin, setLargeurTotaleMin] = useState(DEFAULT_FILTER_VALUES.minLargeurTotale);
  const [largeurTotaleMax, setLargeurTotaleMax] = useState(DEFAULT_FILTER_VALUES.maxLargeurTotale);
  const [largeurVerreMin, setLargeurVerreMin] = useState(DEFAULT_FILTER_VALUES.minLargeurVerre);
  const [largeurVerreMax, setLargeurVerreMax] = useState(DEFAULT_FILTER_VALUES.maxLargeurVerre);
  const [hauteurVerreMin, setHauteurVerreMin] = useState(DEFAULT_FILTER_VALUES.minHauteurVerre);
  const [hauteurVerreMax, setHauteurVerreMax] = useState(DEFAULT_FILTER_VALUES.maxHauteurVerre);
  const [largeurPontMin, setLargeurPontMin] = useState(DEFAULT_FILTER_VALUES.minLargeurPont);
  const [largeurPontMax, setLargeurPontMax] = useState(DEFAULT_FILTER_VALUES.maxLargeurPont);
  const [longueurBrancheMin, setLongueurBrancheMin] = useState(DEFAULT_FILTER_VALUES.minLongueurBranche);
  const [longueurBrancheMax, setLongueurBrancheMax] = useState(DEFAULT_FILTER_VALUES.maxLongueurBranche);

  const [formes, setFormes] = useState([]);
  const [selectedFormes, setSelectedFormes] = useState([]);
  const [materiaux, setMateriaux] = useState([]);
  const [selectedMateriaux, setSelectedMateriaux] = useState([]);
  // Nouvel état: tailles sélectionnées pour appliquer le même design que Matériau
  const [selectedTailles, setSelectedTailles] = useState([]);
  // Nouvel état: genres sélectionnés pour appliquer le même design que Matériau
  const [selectedGenres, setSelectedGenres] = useState([]);
  // Nouvel état: types de verre sélectionnés (même design carte + checkbox)
  const [selectedTypeVerres, setSelectedTypeVerres] = useState([]);
  // Nouvel état: types de monture sélectionnés (même design que Forme)
  const [selectedMontures, setSelectedMontures] = useState([]);

  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        setFilterLoading(true);

        // Charger les filtres min/max
        const data = await filtreService.getFilter();

        const requiredFields = [
          'minPrix','maxPrix',
          'minLargeurTotale','maxLargeurTotale',
          'minLargeurVerre','maxLargeurVerre',
          'minHauteurVerre','maxHauteurVerre',
          'minLargeurPont','maxLargeurPont',
          'minLongueurBranche','maxLongueurBranche'
        ];
        const hasNull = requiredFields.some((f) => data[f] == null);
        if (hasNull) {
          setFilterLoading(false);
          navigate('/404', { replace: true });
          return;
        }

        setFilterValues(data);

        setPriceMin(data.minPrix);
        setPriceMax(data.maxPrix);
        setLargeurTotaleMin(data.minLargeurTotale);
        setLargeurTotaleMax(data.maxLargeurTotale);
        setLargeurVerreMin(data.minLargeurVerre);
        setLargeurVerreMax(data.maxLargeurVerre);
        setHauteurVerreMin(data.minHauteurVerre);
        setHauteurVerreMax(data.maxHauteurVerre);
        setLargeurPontMin(data.minLargeurPont);
        setLargeurPontMax(data.maxLargeurPont);
        setLongueurBrancheMin(data.minLongueurBranche);
        setLongueurBrancheMax(data.maxLongueurBranche);

        // Charger les couleurs disponibles
        try {
          const colorsData = await filtreService.getAllColors();
          // Filtrer uniquement les couleurs disponibles
          const availableColors = colorsData.filter(c => c.available);
          setColors(availableColors);
        } catch (colorError) {
          console.error('Erreur lors du chargement des couleurs:', colorError);
          // Ne pas bloquer l'affichage si les couleurs échouent
          setColors([]);
        }

        // Charger les formes
        try {
          const formesData = await filtreService.getAllFormes();
          const availableFormes = (formesData || []).filter(f => f.isAvailable && f.name && f.imageUrl);
          setFormes(availableFormes);
        } catch (formeError) {
          console.error('Erreur lors du chargement des formes:', formeError);
          setFormes([]);
        }

        // Charger les matériaux
        try {
          const materiauxData = await filtreService.getMateriaux();
          const availableMateriaux = (materiauxData || []).filter(m => (m.isAvailable ?? m.available) && m.name);
          setMateriaux(availableMateriaux);
        } catch (materiauError) {
          console.error('Erreur lors du chargement des matériaux:', materiauError);
          setMateriaux([]);
        }

      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);

        setFilterValues(DEFAULT_FILTER_VALUES);
        setPriceMin(DEFAULT_FILTER_VALUES.minPrix);
        setPriceMax(DEFAULT_FILTER_VALUES.maxPrix);
        setLargeurTotaleMin(DEFAULT_FILTER_VALUES.minLargeurTotale);
        setLargeurTotaleMax(DEFAULT_FILTER_VALUES.maxLargeurTotale);
        setLargeurVerreMin(DEFAULT_FILTER_VALUES.minLargeurVerre);
        setLargeurVerreMax(DEFAULT_FILTER_VALUES.maxLargeurVerre);
        setHauteurVerreMin(DEFAULT_FILTER_VALUES.minHauteurVerre);
        setHauteurVerreMax(DEFAULT_FILTER_VALUES.maxHauteurVerre);
        setLargeurPontMin(DEFAULT_FILTER_VALUES.minLargeurPont);
        setLargeurPontMax(DEFAULT_FILTER_VALUES.maxLargeurPont);
        setLongueurBrancheMin(DEFAULT_FILTER_VALUES.minLongueurBranche);
        setLongueurBrancheMax(DEFAULT_FILTER_VALUES.maxLongueurBranche);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilterValues();
  }, [navigate]);

  const formatUnit = (unit, v) => unit === 'DT' ? `${v} DT` : `${v} ${unit}`;

  // Gestion de la sélection des couleurs
  const handleColorToggle = (colorName) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const isColorSelected = (colorName) => selectedColors.includes(colorName);

  // Gestion de la sélection des formes
  const handleToggleForme = (name) => {
    setSelectedFormes(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);
  };

  const isFormeSelected = (name) => selectedFormes.includes(name);

  const handleToggleMateriau = (name) => {
    setSelectedMateriaux(prev => prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]);
  };

  const isMateriauSelected = (name) => selectedMateriaux.includes(name);

  // Helper pour générer un id unique pour les formes (sans utiliser l'id API qui peut être null)
  const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$|/g, '').replace(/-+/g,'-');

  // Gestion monture
  const handleToggleMonture = (id) => {
    setSelectedMontures((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };
  const isMontureSelected = (id) => selectedMontures.includes(id);

  const MontureIcon = ({ type }) => {
    const common = {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    };
    if (type === 'monture-cerclee') {
      return (
        <svg viewBox="0 0 48 24" className="w-11 h-11" aria-hidden="true" focusable="false">
          <g {...common}>
            <circle cx="12" cy="12" r="7" />
            <circle cx="36" cy="12" r="7" />
            <path d="M19 12h10" />
            <path d="M3 12h3M42 12h3" />
          </g>
        </svg>
      );
    }
    if (type === 'monture-demi-cerclee') {
      return (
        <svg viewBox="0 0 48 24" className="w-11 h-11" aria-hidden="true" focusable="false">
          <g {...common}>
            <path d="M5 12a7 7 0 0 1 14 0" />
            <path d="M29 12a7 7 0 0 1 14 0" />
            <path d="M19 12h10" />
            <path d="M3 12h3M42 12h3" />
          </g>
        </svg>
      );
    }
    // sans monture
    return (
      <svg viewBox="0 0 48 24" className="w-11 h-11" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M10 12h6" />
          <path d="M32 12h6" />
          <path d="M19 12h10" />
          <path d="M8 12h1M39 12h1" />
        </g>
      </svg>
    );
  };

  return <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card border border-default-200 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="card-body">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between gap-3"
        >
          <h6 className="card-title text-lg font-bold text-default-900 dark:text-default-100">
            Filtres
          </h6>
          {filterLoading && (
            <div className="flex items-center gap-2 text-xs text-default-500">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          )}
        </motion.div>

        {filterLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-6"
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="space-y-3">
                <div className="h-5 bg-default-200 dark:bg-default-700 rounded-lg w-32 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg w-5/6 animate-pulse"></div>
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg w-4/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
            </motion.div>

            <div className="mt-6 hs-accordion-group" data-hs-accordion-always-open="">
              {filterConfig.map((section, index) => {
                const isSlider = !!section.isSlider;

                const getSliderBinding = (sliderId) => {
                  let val1, val2, setVals;
                  if (sliderId === 'prix-avance') {
                    val1 = priceMin; val2 = priceMax; setVals = (a, b) => { setPriceMin(a); setPriceMax(b); };
                  } else if (sliderId === 'largeur-totale-avance') {
                    val1 = largeurTotaleMin; val2 = largeurTotaleMax; setVals = (a, b) => { setLargeurTotaleMin(a); setLargeurTotaleMax(b); };
                  } else if (sliderId === 'largeur-verre-avance') {
                    val1 = largeurVerreMin; val2 = largeurVerreMax; setVals = (a, b) => { setLargeurVerreMin(a); setLargeurVerreMax(b); };
                  } else if (sliderId === 'hauteur-verre-avance') {
                    val1 = hauteurVerreMin; val2 = hauteurVerreMax; setVals = (a, b) => { setHauteurVerreMin(a); setHauteurVerreMax(b); };
                  } else if (sliderId === 'largeur-pont-avance') {
                    val1 = largeurPontMin; val2 = largeurPontMax; setVals = (a, b) => { setLargeurPontMin(a); setLargeurPontMax(b); };
                  } else if (sliderId === 'longueur-branche-avance') {
                    val1 = longueurBrancheMin; val2 = longueurBrancheMax; setVals = (a, b) => { setLongueurBrancheMin(a); setLongueurBrancheMax(b); };
                  }
                  return { val1, val2, setVals };
                };

                const boundsMin = filterValues?.[section.fieldMin] ?? DEFAULT_FILTER_VALUES[section.fieldMin];
                const boundsMax = filterValues?.[section.fieldMax] ?? DEFAULT_FILTER_VALUES[section.fieldMax];

                const { val1, val2, setVals } = getSliderBinding(section.id);

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="hs-accordion mt-6 first:mt-0"
                    id={`hs-accordion-${section.id}`}
                  >
                    <button className="hs-accordion-toggle group inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-default-800 dark:text-default-200 rounded-lg text-base hover:text-primary transition-colors duration-300" aria-expanded="false" aria-controls={`hs-collapse-${section.id}`}>
                      {section.title}
                      <div className="relative">
                        <LuChevronDown size={18} className="text-base hs-accordion-active:hidden block group-hover:text-primary transition-colors" />
                        <LuChevronUp size={18} className="text-base hs-accordion-active:block hidden group-hover:text-primary transition-colors" />
                      </div>
                    </button>

                    <div id={`hs-collapse-${section.id}`} className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby={`hs-accordion-${section.id}`}>
                      {isSlider ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-4 space-y-4"
                        >
                          <DoubleSlider
                            min={typeof boundsMin === 'number' ? boundsMin : 0}
                            max={typeof boundsMax === 'number' ? boundsMax : 100}
                            step={typeof section.step === 'number' ? section.step : 1}
                            value1={val1}
                            value2={val2}
                            onChange={(v1, v2) => setVals?.(v1, v2)}
                            formatValue={(v) => formatUnit(section.unit, v)}
                            ariaLabelFrom={`${section.title} min`}
                            ariaLabelTo={`${section.title} max`}
                          />
                        </motion.div>
                      ) : (
                        <div className={`mt-4 flex ${section.id === 'couleur' ? 'flex-wrap gap-4 p-2' : section.id === 'forme' ? 'flex-wrap gap-4 p-2' : section.id === 'materiau-dynamique' ? 'flex-col gap-3' : section.id === 'genre' ? 'flex-col gap-3' : section.id === 'type-verre' ? 'flex-col gap-3' : section.id === 'type-monture' ? 'flex-col gap-3' : 'flex-col gap-3'}`}>
                          {section.id === 'couleur' ? (
                            colors.length > 0 ? (
                              colors.map((color, colorIndex) => (
                                <motion.div
                                  key={`${color.name}-${colorIndex}`}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.5 + colorIndex * 0.05 }}
                                  className="relative cursor-pointer group z-10"
                                  onClick={() => handleColorToggle(color.name)}
                                  title={color.name}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 shadow-sm ${
                                      isColorSelected(color.name) ? 'ring-2 ring-primary ring-offset-2 scale-110 shadow-md' : 'border-2'
                                    }`}
                                    style={{
                                      backgroundColor: color.codeHex,
                                      borderColor: color.codeHex === '#FFFFFF' || color.codeHex.toLowerCase() === '#fff' ? '#E5E7EB' : color.codeHex
                                    }}
                                  />
                                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 pointer-events-none" />
                                  {isColorSelected(color.name) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                      <div className="w-2 h-2 bg-white rounded-full shadow-lg border border-primary"></div>
                                    </motion.div>
                                  )}
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-sm text-default-500 italic py-2">Aucune couleur disponible</div>
                            )
                          ) : section.id === 'forme' ? (
                            formes.length > 0 ? (
                              <div className="flex flex-col gap-3 w-full">
                                {formes.map((forme, formeIndex) => {
                                  const formeId = `forme-${slugify(forme.name)}-${formeIndex}`;
                                  const selected = isFormeSelected(forme.name);
                                  return (
                                    <motion.div
                                      key={formeId}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.45 + formeIndex * 0.05 }}
                                      className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                    >
                                      <input
                                        type="checkbox"
                                        id={formeId}
                                        checked={selected}
                                        onChange={() => handleToggleForme(forme.name)}
                                        className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                      />
                                      <label htmlFor={formeId} className="flex items-center gap-3 cursor-pointer select-none flex-1">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-md overflow-hidden bg-white dark:bg-default-800 border ${selected ? 'border-primary ring-2 ring-primary/30' : 'border-default-200 dark:border-default-600'}`}>
                                          {forme.imageUrl ? (
                                            <img
                                              src={forme.imageUrl}
                                              alt={forme.name}
                                              className="w-10 h-10 object-contain"
                                              loading="lazy"
                                            />
                                          ) : (
                                            <span className="text-xs text-default-500">N/A</span>
                                          )}
                                        </div>
                                        <span className={`text-sm ${selected ? 'font-medium text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{forme.name}</span>
                                      </label>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-default-500 italic py-2">Aucune forme disponible</div>
                            )
                          ) : section.id === 'materiau-dynamique' ? (
                            materiaux.length > 0 ? (
                              <div className="flex flex-col gap-3 w-full">
                                {materiaux.map((materiau, matIndex) => {
                                  const materiauId = `materiau-${slugify(materiau.name)}-${matIndex}`;
                                  const selected = isMateriauSelected(materiau.name);
                                  return (
                                    <motion.div
                                      key={materiauId}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.45 + matIndex * 0.05 }}
                                      className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                    >
                                      <input
                                        type="checkbox"
                                        id={materiauId}
                                        checked={selected}
                                        onChange={() => handleToggleMateriau(materiau.name)}
                                        className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                      />
                                      <label htmlFor={materiauId} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                        <span className={`text-sm font-medium ${selected ? 'text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{materiau.name}</span>
                                      </label>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-default-500 italic py-2">Aucun matériau disponible</div>
                            )
                          ) : section.id === 'genre' ? (
                            // Section "Genre" avec le même design que "Matériau"
                            <div className="flex flex-col gap-3 w-full">
                              {section.options?.map((opt, optIndex) => {
                                const selected = selectedGenres.includes(opt.id);
                                return (
                                  <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + optIndex * 0.05 }}
                                    className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      id={opt.id}
                                      checked={selected}
                                      onChange={() => {
                                        setSelectedGenres((prev) =>
                                          prev.includes(opt.id)
                                            ? prev.filter((id) => id !== opt.id)
                                            : [...prev, opt.id]
                                        );
                                      }}
                                      className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                    />
                                    <label htmlFor={opt.id} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                      <span className={`text-sm font-medium ${selected ? 'text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{opt.label}</span>
                                    </label>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : section.id === 'type-verre' ? (
                            // Section "Type de verre" avec le même design que "Matériau"
                            <div className="flex flex-col gap-3 w-full">
                              {section.options?.map((opt, optIndex) => {
                                const selected = selectedTypeVerres.includes(opt.id);
                                return (
                                  <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + optIndex * 0.05 }}
                                    className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      id={opt.id}
                                      checked={selected}
                                      onChange={() => {
                                        setSelectedTypeVerres((prev) =>
                                          prev.includes(opt.id)
                                            ? prev.filter((id) => id !== opt.id)
                                            : [...prev, opt.id]
                                        );
                                      }}
                                      className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                    />
                                    <label htmlFor={opt.id} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                      <span className={`text-sm font-medium ${selected ? 'text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{opt.label}</span>
                                    </label>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : section.id === 'type-monture' ? (
                            // Section "Type de monture" avec design comme "Forme"
                            <div className="flex flex-col gap-3 w-full">
                              {section.options?.map((opt, optIndex) => {
                                const selected = isMontureSelected(opt.id);
                                const inputId = `monture-${opt.id}`;
                                return (
                                  <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + optIndex * 0.05 }}
                                    className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      id={inputId}
                                      checked={selected}
                                      onChange={() => handleToggleMonture(opt.id)}
                                      className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                    />
                                    <label htmlFor={inputId} className="flex items-center gap-3 cursor-pointer select-none flex-1">
                                      <div className={`w-12 h-12 flex items-center justify-center rounded-md overflow-hidden bg-white dark:bg-default-800 border ${selected ? 'border-primary ring-2 ring-primary/30 text-primary' : 'border-default-200 dark:border-default-600 text-default-500'}`}>
                                        <MontureIcon type={opt.id} />
                                      </div>
                                      <span className={`text-sm ${selected ? 'font-medium text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{opt.label}</span>
                                    </label>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : section.id === 'taille' ? (
                            // Section "Taille" avec le même design que "Matériau"
                            <div className="flex flex-col gap-3 w-full">
                              {section.options?.map((opt, optIndex) => {
                                const selected = selectedTailles.includes(opt.id);
                                return (
                                  <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + optIndex * 0.05 }}
                                    className={`flex items-center gap-3 p-2 rounded-md border transition-all duration-200 ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-default-200 dark:border-default-700 hover:bg-default-50 dark:hover:bg-default-800/40'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      id={opt.id}
                                      checked={selected}
                                      onChange={(e) => {
                                        setSelectedTailles((prev) =>
                                          prev.includes(opt.id)
                                            ? prev.filter((id) => id !== opt.id)
                                            : [...prev, opt.id]
                                        );
                                        if (opt.id === 'taille-sur-mesure') {
                                          setIsSurMesureSelected(e.target.checked);
                                        }
                                      }}
                                      className="form-checkbox h-4 w-4 rounded bg-white dark:bg-default-800 border border-default-300 dark:border-default-600 checked:bg-primary checked:border-primary focus:ring-primary/40 transition-colors"
                                    />
                                    <label htmlFor={opt.id} className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                      <span className={`text-sm font-medium ${selected ? 'text-default-900 dark:text-default-100' : 'text-default-700 dark:text-default-300'}`}>{opt.label}</span>
                                    </label>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            section.options?.map((opt, optIndex) => (
                              <motion.div
                                key={opt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + optIndex * 0.05 }}
                                className="flex gap-3 items-center group hover:bg-primary/5 rounded-lg px-2 py-1.5 transition-all duration-300"
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox bg-white dark:bg-default-800 border border-default-300 rounded transition-all duration-300 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/30"
                                  id={opt.id}
                                  onChange={(e) => {
                                    if (opt.id === 'taille-sur-mesure') {
                                      setIsSurMesureSelected(e.target.checked);
                                    }
                                  }}
                                />
                                {opt.icon && <div className="flex-shrink-0">{opt.icon}</div>}
                                <label
                                  htmlFor={opt.id}
                                  className="text-sm text-default-700 dark:text-default-300 align-middle cursor-pointer select-none group-hover:text-default-900 dark:group-hover:text-default-100 transition-colors duration-300 flex-1"
                                >
                                  {opt.label}
                                </label>
                              </motion.div>
                            ))
                          )}
                          {section.id === 'taille' && isSurMesureSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 space-y-4 border-t border-default-200 dark:border-default-700 pt-4"
                            >
                              <h6 className="text-sm font-semibold text-default-700 dark:text-default-200">Dimensions sur mesure</h6>
                              {dimensionSliders.map((dim, dimIndex) => {
                                const boundsMinDim = filterValues?.[dim.fieldMin] ?? DEFAULT_FILTER_VALUES[dim.fieldMin];
                                const boundsMaxDim = filterValues?.[dim.fieldMax] ?? DEFAULT_FILTER_VALUES[dim.fieldMax];
                                let val1Dim, val2Dim, setValsDim;
                                if (dim.id === 'largeur-totale-avance') { val1Dim = largeurTotaleMin; val2Dim = largeurTotaleMax; setValsDim = (a,b)=>{setLargeurTotaleMin(a); setLargeurTotaleMax(b);} }
                                else if (dim.id === 'largeur-verre-avance') { val1Dim = largeurVerreMin; val2Dim = largeurVerreMax; setValsDim = (a,b)=>{setLargeurVerreMin(a); setLargeurVerreMax(b);} }
                                else if (dim.id === 'hauteur-verre-avance') { val1Dim = hauteurVerreMin; val2Dim = hauteurVerreMax; setValsDim = (a,b)=>{setHauteurVerreMin(a); setHauteurVerreMax(b);} }
                                else if (dim.id === 'largeur-pont-avance') { val1Dim = largeurPontMin; val2Dim = largeurPontMax; setValsDim = (a,b)=>{setLargeurPontMin(a); setLargeurPontMax(b);} }
                                else if (dim.id === 'longueur-branche-avance') { val1Dim = longueurBrancheMin; val2Dim = longueurBrancheMax; setValsDim = (a,b)=>{setLongueurBrancheMin(a); setLongueurBrancheMax(b);} }
                                return (
                                  <motion.div
                                    key={dim.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55 + dimIndex * 0.07 }}
                                    className="space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-default-600 dark:text-default-300">{dim.title}</span>
                                      <span className="text-xs text-default-500">{formatUnit(dim.unit, Math.min(val1Dim,val2Dim))} – {formatUnit(dim.unit, Math.max(val1Dim,val2Dim))}</span>
                                    </div>
                                    <DoubleSlider
                                      compact
                                      min={typeof boundsMinDim === 'number' ? boundsMinDim : 0}
                                      max={typeof boundsMaxDim === 'number' ? boundsMaxDim : 100}
                                      step={typeof dim.step === 'number' ? dim.step : 1}
                                      value1={val1Dim}
                                      value2={val2Dim}
                                      onChange={(v1,v2)=>setValsDim?.(v1,v2)}
                                      formatValue={(v)=> formatUnit(dim.unit, v)}
                                      ariaLabelFrom={`${dim.title} min`}
                                      ariaLabelTo={`${dim.title} max`}
                                    />
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
        </div>
          </>
        )}
      </div>
    </motion.div>;
};
export default ProductFilter;
