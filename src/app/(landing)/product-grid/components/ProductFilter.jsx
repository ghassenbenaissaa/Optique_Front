import { Link } from 'react-router';
import { LuChevronDown, LuChevronUp, LuSearch, LuX } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useState } from 'react';
const filterConfig = [{
  id: 'color',
  title: 'Color',
  options: [{
    id: 'color1',
    isColor: true
  }, {
    id: 'color2',
    isColor: true
  }, {
    id: 'color3',
    isColor: true
  }, {
    id: 'color4',
    isColor: true
  }, {
    id: 'color5',
    isColor: true
  }, {
    id: 'color6',
    isColor: true
  }, {
    id: 'color7',
    isColor: true
  }, {
    id: 'color8',
    isColor: true
  }, {
    id: 'color9',
    isColor: true
  }, {
    id: 'color10',
    isColor: true
  }, {
    id: 'color11',
    isColor: true
  }]
}, {
  id: 'price',
  title: 'Price',
  options: [{
    id: 'priceAll',
    label: 'All'
  }, {
    id: 'price1',
    label: '$0.00 – $110.00'
  }, {
    id: 'price2',
    label: '$110.00 – $220.00'
  }, {
    id: 'price3',
    label: '$220 - $330'
  }, {
    id: 'price4',
    label: '$330 - $550'
  }, {
    id: 'price5',
    label: '$550+'
  }, {
    id: 'price6',
    label: 'Low to High'
  }, {
    id: 'price7',
    label: 'High to Low'
  }]
}, {
  id: 'category',
  title: 'Product Category',
  options: [{
    id: 'categoryAll',
    label: 'All'
  }, {
    id: 'category1',
    label: 'Mobiles, Computers'
  }, {
    id: 'category2',
    label: 'TV, Appliances, Electronics'
  }, {
    id: 'category3',
    label: "Men's Fashion"
  }, {
    id: 'category4',
    label: "Women's Fashion"
  }, {
    id: 'category5',
    label: 'Home, Kitchen, Pets'
  }, {
    id: 'category6',
    label: 'Beauty, Health, Grocery'
  }, {
    id: 'category7',
    label: 'Books'
  }]
}, {
  id: 'rating',
  title: 'Rating',
  options: [{
    id: 'ratingAll',
    label: 'All'
  }, {
    id: 'rating5',
    label: '5 Rating'
  }, {
    id: 'rating4',
    label: '4 Rating and Up'
  }, {
    id: 'rating3',
    label: '3 Rating and Up'
  }, {
    id: 'rating2',
    label: '2 Rating and Up'
  }, {
    id: 'rating1',
    label: '1 Rating and Up'
  }, {
    id: 'rating0',
    label: '0 Rating'
  }]
}, {
  id: 'gender',
  title: 'Gender',
  options: [{
    id: 'genderAll',
    label: 'All'
  }, {
    id: 'gendermal',
    label: 'Male'
  }, {
    id: 'genderFemal',
    label: 'Female'
  }, {
    id: 'genderOthers',
    label: 'Other'
  }]
}];
const colorClasses = {
  color1: 'border border-primary bg-primary checked:bg-primary checked:border-primary',
  color2: 'border border-red-300 bg-red-300 checked:bg-red-300 checked:border-red-300',
  color3: 'border border-green-300 bg-green-300 checked:bg-green-300 checked:border-green-300',
  color4: 'border border-default-500 bg-default-500 checked:bg-default-500 checked:border-default-500',
  color5: 'border border-purple-500 bg-purple-500 checked:bg-purple-500 checked:border-purple-500',
  color6: 'border border-sky-500 bg-sky-500 checked:bg-sky-500 checked:border-sky-500',
  color7: 'border border-yellow-500 bg-yellow-500 checked:bg-yellow-500 checked:border-yellow-500',
  color8: 'border border-green-500 bg-green-500 checked:bg-green-500 checked:border-green-500',
  color9: 'border border-default-800 bg-default-800 checked:bg-default-800 checked:border-default-800',
  color10: 'border border-default-200 bg-default-200 checked:bg-default-200 checked:border-default-200',
  color11: 'border border-emerald-300 bg-emerald-300 checked:bg-emerald-300 checked:border-emerald-300'
};
const ProductFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <div className="relative group">
            <input
              type="text"
              className="ps-9 form-input form-input-sm w-full border-default-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 start-0 flex items-center z-20 ps-3">
              <LuSearch className="size-4 text-default-500 group-focus-within:text-primary transition-colors duration-300" />
            </div>
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 flex items-center z-20 pe-3 text-default-400 hover:text-danger transition-colors"
              >
                <LuX className="size-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="mt-6 hs-accordion-group" data-hs-accordion-always-open="">
          {filterConfig.map((section, index) => <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="hs-accordion active mt-6 first:mt-0"
              id={`hs-accordion-${section.id}`}
            >
              <button className="hs-accordion-toggle group inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-default-800 dark:text-default-200 rounded-lg text-base hover:text-primary transition-colors duration-300" aria-expanded="true" aria-controls={`hs-collapse-${section.id}`}>
                {section.title}
                <div className="relative">
                  <LuChevronDown size={18} className="text-base hs-accordion-active:hidden block group-hover:text-primary transition-colors" />
                  <LuChevronUp size={18} className="text-base hs-accordion-active:block hidden group-hover:text-primary transition-colors" />
                </div>
              </button>

              <div id={`hs-collapse-${section.id}`} className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby={`hs-accordion-${section.id}`}>
                <div className={`mt-4 flex ${section.id === 'color' ? 'flex-wrap gap-2' : 'flex-col gap-3'}`}>
                  {section.options.map((opt, optIndex) => opt.isColor ? (
                    <motion.label
                      key={opt.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + optIndex * 0.05 }}
                      className="relative cursor-pointer group"
                      htmlFor={opt.id}
                    >
                      <input
                        id={opt.id}
                        type="checkbox"
                        className={`size-7 cursor-pointer rounded-md focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:scale-110 ${colorClasses[opt.id]}`}
                      />
                      <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 pointer-events-none"></div>
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
                      />
                      <label
                        htmlFor={opt.id}
                        className="text-sm text-default-700 dark:text-default-300 align-middle cursor-pointer select-none group-hover:text-default-900 dark:group-hover:text-default-100 transition-colors duration-300"
                      >
                        {opt.label}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </motion.div>;
};
export default ProductFilter;
