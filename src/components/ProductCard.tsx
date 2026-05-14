import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#242323] border border-white/5 group-hover:border-white/10 transition-all duration-700 shadow-2xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <Link to={`/product/${product.id}`} className="block h-full">
          {/* Main Image */}
          <motion.img
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          
          {/* Hover Image */}
          {product.images[1] && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={product.images[1]}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Minimal Cursor Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">View</span>
            </motion.div>
          </div>
        </Link>

        {/* Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.newArrival && (
            <span className="bg-white/90 backdrop-blur-md text-black text-[8px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
              New Arrival
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-neutral-900 border border-white/10 backdrop-blur-md text-white text-[8px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
              Cult Favorite
            </span>
          )}
        </div>

        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="p-2.5 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all border border-white/5 active:scale-90 shadow-xl"
            title="Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
            className="p-2.5 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all border border-white/5 active:scale-90 shadow-xl"
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2 px-2">
        <div className="flex justify-between items-baseline">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-medium leading-none">
            {product.category}
          </p>
          <p className="text-sm font-serif italic leading-none opacity-80">₹{product.price.toLocaleString()}</p>
        </div>
        <Link 
          to={`/product/${product.id}`}
          className="block text-xl font-serif italic text-white tracking-tight hover:opacity-70 transition-opacity leading-tight"
        >
          {product.name}
        </Link>
      </div>

      {/* Quick View Modal */}
      {createPortal(
        <AnimatePresence>
          {isQuickViewOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-[#1c1b1b] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 z-10 flex flex-col md:flex-row max-h-[90vh]"
              >
                <button
                  onClick={() => setIsQuickViewOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full transition-colors z-20 text-white"
                >
                  <X size={20} />
                </button>
                
                <div className="w-full md:w-1/2 h-64 md:h-auto shrink-0 relative bg-black">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="p-8 md:p-12 overflow-y-auto flex flex-col justify-center flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-secondary mb-4">{product.category}</p>
                  <h3 className="text-3xl font-serif italic text-white mb-2 leading-tight">{product.name}</h3>
                  <p className="text-xl font-sans font-light mb-6 opacity-90">₹{product.price.toLocaleString()}</p>
                  <p className="text-text-secondary leading-relaxed mb-8 text-sm">{product.description}</p>
                  
                  <div className="mt-auto pt-4 flex gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="w-12 shrink-0 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                    >
                      <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-white text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors text-center"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default ProductCard;
