import { Link } from 'react-router';
import { LuChevronRight, LuHouse } from 'react-icons/lu';
import { motion } from 'framer-motion';

const Breadcrumb = ({ productName, category }) => {
  const items = [
    { label: 'Accueil', href: '/', icon: LuHouse },
    { label: 'Produits', href: '/product' },
  ];

  if (category) {
    items.push({ label: category, href: `/product?category=${encodeURIComponent(category)}` });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center flex-wrap gap-2 text-sm"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <LuChevronRight className="w-4 h-4 text-default-400" />
          )}
          <Link
            to={item.href}
            className="flex items-center gap-1.5 text-default-600 dark:text-default-400 hover:text-primary transition-colors duration-200"
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            {item.label}
          </Link>
        </div>
      ))}

      {/* Élément actuel (non cliquable) */}
      <div className="flex items-center gap-2">
        <LuChevronRight className="w-4 h-4 text-default-400" />
        <span className="text-default-800 dark:text-default-200 font-medium truncate max-w-[200px] sm:max-w-none">
          {productName || 'Détails du produit'}
        </span>
      </div>
    </motion.nav>
  );
};

export default Breadcrumb;

