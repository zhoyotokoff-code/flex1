import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, Truck, ShieldCheck, RefreshCcw, Heart, Star, Send, Plus, Minus, AlertCircle, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PRODUCTS, REVIEWS } from '../constants';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../context/CartContext';

import { useCMS } from '../context/CMSContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, systemData } = useCMS();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState('details');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Local reviews state for demo
  const [localReviews, setLocalReviews] = useState(REVIEWS.filter(r => r.id === 'r1' || r.id === 'r2'));
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState<string | null>(null);

  const generateSchema = () => {
    if (!product) return null;
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "sku": product.id,
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": systemData.settings.currency || "INR",
        "price": product.price,
        "itemCondition": product.condition === 'New' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": systemData.settings.logoText || "USED FLEX."
        }
      }
    };
    return JSON.stringify(schema);
  };

  if (!product) return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">PIECE NOT FOUND</h1>
    </div>
  );

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.colors && !selectedColor) {
      alert('Please select a color');
      return;
    }

    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor || 'standard'}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor || 'Standard',
      quantity: quantity,
      image: product.images[0]
    });
    
    navigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (newReview.rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    if (!newReview.comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    const review = {
      id: `r-${Date.now()}`,
      userName: 'Guest User',
      rating: newReview.rating,
      comment: newReview.comment,
      productImage: product.images[0]
    };

    setLocalReviews([review, ...localReviews]);
    setNewReview({ rating: 0, comment: '' });
  };

  return (
    <div className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Helmet>
        <title>{`${product.name}${systemData.seo?.productTitleSuffix || ""}`}</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={`${product.name}${systemData.seo?.productTitleSuffix || ""}`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.images[0]} />
      </Helmet>
      {generateSchema() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateSchema() as string }} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-32 items-start">
        {/* Images Selection */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#242323] relative border border-white/5 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full relative cursor-zoom-in group/zoom"
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
                  const y = ((e.clientY - bounds.top) / bounds.height) * 100;
                  e.currentTarget.style.setProperty('--x', `${x}%`);
                  e.currentTarget.style.setProperty('--y', `${y}%`);
                }}
              >
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{ 
                     transformOrigin: 'var(--x, 50%) var(--y, 50%)',
                     scale: 'var(--scale, 1)' 
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget;
                    if(window.matchMedia('(hover: hover)').matches) {
                        img.style.setProperty('--scale', '1.5');
                    }
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.setProperty('--scale', '1');
                  }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === idx ? "border-white scale-95" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex flex-col lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-6 overflow-hidden">
              <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase font-bold tracking-[0.2em] flex-wrap">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span className="opacity-50">/</span>
                <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
                <span className="opacity-50">/</span>
                <Link to={`/categories`} className="hover:text-white transition-colors">{product.category}</Link>
                <span className="opacity-50">/</span>
                <span className="text-white">{product.name}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6 leading-tight tracking-tighter">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-3xl font-serif italic text-[#EDEDED]">₹{product.price.toLocaleString()}</p>
              {product.condition && product.condition !== 'New' && (
                <span className="bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-white/20">
                  {product.condition}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-12"
          >
            {/* Size Selector */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-text-secondary">Signature Fit</p>
              <div className="flex flex-wrap gap-4">
                {(systemData.storeConfig?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map((size) => {
                  const inStock = product.sizes.includes(size);
                  return (
                  <button
                    key={size}
                    onClick={() => inStock && setSelectedSize(size)}
                    disabled={!inStock}
                    className={cn(
                      "w-14 h-14 flex items-center justify-center border font-bold text-[10px] tracking-widest transition-all rounded-full relative overflow-hidden",
                      !inStock ? "border-white/5 text-white/20 cursor-not-allowed bg-black/20" :
                      selectedSize === size ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "border-white/10 hover:border-white/40 text-white/60"
                    )}
                  >
                    {size}
                    {!inStock && <div className="absolute inset-0 w-full h-full border-t border-white/10 transform rotate-45 origin-center scale-150 top-1/2 -translate-y-1/2"></div>}
                  </button>
                )})}
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4 text-text-secondary">Select Color: <span className="text-white ml-2">{selectedColor || 'None'}</span></p>
                <div className="flex flex-wrap gap-4">
                  {(systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || ['Void', 'Cinder', 'Ghost']).map((colorName) => {
                    const inStock = product.colors!.includes(colorName);
                    // generate a deterministic hex for the colour name so it looks nice
                    const hash = colorName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
                    const h = Math.abs(hash) % 360;
                    const hex = colorName.toLowerCase() === 'void' || colorName.toLowerCase() === 'black' ? '#000000' : colorName.toLowerCase() === 'white' ? '#FFFFFF' : `hsl(${h}, 20%, 50%)`;
                    return (
                    <button
                      key={colorName}
                      onClick={() => inStock && setSelectedColor(colorName)}
                      disabled={!inStock}
                      className={cn(
                        "group relative flex items-center justify-center w-10 h-10 rounded-full transition-all overflow-hidden",
                        !inStock ? "opacity-30 cursor-not-allowed grayscale" :
                        selectedColor === colorName ? "ring-2 ring-white ring-offset-4 ring-offset-bg" : "hover:scale-110"
                      )}
                      title={colorName + (!inStock ? ' - Out of Stock' : '')}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-border/50" 
                        style={{ backgroundColor: hex }}
                      />
                      {!inStock && <div className="absolute inset-0 w-full h-full border-t border-white/50 transform rotate-45 origin-center scale-150 top-1/2 -translate-y-1/2"></div>}
                    </button>
                  )})}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4 text-text-secondary">Quantity</p>
                <div className="flex items-center gap-4 bg-card border border-border w-fit p-1 rounded-xl">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg transition-colors text-text-secondary hover:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold font-display text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg transition-colors text-text-secondary hover:text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">In Stock - Ready to Ship</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 my-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-6 bg-white text-black font-display font-bold uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/10"
            >
              <ShoppingBag size={20} />
              ADD TO BAG
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "w-full py-6 border transition-all font-display font-bold uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-3",
                isWishlisted 
                  ? "bg-red-500 border-red-500 text-white" 
                  : "border-border text-white hover:bg-white hover:text-black"
              )}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
            </motion.button>
            
            {/* Shipping Info */}
            <div className="pt-4 flex flex-col gap-3">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <Truck className="shrink-0 text-text-secondary mt-1" size={20} />
                <div>
                  <p className="text-white text-sm font-bold mb-1">Standard Delivery (3-5 Business Days)</p>
                  <p className="text-text-secondary text-xs">Free shipping on all orders over ₹2,999</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-border mt-12">
            <div className="flex gap-8 border-b border-white/5 pb-4">
              {['details', 'materials', 'sizing'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveInfoTab(tab)}
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-[0.3em] transition-all relative pb-4",
                    activeInfoTab === tab ? "text-white" : "text-text-secondary hover:text-white"
                  )}
                >
                  {tab === 'materials' ? 'Materials & Care' : tab === 'sizing' ? 'Sizing Guide' : 'Details'}
                  {activeInfoTab === tab && (
                    <motion.div layoutId="activeInfoTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px] py-4">
              <AnimatePresence mode="wait">
                {activeInfoTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <p className="text-text-secondary leading-relaxed text-sm">{product.description}</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-text-secondary text-[10px] uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Signature oversized silhouette
                      </li>
                      <li className="flex items-center gap-3 text-text-secondary text-[10px] uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Drop-shoulder construction
                      </li>
                      <li className="flex items-center gap-3 text-text-secondary text-[10px] uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Heavyweight cotton blend
                      </li>
                    </ul>
                  </motion.div>
                )}

                {activeInfoTab === 'materials' && (
                  <motion.div
                    key="materials"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                   >
                    <div>
                      <p className="text-white text-[10px] uppercase font-bold tracking-widest mb-2">Fabric Matrix</p>
                      <p className="text-text-secondary text-sm leading-relaxed">80% High-Density Cotton, 20% Technical Poly-fiber. Pre-shrunk and custom washed for a vintage structure.</p>
                    </div>
                    <div>
                      <p className="text-white text-[10px] uppercase font-bold tracking-widest mb-2">Care Instructions</p>
                      <p className="text-text-secondary text-sm leading-relaxed">Cold machine wash inside out. Do not tumble dry. Iron on low heat if necessary. Wear with intent.</p>
                    </div>
                  </motion.div>
                )}

                {activeInfoTab === 'sizing' && (
                  <motion.div
                    key="sizing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px] uppercase tracking-widest font-bold">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-2 text-text-secondary">Size</th>
                            <th className="py-2 text-text-secondary">Chest (CM)</th>
                            <th className="py-2 text-text-secondary">Length (CM)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <tr>
                            <td className="py-4">Small</td>
                            <td className="py-4">112</td>
                            <td className="py-4">70</td>
                          </tr>
                          <tr>
                            <td className="py-4">Medium</td>
                            <td className="py-4">118</td>
                            <td className="py-4">72</td>
                          </tr>
                          <tr>
                            <td className="py-4">Large</td>
                            <td className="py-4">124</td>
                            <td className="py-4">74</td>
                          </tr>
                          <tr>
                            <td className="py-4">X-Large</td>
                            <td className="py-4">130</td>
                            <td className="py-4">76</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] text-text-secondary italic">Fits true to our architectural oversized design. Scale down for a more standard fit.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              <div className="flex items-center gap-3 text-text-secondary">
                <Truck size={18} />
                <span className="text-xs uppercase font-medium tracking-widest">Free Shipping Over ₹2999</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <ShieldCheck size={18} />
                <span className="text-xs uppercase font-medium tracking-widest">100% Quality Assurance</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <RefreshCcw size={18} />
                <span className="text-xs uppercase font-medium tracking-widest">Easy Returns & Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-32">
        <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-12 border-b border-border pb-6">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            {localReviews.length > 0 ? (
              localReviews.map((review) => (
                <div key={review.id} className="bg-card p-8 rounded-2xl border border-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-1 mb-2 text-white">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm font-bold uppercase tracking-widest">{review.userName}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Verified Purchase</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary uppercase tracking-widest text-center py-20 bg-card/10 rounded-2xl border border-dashed border-border">No reviews yet. Be the first to share your experience!</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-card p-8 rounded-2xl border border-border sticky top-32">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Leave a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-6">
              {reviewError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest"
                >
                  <AlertCircle size={14} />
                  {reviewError}
                </motion.div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setNewReview(prev => ({ ...prev, rating: star }));
                        setReviewError(null);
                      }}
                      className={cn(
                        "p-1 transition-all hover:scale-110",
                        newReview.rating >= star ? "text-white" : "text-neutral-700"
                      )}
                    >
                      <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Your Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => {
                    setNewReview(prev => ({ ...prev, comment: e.target.value }));
                    setReviewError(null);
                  }}
                  placeholder="Tell us about the fit, quality..."
                  rows={4}
                  className={cn(
                    "w-full bg-bg border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-colors resize-none",
                    reviewError && !newReview.comment.trim() ? "border-red-500/50" : "border-border"
                  )}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-display font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors rounded-lg shadow-xl shadow-white/5"
              >
                <Send size={16} /> SUBMIT REVIEW
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-12 border-b border-border pb-6">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

