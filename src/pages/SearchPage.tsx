import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useCMS();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, products]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter uppercase">
          Search Results
        </h1>
        <p className="text-text-secondary">
          {results.length > 0 
            ? `Found ${results.length} results for "${query}"`
            : query 
              ? `No artifacts found for "${query}"`
              : "Enter a search term to explore the archive"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12"
          >
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
              <span className="text-4xl">∅</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 opacity-50 uppercase tracking-widest">Architectural Silence</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Your query returned no matches in our current registry. Try searching for "Tee", "Pants", or specific collection names.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
