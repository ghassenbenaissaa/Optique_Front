import PageMeta from '@/components/PageMeta';
import Cta from './components/Cta';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import BannerCarousel from './components/BannerCarousel';
import VisionSection from './components/VisionSection';
import ShapeSection from './components/ShapeSection';
import RandomProductsSection from './components/RandomProductsSection';

const Index = () => {
  return <>
      <PageMeta title="Product Landing" />
      <PromoBanner />
      <Navbar />
      <BannerCarousel />
      <VisionSection />
      <ShapeSection />
      <RandomProductsSection />
      <Cta />
      <Footer />
    </>;
};
export default Index;
