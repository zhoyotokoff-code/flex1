import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function WishlistSharedPage() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids') || '';
  const { products } = useCMS();

  const sharedItems = useMemo(() => {
    const idArray = ids.split(',').filter(id => id.trim() !== '');
    return products.filter(p => idArray.includes(p.id));
  }, [ids, products]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 border-b border-white/5 pb-12">
        <span className="text-[10px] uppercase font-bold tracking-[1em] text-text-secondary mb-4 block">Shared Selection</span>
        <h1 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter leading-none uppercase">
          Curated Archive
        </h1>
        <p className="text-text-secondary mt-4">
          Exploring a shared structural vision containing {sharedItems.length} artifacts.
        </p>
      </div>

      {sharedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-y-12">
          {sharedItems.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-card rounded-3xl border border-dashed border-border px-6">
          <h3 className="text-2xl font-bold mb-4 opacity-50 uppercase tracking-widest">Archive Link Invalid</h3>
          <p className="text-text-secondary max-w-md mx-auto">
            The shared wishlist link appears to be broken or has no structural references.
          </p>
        </div>
      )}
      
      <div className="mt-24 pt-12 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-text-secondary mb-8">Ready to start your own collection?</p>
        <motion.a
          href="/shop"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full"
        >
          Explore Full Archive
        </motion.a>
      </div>
    </div>
  );
}
