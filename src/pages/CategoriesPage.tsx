import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function CategoriesPage() {
  const { systemData } = useCMS();

  const activeCategories = useMemo(() => {
    const rawCategories = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean);
    if (!rawCategories || rawCategories.length === 0) return CATEGORIES;

    const rawSubcategories = systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || [];

    return rawCategories.map(catName => {
      const existing = CATEGORIES.find(c => c.name.toLowerCase() === catName.toLowerCase());
      return {
        id: existing ? existing.id : catName.toLowerCase().replace(/\s+/g, '-'),
        name: catName,
        image: existing ? existing.image : 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800', // fallback image
        description: existing ? existing.description : `Explore our premium ${catName} collection.`,
        subcategories: rawSubcategories,
      };
    });
  }, [systemData]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter mb-4">Series</h1>
        <p className="text-text-secondary uppercase tracking-[0.5em] text-xs">Architectural Categories</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/5 bg-card"
          >
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h2 className="text-4xl font-serif italic text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">{category.name}</h2>
              <p className="text-text-secondary text-sm mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                {category.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {category.subcategories?.map(sub => (
                  <span key={sub} className="text-[8px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/60">
                    {sub}
                  </span>
                ))}
              </div>

              <Link to="/shop" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                Explore Series <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
