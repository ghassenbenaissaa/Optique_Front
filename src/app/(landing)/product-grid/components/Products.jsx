import product01 from '@/assets/images/product/img-01.png';
import product02 from '@/assets/images/product/img-02.png';
import product03 from '@/assets/images/product/img-03.png';
import product04 from '@/assets/images/product/img-04.png';
import product05 from '@/assets/images/product/img-05.png';
import product06 from '@/assets/images/product/img-06.png';
import product08 from '@/assets/images/product/img-08.png';
import product10 from '@/assets/images/product/img-10.png';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuEllipsis, LuEye, LuHeart, LuLayoutGrid, LuList, LuShoppingCart, LuSquarePen, LuStar, LuStarHalf, LuTrash2, LuX } from 'react-icons/lu';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [{
    id: 1,
    name: 'Mesh Ergonomic Black Chair',
    image: product02,
    rating: 4.5,
    reviews: 198,
    price: 674.12,
    originalPrice: 784.09,
    isFavorite: true
  }, {
    id: 2,
    name: 'Fastcolors Typography Men',
    image: product03,
    rating: 4.5,
    reviews: 1150,
    price: 341.99,
    originalPrice: 784.09,
    isFavorite: false
  }, {
    id: 3,
    name: 'Mesh Ergonomic Green Chair',
    image: product04,
    rating: 3.5,
    reviews: 29,
    price: 362.2,
    originalPrice: 599.99,
    isFavorite: false
  }, {
    id: 4,
    name: 'Techel Black Bluetooth Sound.',
    image: product05,
    rating: 4.5,
    reviews: 1324,
    price: 249.99,
    originalPrice: 399.99,
    isFavorite: true
  }, {
    id: 5,
    name: 'Bovet Fleurier AIFSQ029',
    image: product06,
    rating: 4.5,
    reviews: 1324,
    price: 496.16,
    originalPrice: null,
    isFavorite: false
  }, {
    id: 6,
    name: 'Roar Twill Blue Baseball Cap',
    image: product08,
    rating: 2.5,
    reviews: 485,
    price: 674.12,
    originalPrice: 784.99,
    isFavorite: true
  }, {
    id: 7,
    name: 'Smartest Printed T-shirt',
    image: product01,
    rating: 3.5,
    reviews: 5321,
    price: 89.99,
    originalPrice: null,
    isFavorite: false
  }, {
    id: 8,
    name: 'Crop tops for Women western.',
    image: product10,
    rating: 4.5,
    reviews: 1551,
    price: 145,
    originalPrice: 299.99,
    isFavorite: true
  }];

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<LuStar key={i} className="size-4 fill-yellow-500 text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<LuStarHalf key={i} className="size-4 fill-yellow-500 text-yellow-500" />);
      } else {
        stars.push(<LuStar key={i} className="size-4 text-yellow-500" />);
      }
    }
    return stars;
  };

  return <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-3 col-span-1"
    >
      {/* En-tête avec filtres et vue */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between gap-2 flex-wrap items-center bg-default-50 dark:bg-default-900/20 p-4 rounded-lg border border-default-200 dark:border-default-700"
      >
        <div className="flex gap-3 items-center">
          <div className="hs-dropdown relative inline-flex">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="hs-dropdown-toggle inline-flex items-center btn btn-sm bg-white dark:bg-default-800 border border-primary text-primary transition-all duration-300 hover:bg-primary hover:text-white shadow-sm hover:shadow-md"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              Trier par: <b className="font-medium ml-1">Prix décroissant</b>
              <LuChevronDown className="size-4 ms-2" />
            </motion.button>
            <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 card z-30 mt-2 p-2 text-sm shadow-lg" role="menu">
              <Link className="flex items-center gap-x-3.5 py-2 font-medium px-4 text-default-600 hover:bg-primary/10 hover:text-primary rounded transition-all duration-200" to="">
                Prix croissant
              </Link>
              <Link className="flex items-center gap-x-3.5 py-2 font-medium px-4 text-default-600 hover:bg-primary/10 hover:text-primary rounded transition-all duration-200" to="">
                Prix décroissant
              </Link>
            </div>
          </div>

          <nav className="flex gap-x-1 bg-default-100 dark:bg-default-800 p-1 rounded-lg" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className={`btn size-8 transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-default-500 hover:text-primary'}`}
              onClick={() => setViewMode('grid')}
            >
              <LuLayoutGrid className="size-4" />
            </motion.button>
          </nav>
        </div>
      </motion.div>

      {/* Tags actifs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center mt-4 gap-2 flex-wrap"
      >
        {['Prix décroissant', 'Nouveau', 'Bestseller'].map((tag, idx) => (
          <motion.span
            key={tag}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
          >
            {tag}
            <Link to="#" className="hover:text-danger transition-colors duration-200">
              <LuX className="size-3" />
            </Link>
          </motion.span>
        ))}

        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="#" className="py-1.5 px-3 text-xs font-medium rounded-full transition-all duration-300 hover:bg-danger/10 hover:text-danger text-default-600">
            Tout effacer
          </Link>
        </motion.span>
      </motion.div>

      {/* Grille de produits */}
      <motion.div
        layout
        className={`grid ${viewMode === 'grid' ? 'lg:grid-cols-4 md:grid-cols-2' : 'grid-cols-1'} gap-5 mt-6`}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                layout: { duration: 0.3 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className="card group overflow-hidden border border-default-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="card-body relative overflow-hidden bg-default-50 dark:bg-default-900/30">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badge Promotion */}
                {product.originalPrice && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="absolute top-4 start-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold"
                  >
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </motion.div>
                )}

                {/* Icône Favori */}
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-4 end-4 size-9 flex items-center justify-center rounded-full bg-white dark:bg-default-800 shadow-md transition-all duration-300 ${
                    product.isFavorite 
                      ? 'text-danger' 
                      : 'text-default-500 hover:text-danger'
                  }`}
                >
                  <LuHeart className={`size-5 ${product.isFavorite ? 'fill-danger' : ''}`} />
                </motion.button>

                {/* Quick Actions au survol */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    y: hoveredProduct === product.id ? 0 : 20
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 start-4 end-4 flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 btn btn-sm bg-white dark:bg-default-800 text-primary border border-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <LuEye className="size-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 btn btn-sm bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                  >
                    <LuShoppingCart className="size-4" />
                  </motion.button>
                </motion.div>
              </div>

              <div className="pb-5 px-5">
                <h6 className="text-base text-default-800 dark:text-default-200 font-semibold hover:text-primary transition-all mb-2 line-clamp-2 min-h-[3rem]">
                  <Link to="#">{product.name}</Link>
                </h6>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
                  <span className="text-default-500 text-sm">({product.reviews})</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h5 className="text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </h5>
                  {product.originalPrice && (
                    <small className="line-through font-medium text-default-500">
                      ${product.originalPrice.toFixed(2)}
                    </small>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-primary text-primary border-dashed btn hover:bg-primary hover:text-white hover:border-solid transition-all duration-300"
                  >
                    <LuShoppingCart className="size-4 mr-2" />
                    Ajouter
                  </motion.button>

                  <div className="hs-dropdown relative inline-flex">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="hs-dropdown-toggle btn size-10 bg-default-100 hover:bg-primary text-default-500 hover:text-white transition-all duration-300"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Dropdown"
                    >
                      <LuEllipsis className="size-5" />
                    </motion.button>
                    <div className="hs-dropdown-menu shadow-lg" role="menu">
                      <Link className="flex items-center gap-2 py-2 font-medium px-3 text-default-500 hover:bg-primary/10 hover:text-primary rounded transition-all duration-200" to="#">
                        <LuEye className="size-4" />
                        Voir détails
                      </Link>
                      <Link className="flex items-center gap-2 py-2 font-medium px-3 text-default-500 hover:bg-primary/10 hover:text-primary rounded transition-all duration-200" to="#">
                        <LuSquarePen className="size-4" />
                        Modifier
                      </Link>
                      <Link className="flex items-center gap-2 py-2 font-medium px-3 text-danger hover:bg-danger/10 rounded transition-all duration-200" to="#">
                        <LuTrash2 className="size-4" />
                        Supprimer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex flex-wrap md:justify-between justify-center md:gap-0 gap-4 mt-8 p-4 bg-default-50 dark:bg-default-900/20 rounded-lg border border-default-200 dark:border-default-700"
      >
        <p className="text-default-500 dark:text-default-400 text-sm flex items-center">
          Affichage de <b className="text-primary mx-1">07</b> sur <b className="text-primary mx-1">19</b> résultats
        </p>

        <nav className="flex items-center gap-2" aria-label="Pagination">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="btn btn-sm border bg-white dark:bg-default-800 border-default-200 text-default-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            <LuChevronLeft className="size-4 me-1" /> Préc.
          </motion.button>

          {[1, 2, 3].map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className={`btn size-9 transition-all duration-300 ${
                page === 2
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-default-800 border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
              }`}
            >
              {page}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="btn btn-sm border bg-white dark:bg-default-800 border-default-200 text-default-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            Suiv. <LuChevronRight className="size-4 ms-1" />
          </motion.button>
        </nav>
      </motion.div>
    </motion.div>;
};
export default Products;
