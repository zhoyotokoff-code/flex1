import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';
import { useCMS } from '../context/CMSContext';

export default function Shop() {
  const { products, systemData } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const cmsCategories = useMemo(() => {
    return systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || ['t-shirts'];
  }, [systemData]);

  const subcategories = useMemo(() => {
    return systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || ['general'];
  }, [systemData]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'best-sellers') {
      result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    } else if (sortBy === 'a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return result;
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy, products]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isFetching) {
      setIsFetching(true);
      // Simulate API fetch delay
      setTimeout(() => {
        setDisplayCount(prev => prev + 12);
        setIsFetching(false);
      }, 600);
    }
  }, [isFetching]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    }
  }, [handleObserver]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">ALL COLLECTIONS</h1>
          <p className="text-text-secondary">Showing {filteredProducts.length} Premium Pieces</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:bg-white hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-border rounded-full px-6 py-3 text-xs uppercase font-bold tracking-widest focus:outline-none focus:border-white transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="best-sellers">Best Sellers</option>
              <option value="a-z">Name: A - Z</option>
              <option value="z-a">Name: Z - A</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transform group-hover:scale-110 transition-transform">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12 border-b border-white/5 pb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Categories */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Sectors</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                      !selectedCategory ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    All Sectors
                  </button>
                  {cmsCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat.toLowerCase()); setSelectedSubcategory(null); }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                        selectedCategory === cat.toLowerCase() ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Structural Subsets</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                      !selectedSubcategory ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    All Types
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub.toLowerCase())}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                        selectedSubcategory === sub.toLowerCase() ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Price Spectrum</p>
                  <p className="text-[10px] font-mono">₹{priceRange[0]} - ₹{priceRange[1]}</p>
                </div>
                <div className="pt-4 px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="15000" 
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between mt-2 text-[8px] text-text-secondary font-bold uppercase tracking-[0.2em]">
                    <span>Min</span>
                    <span>15K cap</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setPriceRange([0, 15000]);
                  setSortBy('newest');
                }}
                className="text-[9px] font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
        {displayedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {displayedProducts.length > 0 && displayedProducts.length < filteredProducts.length && (
        <div ref={loaderRef} className="py-12 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
          <h3 className="text-2xl font-bold mb-4 opacity-50">NO PIECES FOUND</h3>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-sm border-b border-white pb-1 font-bold tracking-widest hover:opacity-70 transition-opacity"
          >
            CLEAR ALL FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
