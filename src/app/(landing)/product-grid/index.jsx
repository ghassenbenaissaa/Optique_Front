import PageMeta from '@/components/PageMeta';
import ProductFilter from './components/ProductFilter';
import Products from './components/Products';
import MobileFilter from './components/MobileFilter';
import PromoBanner from './components/PromoBanner';
import NewsletterCTA from './components/NewsletterCTA';
import ScrollToTop from './components/ScrollToTop';
import { motion } from 'framer-motion';
import Footer from '@/app/(landing)/product-landing/components/Footer.jsx';
import Navbar from '@/app/(landing)/product-landing/components/Navbar.jsx';

const Index = () => {
  return <>
      <PageMeta title="Product Grid" />

      <PromoBanner />
      <Navbar />
      {/* Hero Section avec gradient animé */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent"
        style={{
          paddingTop: 'calc(var(--nav-height, 80px) + var(--promo-offset, 0px) + 4rem)',
          marginTop: 0
        }}
      >
        {/* Éléments décoratifs de fond */}
        <div className="absolute top-0 start-0 size-96 bg-primary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 end-0 size-96 bg-purple-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-primary font-semibold text-sm md:text-base tracking-wider uppercase mb-4"
            >
              Découvrez Notre Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-default-900 dark:text-default-100 mb-6 leading-tight"
            >
              Trouvez vos{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  lunettes parfaites
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-default-600 dark:text-default-400 leading-relaxed"
            >
              Explorez notre sélection de lunettes tendance et trouvez le style qui vous correspond
            </motion.p>
          </motion.div>
        </div>
      </motion.section>


      <main className="py-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid lg:grid-cols-4 grid-cols-1 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="col-span-1 lg:block hidden"
            >
              <ProductFilter />
            </motion.div>
            <Products />
          </motion.div>
        </div>
      </main>

      {/* Section Newsletter */}
      <NewsletterCTA />

      {/* Filtre mobile avec bouton flottant */}
      <MobileFilter />

      {/* Bouton retour en haut */}
      <ScrollToTop />
      <Footer />
    </>;
};

export default Index;

