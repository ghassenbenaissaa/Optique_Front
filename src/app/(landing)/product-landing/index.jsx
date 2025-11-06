import PageMeta from '@/components/PageMeta';
import Cta from './components/Cta';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import VisionSection from './components/VisionSection';
import ShapeSection from './components/ShapeSection';
import RandomProductsSection from './components/RandomProductsSection';
import NewsletterCTA from '@/app/(landing)/product-grid/components/NewsletterCTA.jsx';
import ScrollToTop from '@/app/(landing)/product-grid/components/ScrollToTop.jsx';
import PromoBanner from '@/app/(landing)/product-grid/components/PromoBanner.jsx';

const Index = () => {
  return <>
      <PageMeta title="Product Landing" />
      <PromoBanner />
      <Navbar />
      <BannerCarousel />
      <VisionSection />
      <ShapeSection />
      <RandomProductsSection />
      <NewsletterCTA />
      <ScrollToTop />
      <Footer />
    </>;
};
export default Index;
