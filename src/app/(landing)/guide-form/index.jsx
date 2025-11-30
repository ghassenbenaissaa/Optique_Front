import { useState, useEffect, useRef } from 'react';
import PageMeta from '@/components/PageMeta';
import Navbar from '@/app/(landing)/product-landing/components/Navbar';
import Footer from '@/app/(landing)/product-landing/components/Footer';
import PromoBanner from '@/app/(landing)/product-grid/components/PromoBanner.jsx';
import ScrollToTop from '@/app/(landing)/product-grid/components/ScrollToTop.jsx';
import NewsletterCTA from '@/app/(landing)/product-grid/components/NewsletterCTA.jsx';

/**
 * GuideForm - Guide professionnel pour le choix de la forme de lunettes
 * Conseils d'experts opticiens avec vidéos YouTube intégrées
 * Design cohérent avec le reste du site
 */
const GuideForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Animation d'apparition au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      <PageMeta title="Guide des Formes de Lunettes - Conseils d'Experts" />
      <PromoBanner />
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-40 md:pt-40 lg:pt-44 pb-12 md:pb-16 lg:pb-20 overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10"
      >
        {/* Éléments décoratifs de fond */}
        <div className="absolute top-0 end-0 size-80 bg-purple-500/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 start-0 size-80 bg-primary/5 blur-3xl rounded-full"></div>

        <div className="container relative z-10">
          <div
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge supérieur */}
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
              Guide Expert
            </span>

            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-default-900 dark:text-default-100 mb-6 leading-tight">
              Choisir la Forme Parfaite{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  de Lunettes
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></span>
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-default-600 dark:text-default-400 mb-8">
              Découvrez les conseils professionnels de nos opticiens pour trouver la monture idéale
              qui sublime votre visage et exprime votre personnalité.
            </p>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5</div>
                <div className="text-xs md:text-sm text-default-600 dark:text-default-400">Formes principales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">7</div>
                <div className="text-xs md:text-sm text-default-600 dark:text-default-400">Types de visages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs md:text-sm text-default-600 dark:text-default-400">Personnalisé</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation rapide / Table des matières */}
      <section className="py-6 md:py-8 bg-white dark:bg-default-800 md:sticky md:top-0 z-30 shadow-sm md:shadow-md border-b border-default-200/50 dark:border-default-700/50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap px-2 md:px-4">
              <span className="hidden md:inline text-sm font-medium text-default-600 dark:text-default-400">
                Navigation rapide :
              </span>
              <a
                href="#forme-visage"
                className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-default-700 dark:text-default-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Forme du visage
              </a>
              <span className="hidden md:inline text-default-300 dark:text-default-600">|</span>
              <a
                href="#couleurs"
                className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-default-700 dark:text-default-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Couleurs
              </a>
              <span className="hidden md:inline text-default-300 dark:text-default-600">|</span>
              <a
                href="#taille-ajustement"
                className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-default-700 dark:text-default-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Taille & Ajustement
              </a>
              <span className="hidden md:inline text-default-300 dark:text-default-600">|</span>
              <a
                href="#styles-modernes"
                className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-default-700 dark:text-default-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Styles modernes
              </a>
              <span className="hidden md:inline text-default-300 dark:text-default-600">|</span>
              <a
                href="#conseils-experts"
                className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium text-default-700 dark:text-default-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              >
                Conseils experts
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Forme du visage vs Forme de monture */}
      <section id="forme-visage" className="py-12 md:py-16 lg:py-20 scroll-mt-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
                Règle d'or
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 mb-4">
                Harmoniser la Forme de Votre{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Visage
                </span>
              </h2>
              <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-3xl mx-auto">
                Le principe fondamental : choisir une monture qui contraste avec la forme naturelle de votre visage
                pour créer un équilibre esthétique parfait.
              </p>
            </div>

            {/* Grille de conseils */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {/* Visage Ovale */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⬭</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Ovale
                    </h3>
                    <p className="text-sm text-primary font-medium">La forme universelle</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Proportions équilibrées et harmonieuses. Presque toutes les formes vous conviennent !
                  Privilégiez les montures rectangulaires ou carrées pour structurer légèrement le visage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Rectangulaire</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Carré</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Aviateur</span>
                </div>
              </div>

              {/* Visage Rond */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">●</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Rond
                    </h3>
                    <p className="text-sm text-primary font-medium">Douceur et courbes</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Joues pleines, largeur et hauteur similaires. Optez pour des montures rectangulaires
                  ou angulaires pour affiner et allonger visuellement votre visage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Rectangulaire</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Œil-de-chat</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Géométrique</span>
                </div>
              </div>

              {/* Visage Carré */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">◼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Carré
                    </h3>
                    <p className="text-sm text-primary font-medium">Structure et caractère</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Mâchoire marquée, front large. Adoucissez les angles avec des montures rondes
                  ou ovales. Les formes douces créent un contraste harmonieux.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Rond</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Ovale</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Aviateur</span>
                </div>
              </div>

              {/* Visage Triangulaire */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">▽</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Triangulaire
                    </h3>
                    <p className="text-sm text-primary font-medium">Front étroit, mâchoire large</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Équilibrez les proportions avec des montures plus larges en haut.
                  Les œil-de-chat et les demi-cerclées apportent volume au front.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Œil-de-chat</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Papillon</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Demi-cerclée</span>
                </div>
              </div>

              {/* Visage Cœur */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">♡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Cœur
                    </h3>
                    <p className="text-sm text-primary font-medium">Front large, menton pointu</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Équilibrez avec des montures plus larges en bas. Les aviateurs et les rondes
                  apportent douceur et attirent l'attention vers le bas du visage.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Aviateur</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Rond</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Sans monture</span>
                </div>
              </div>

              {/* Visage Rectangle */}
              <div className="group bg-white dark:bg-default-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">▭</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-2">
                      Visage Rectangle
                    </h3>
                    <p className="text-sm text-primary font-medium">Visage allongé</p>
                  </div>
                </div>
                <p className="text-default-600 dark:text-default-400 mb-4">
                  Raccourcissez visuellement avec des montures hautes et larges.
                  Les grandes montures créent un équilibre horizontal parfait.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Grandes rondes</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Papillon</span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Oversized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Couleurs et styles */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-transparent via-default-50/30 to-transparent dark:via-default-900/10">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
                Style & Couleur
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 mb-4">
                Couleurs et{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Styles Adaptés
                </span>
              </h2>
              <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-3xl mx-auto">
                La couleur de votre monture doit harmoniser avec votre teint, vos cheveux et vos yeux
                pour sublimer votre look naturel.
              </p>
            </div>

            {/* Grille de conseils couleurs */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Teint Chaud */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border-2 border-orange-200/50 dark:border-orange-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 mb-4"></div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                  Teint Chaud
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  Sous-tons dorés, peau dorée ou olivâtre
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Brun</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Doré</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Vert olive</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Orange</span>
                </div>
              </div>

              {/* Teint Froid */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4"></div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                  Teint Froid
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  Sous-tons rosés ou bleutés
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Noir</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Argenté</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Bleu</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Violet</span>
                </div>
              </div>

              {/* Teint Neutre */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-slate-500 mb-4"></div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                  Teint Neutre
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  Mélange équilibré, tout vous va !
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Écaille</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Nude</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Gris</span>
                  <span className="px-2 py-1 text-xs bg-white dark:bg-default-800 rounded-full">Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Taille et ajustement */}
      <section id="taille-ajustement" className="py-12 md:py-16 lg:py-20 scroll-mt-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
                Ajustement Parfait
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 mb-4">
                Taille, Pont et{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Confort
                </span>
              </h2>
              <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-3xl mx-auto">
                Les mesures techniques sont essentielles pour un confort optimal et une esthétique réussie.
              </p>
            </div>

            {/* Conseils techniques */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Largeur de monture */}
              <div className="bg-white dark:bg-default-800 rounded-2xl p-6 shadow-md border-2 border-default-200/50 dark:border-default-700/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-3">
                  Largeur de Monture
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  La monture ne doit pas dépasser la largeur de votre visage. Elle doit s'aligner avec vos tempes.
                </p>
                <div className="text-xs text-primary font-medium">
                  ✓ Proportions équilibrées
                </div>
              </div>

              {/* Pont */}
              <div className="bg-white dark:bg-default-800 rounded-2xl p-6 shadow-md border-2 border-default-200/50 dark:border-default-700/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-3">
                  Largeur du Pont
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  Le pont doit reposer confortablement sur votre nez sans glisser ni pincer. Généralement entre 14-24mm.
                </p>
                <div className="text-xs text-primary font-medium">
                  ✓ Confort maximal
                </div>
              </div>

              {/* Branches */}
              <div className="bg-white dark:bg-default-800 rounded-2xl p-6 shadow-md border-2 border-default-200/50 dark:border-default-700/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-3">
                  Longueur des Branches
                </h3>
                <p className="text-sm text-default-600 dark:text-default-400 mb-3">
                  Les branches doivent suivre la courbe de votre tête sans pression excessive. Standard : 135-150mm.
                </p>
                <div className="text-xs text-primary font-medium">
                  ✓ Stabilité assurée
                </div>
              </div>
            </div>

            {/* Infographie des mesures */}
            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-default-900 dark:text-default-100 mb-4">
                Comment lire les mesures sur vos lunettes ?
              </h3>
              <p className="text-default-600 dark:text-default-400 mb-6">
                Les mesures sont généralement gravées à l'intérieur de la branche :
                <span className="font-mono font-bold text-primary mx-2">52▢18-140</span>
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-default-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary mb-1">52</div>
                  <div className="text-xs text-default-600 dark:text-default-400">Largeur verres (mm)</div>
                </div>
                <div className="bg-white dark:bg-default-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary mb-1">18</div>
                  <div className="text-xs text-default-600 dark:text-default-400">Largeur pont (mm)</div>
                </div>
                <div className="bg-white dark:bg-default-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary mb-1">140</div>
                  <div className="text-xs text-default-600 dark:text-default-400">Longueur branches (mm)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Styles modernes selon morphologie */}
      <section id="styles-modernes" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-transparent via-default-50/30 to-transparent dark:via-default-900/10 scroll-mt-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
                Tendances 2025
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 mb-4">
                Styles Modernes selon{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Morphologie
                </span>
              </h2>
              <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-3xl mx-auto">
                Découvrez les tendances actuelles adaptées à chaque type de visage pour un look contemporain et élégant.
              </p>
            </div>

            {/* Styles tendance */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Montures Oversized */}
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-default-800 shadow-lg border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30 transition-all duration-500">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-xl">👓</span>
                    </div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100">
                      Montures Oversized
                    </h3>
                  </div>
                  <p className="text-default-600 dark:text-default-400 mb-4">
                    Audacieuses et affirmées. Parfaites pour les visages petits à moyens qui veulent
                    faire une déclaration de style forte et moderne.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Tendance fashion 2025</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-2xl"></div>
              </div>

              {/* Montures Transparentes */}
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-default-800 shadow-lg border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30 transition-all duration-500">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100">
                      Montures Transparentes
                    </h3>
                  </div>
                  <p className="text-default-600 dark:text-default-400 mb-4">
                    Discrètes et élégantes. Conviennent à tous les visages et s'accordent avec tous les styles.
                    Le choix minimaliste par excellence.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Intemporel & polyvalent</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl"></div>
              </div>

              {/* Formes Géométriques */}
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-default-800 shadow-lg border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30 transition-all duration-500">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-xl">◇</span>
                    </div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100">
                      Formes Géométriques
                    </h3>
                  </div>
                  <p className="text-default-600 dark:text-default-400 mb-4">
                    Hexagonales, octogonales, asymétriques. Pour les visages ovales ou ronds qui recherchent
                    un style avant-gardiste et unique.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Style créatif</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-2xl"></div>
              </div>

              {/* Montures Métalliques Fines */}
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-default-800 shadow-lg border-2 border-default-200/50 dark:border-default-700/50 hover:border-primary/30 transition-all duration-500">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-xl">⚙</span>
                    </div>
                    <h3 className="text-xl font-bold text-default-900 dark:text-default-100">
                      Montures Métalliques Fines
                    </h3>
                  </div>
                  <p className="text-default-600 dark:text-default-400 mb-4">
                    Légères et sophistiquées. Idéales pour les visages aux traits marqués qui souhaitent
                    une touche de raffinement sans alourdir.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Élégance classique</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Conseils d'experts */}
      <section id="conseils-experts" className="py-12 md:py-16 lg:py-20 scroll-mt-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
                Expertise Professionnelle
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 mb-4">
                Conseils d'{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Opticiens Experts
                </span>
              </h2>
              <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-3xl mx-auto">
                Des recommandations professionnelles pour faire le choix parfait en toute confiance.
              </p>
            </div>

            {/* Liste de conseils d'experts */}
            <div className="space-y-6 mb-12">
              {/* Conseil 1 */}
              <div className="flex gap-4 bg-white dark:bg-default-800 rounded-xl p-6 shadow-md border-l-4 border-primary">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                    Essayez toujours plusieurs formes
                  </h3>
                  <p className="text-default-600 dark:text-default-400">
                    Ne vous limitez pas à une seule forme. Essayez différents styles pour découvrir
                    ce qui vous met le plus en valeur. Parfois, les formes inattendues créent les meilleurs looks !
                  </p>
                </div>
              </div>

              {/* Conseil 2 */}
              <div className="flex gap-4 bg-white dark:bg-default-800 rounded-xl p-6 shadow-md border-l-4 border-primary">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                    Considérez votre style de vie
                  </h3>
                  <p className="text-default-600 dark:text-default-400">
                    Votre monture doit correspondre à vos activités quotidiennes. Sportif ? Optez pour des montures
                    légères et résistantes. Professionnel ? Des designs classiques et élégants sont préférables.
                  </p>
                </div>
              </div>

              {/* Conseil 3 */}
              <div className="flex gap-4 bg-white dark:bg-default-800 rounded-xl p-6 shadow-md border-l-4 border-primary">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                    Demandez un second avis
                  </h3>
                  <p className="text-default-600 dark:text-default-400">
                    N'hésitez pas à consulter nos experts ou à demander l'avis de vos proches.
                    Un regard extérieur peut vous aider à faire le choix parfait avec plus de confiance.
                  </p>
                </div>
              </div>

              {/* Conseil 4 */}
              <div className="flex gap-4 bg-white dark:bg-default-800 rounded-xl p-6 shadow-md border-l-4 border-primary">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-default-900 dark:text-default-100 mb-2">
                    Investissez dans la qualité
                  </h3>
                  <p className="text-default-600 dark:text-default-400">
                    Des lunettes de qualité durent plus longtemps et offrent un meilleur confort.
                    Privilégiez des matériaux durables et des verres avec traitements adaptés à vos besoins.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA final */}
            <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à trouver vos lunettes parfaites ?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Explorez notre collection et utilisez nos filtres pour trouver la forme, la couleur et
                le style qui vous correspondent parfaitement.
              </p>
              <a
                href="/product"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-default-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Découvrir la Collection</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <NewsletterCTA />
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default GuideForm;

