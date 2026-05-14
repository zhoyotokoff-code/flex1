import React from 'react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import { useCMS } from '../context/CMSContext';

export default function NewArrivals() {
  const { products } = useCMS();
  const newProducts = products.filter(p => p.newArrival);

  return (
    <div className="pt-32 pb-24 overflow-hidden">
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-[10px] uppercase font-bold tracking-[1em] text-text-secondary mb-4 block">Seasonal Update</span>
          <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter mb-8 leading-none">Fresh Cuts</h1>
        </motion.div>
      </div>

      <Marquee text="NEW DROP IS LIVE • SEASON 01 ARCHIVE" speed={30} className="bg-white/5 border-y border-white/5 mb-24" />

      <div className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
        {newProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-32">
        <Marquee text="STAY AHEAD • LIMITED QUANTITIES" speed={20} direction="right" />
      </div>
    </div>
  );
}
