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
          <div className="absolute inset-0 bg-default-200 dark:bg-default-800 rounded-full" />
          <div
            className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-primary to-primary shadow-sm"
            style={{ left: `${left}%`, width: `${right - left}%`, pointerEvents: 'none' }}
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
            className={`group absolute ${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-primary border-2 border-white dark:border-default-900 shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary/40 hover:scale-110`}
            style={{ left: `${p1}%`, top: '50%', transform: 'translate(-50%, -50%)', zIndex: dragging === 'from' ? 30 : 20, transition: dragging === 'from' ? 'none' : 'transform 150ms ease-out' }}
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
            className={`group absolute ${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-primary border-2 border-white dark:border-default-900 shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary/40 hover:scale-110`}
            style={{ left: `${p2}%`, top: '50%', transform: 'translate(-50%, -50%)', zIndex: dragging === 'to' ? 30 : 20, transition: dragging === 'to' ? 'none' : 'transform 150ms ease-out' }}
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
  options: [{
    id: 'type-vue',
    label: 'Lunettes de vue'
  }, {
    id: 'type-soleil',
    label: 'Lunettes de soleil'
  }, {
    id: 'type-ia',
    label: 'Lunettes IA'
  }]
}, {
  id: 'genre',
  title: 'Genre',
  options: [{
    id: 'genre-homme',
    label: 'Homme'
  }, {
    id: 'genre-femme',
    label: 'Femme'
  }, {
    id: 'genre-unisex',
    label: 'Unisexe'
  }, {
    id: 'genre-enfant',
    label: 'Enfant'
  }]
}, {
  id: 'taille',
  title: 'Taille',
  options: [{
    id: 'taille-extra-petit',
    label: 'Extra Petit'
  }, {
    id: 'taille-petit',
    label: 'Petit'
  }, {
    id: 'taille-moyen',
    label: 'Moyen'
  }, {
    id: 'taille-grand',
    label: 'Grand'
  }, {
    id: 'taille-extra-grand',
    label: 'Extra Grand'
  }, {
    id: 'taille-sur-mesure',
    label: 'Sur mesure',
    isCustomSize: true
  }]
}, {
  id: 'forme',
  title: 'Forme',
  options: [{
    id: 'forme-rectangulaire',
    label: 'Rectangulaire'
  }, {
    id: 'forme-ronde',
    label: 'Ronde'
  }, {
    id: 'forme-ovale',
    label: 'Ovale'
  }, {
    id: 'forme-carree',
    label: 'Carrée'
  }, {
    id: 'forme-papillon',
    label: 'Papillon'
  }, {
    id: 'forme-aviateur',
    label: 'Aviateur'
  }, {
    id: 'forme-wayfarer',
    label: 'Wayfarer'
  }]
}, {
  id: 'couleur',
  title: 'Couleur',
  options: [{
    id: 'couleur-noir',
    label: 'Noir',
    isColor: true,
    colorCode: '#000000'
  }, {
    id: 'couleur-marron',
    label: 'Marron',
    isColor: true,
    colorCode: '#8B4513'
  }, {
    id: 'couleur-bleu',
    label: 'Bleu',
    isColor: true,
    colorCode: '#0000FF'
  }, {
    id: 'couleur-rouge',
    label: 'Rouge',
    isColor: true,
    colorCode: '#FF0000'
  }, {
    id: 'couleur-vert',
    label: 'Vert',
    isColor: true,
    colorCode: '#00FF00'
  }, {
    id: 'couleur-gris',
    label: 'Gris',
    isColor: true,
    colorCode: '#808080'
  }, {
    id: 'couleur-rose',
    label: 'Rose',
    isColor: true,
    colorCode: '#FFC0CB'
  }, {
    id: 'couleur-violet',
    label: 'Violet',
    isColor: true,
    colorCode: '#800080'
  }, {
    id: 'couleur-or',
    label: 'Or',
    isColor: true,
    colorCode: '#FFD700'
  }, {
    id: 'couleur-argent',
    label: 'Argent',
    isColor: true,
    colorCode: '#C0C0C0'
  }, {
    id: 'couleur-transparent',
    label: 'Transparent',
    isColor: true,
    colorCode: '#FFFFFF'
  }]
}, {
  id: 'materiau',
  title: 'Matériau',
  options: [{
    id: 'materiau-plastique',
    label: 'Plastique'
  }, {
    id: 'materiau-metal',
    label: 'Métal'
  }, {
    id: 'materiau-acetate',
    label: 'Acétate'
  }, {
    id: 'materiau-titane',
    label: 'Titane'
  }, {
    id: 'materiau-bois',
    label: 'Bois'
  }, {
    id: 'materiau-aluminium',
    label: 'Aluminium'
  }]
}, {
  id: 'type-monture',
  title: 'Type de monture',
  options: [{
    id: 'monture-cerclee',
    label: 'Cerclée',
  }, {
    id: 'monture-demi-cerclee',
    label: 'Demi-cerclée',
  }, {
    id: 'monture-sans',
    label: 'Sans monture',
  }]
},
// Sliders avancés
{
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
  title: 'Largeur totale (mm)',
  isSlider: true,
  fieldMin: 'minLargeurTotale',
  fieldMax: 'maxLargeurTotale',
  unit: 'mm',
  step: 1,
}, {
  id: 'largeur-verre-avance',
  title: 'Largeur verre (mm)',
  isSlider: true,
  fieldMin: 'minLargeurVerre',
  fieldMax: 'maxLargeurVerre',
  unit: 'mm',
  step: 1,
}, {
  id: 'hauteur-verre-avance',
  title: 'Hauteur verre (mm)',
  isSlider: true,
  fieldMin: 'minHauteurVerre',
  fieldMax: 'maxHauteurVerre',
  unit: 'mm',
  step: 1,
}, {
  id: 'largeur-pont-avance',
  title: 'Largeur pont (mm)',
  isSlider: true,
  fieldMin: 'minLargeurPont',
  fieldMax: 'maxLargeurPont',
  unit: 'mm',
  step: 1,
}, {
  id: 'longueur-branche-avance',
  title: 'Longueur branche (mm)',
  isSlider: true,
  fieldMin: 'minLongueurBranche',
  fieldMax: 'maxLongueurBranche',
  unit: 'mm',
  step: 1,
}];

const ProductFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [filterValues, setFilterValues] = useState(null);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterError, setFilterError] = useState(null);

  const navigate = useNavigate();

  const [isSurMesureSelected, setIsSurMesureSelected] = useState(false);

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

  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        setFilterLoading(true);
        setFilterError(null);

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

      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
        setFilterError(error.message);

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

                const renderSlider = (sliderSection, delayOffset = 0) => {
                  const boundsMin = filterValues?.[sliderSection.fieldMin] ?? DEFAULT_FILTER_VALUES[sliderSection.fieldMin];
                  const boundsMax = filterValues?.[sliderSection.fieldMax] ?? DEFAULT_FILTER_VALUES[sliderSection.fieldMax];
                  const { val1, val2, setVals } = getSliderBinding(sliderSection.id);

                  return (
                    <motion.div
                      key={sliderSection.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + delayOffset }}
                      className="hs-accordion mt-6 first:mt-0"
                      id={`hs-accordion-${sliderSection.id}`}
                    >
                      <button className="hs-accordion-toggle group inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-default-800 dark:text-default-200 rounded-lg text-base hover:text-primary transition-colors duration-300" aria-expanded="false" aria-controls={`hs-collapse-${sliderSection.id}`}>
                        {sliderSection.title}
                        <div className="relative">
                          <LuChevronDown size={18} className="text-base hs-accordion-active:hidden block group-hover:text-primary transition-colors" />
                          <LuChevronUp size={18} className="text-base hs-accordion-active:block hidden group-hover:text-primary transition-colors" />
                        </div>
                      </button>

                      <div id={`hs-collapse-${sliderSection.id}`} className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby={`hs-accordion-${sliderSection.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-4 space-y-4"
                        >
                          <DoubleSlider
                            min={typeof boundsMin === 'number' ? boundsMin : 0}
                            max={typeof boundsMax === 'number' ? boundsMax : 100}
                            step={typeof sliderSection.step === 'number' ? sliderSection.step : 1}
                            value1={val1}
                            value2={val2}
                            onChange={(v1, v2) => setVals?.(v1, v2)}
                            formatValue={(v) => formatUnit(sliderSection.unit, v)}
                            ariaLabelFrom={`${sliderSection.title} min`}
                            ariaLabelTo={`${sliderSection.title} max`}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                };

                const boundsMin = filterValues?.[section.fieldMin] ?? DEFAULT_FILTER_VALUES[section.fieldMin];
                const boundsMax = filterValues?.[section.fieldMax] ?? DEFAULT_FILTER_VALUES[section.fieldMax];

                const { val1, val2, setVals } = getSliderBinding(section.id);

                return (
                  <>
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
                          // Affichage normal pour les autres filtres
                          <div className={`mt-4 flex ${section.id === 'couleur' ? 'flex-wrap gap-2' : 'flex-col gap-3'}`}>
                            {section.options?.map((opt, optIndex) => opt.isColor ? (
                              <motion.label
                                key={opt.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + optIndex * 0.05 }}
                                className="relative cursor-pointer group"
                                htmlFor={opt.id}
                                title={opt.label}
                              >
                                <input
                                  id={opt.id}
                                  type="checkbox"
                                  className="size-7 cursor-pointer rounded-md focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:scale-110 appearance-none border-2"
                                  style={{
                                    backgroundColor: opt.colorCode,
                                    borderColor: opt.colorCode === '#FFFFFF' ? '#E5E7EB' : opt.colorCode
                                  }}
                                />
                                <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 pointer-events-none"></div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-default-900 dark:bg-default-100 text-white dark:text-default-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                                  {opt.label}
                                </div>
                              </motion.label>
                            ) : (
                              <motion.div
                                key={opt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + optIndex * 0.05 }}
                                className="flex gap-3 items-center group hover:bg-primary/5 rounded-lg px-2 py-1.5 transition-all duration-300"
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox checked:bg-primary border-default-300 rounded transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                                  id={opt.id}
                                  onChange={(e) => {
                                    if (opt.id === 'taille-sur-mesure') {
                                      setIsSurMesureSelected(e.target.checked);
                                    }
                                  }}
                                />
                                {opt.icon && (
                                  <div className="flex-shrink-0">
                                    {opt.icon}
                                  </div>
                                )}
                                <label
                                  htmlFor={opt.id}
                                  className="text-sm text-default-700 dark:text-default-300 align-middle cursor-pointer select-none group-hover:text-default-900 dark:group-hover:text-default-100 transition-colors duration-300 flex-1"
                                >
                                  {opt.label}
                                </label>
                              </motion.div>
                            ))}
                            {/* Sliders sur mesure intégrés */}
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
                                  // Récupération binding
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
                  </>
                );
              })}
        </div>
          </>
        )}
      </div>
    </motion.div>;
};
export default ProductFilter;
