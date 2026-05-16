import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CategoryCircle from '../components/CategoryCircle';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import { CATEGORIES, PRODUCTS, REVIEWS, STORES } from '../constants';
import { cn } from '../lib/utils';
import { useCMS } from '../context/CMSContext';

export default function Home() {
  const { systemData, products, stores } = useCMS();
  const [reviews, setReviews] = useState(REVIEWS);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const savedReviews = localStorage.getItem('archive_user_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error("Failed to parse reviews");
      }
    }
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const reviewToAdd = {
        id: `ur-${Date.now()}`,
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        productId: 'general',
        productImage: featuredProducts[0].images[0]
      };
      
      const updatedReviews = [reviewToAdd, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem('archive_user_reviews', JSON.stringify(updatedReviews));
      setNewReview({ userName: '', rating: 5, comment: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>{systemData.seo?.homeTitle || "USED FLEX. SHEETS MARKET"}</title>
        <meta name="description" content={systemData.seo?.homeDescription || "Redefining modern masculinity with luxury streetwear."} />
        <meta property="og:title" content={systemData.seo?.homeTitle || "USED FLEX. SHEETS MARKET"} />
        <meta property="og:description" content={systemData.seo?.homeDescription || "Redefining modern masculinity with luxury streetwear."} />
        <meta property="og:image" content={systemData.seo?.homeOgImage || systemData.hero.backgroundImage} />
      </Helmet>
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1c1b1b]">
        {/* Fullscreen Video/Image Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0 bg-[#000]"
        >
          <img 
            src={systemData.hero.backgroundImage} 
            alt="Cinematic Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              <span className="text-[#EDEDED] text-[10px] md:text-xs uppercase font-bold tracking-[1em] opacity-60">
                {systemData.hero.subtitle}
              </span>
            </motion.div>

            <div className="mb-12 w-full">
              <div className="overflow-hidden mb-2">
                <motion.h1 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                  className="text-5xl md:text-[10vw] font-serif italic text-[#EDEDED] leading-none tracking-tighter"
                >
                  {systemData.hero.titlePrimary}
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
                  className="text-5xl md:text-[8vw] font-display font-bold text-white leading-none tracking-tighter uppercase break-words"
                >
                  {systemData.hero.titleSecondary}
                </motion.h1>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-14 py-6 bg-white text-black font-display font-bold uppercase text-[10px] tracking-[0.5em] rounded-full overflow-hidden"
                >
                  <span className="relative z-10">{systemData.hero.ctaText}</span>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-[#EDEDED]"
                  />
                </motion.button>
              </Link>
              <Link to="/shop" className="text-white/40 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-3">
                Watch Film <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Side Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute right-12 bottom-24 hidden lg:flex flex-col gap-12 text-right"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Latitude</p>
            <p className="font-serif italic text-lg">22.57° N</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Series</p>
            <p className="font-serif italic text-lg">ARK-01</p>
          </div>
        </motion.div>

        {/* Scroll Callout */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-12 bg-white"
          />
        </motion.div>
      </section>

      {/* Narrative Marquee */}
      <Marquee text={systemData.marquee.text} speed={40} className="bg-white/5 border-b border-white/5" />
      <Marquee text="CRAFTED IN THE SOUTH • ARCHITECTURAL INTEGRITY • GLOBAL SILHOUETTE" speed={30} direction="right" className="bg-white/5 border-b border-white/5 -mt-px" />

      {/* Cinematic Lookbook Section */}
      <section className="py-0 relative overflow-hidden bg-[#1c1b1b]">
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative h-[80vh] flex items-center justify-center overflow-hidden"
          >
            <motion.img 
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              src={systemData.lookbook.mainImage} 
              className="absolute inset-0 w-full h-full object-cover"
              alt="Lookbook 1"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 text-center px-6">
              <span className="text-[10px] uppercase font-bold tracking-[1.5em] text-[#EDEDED]/60 mb-8 block">The Collection</span>
              <h2 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter leading-none mb-12">{systemData.lookbook.mainTitle}</h2>
              <div className="flex justify-center">
                <Link to="/shop" className="px-12 py-5 border border-white/20 text-white text-[10px] uppercase font-bold tracking-[0.4em] rounded-full hover:bg-white hover:text-black transition-all">
                  Browse Series
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1">
            <motion.div 
              style={{ rotate: -1 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true }}
              className="relative h-[60vh] overflow-hidden group"
            >
              <img 
                src={systemData.lookbook.secondaryImage1} 
                className="w-full h-full object-cover transition-all duration-1000" 
                alt="Lookbook 2"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 transition-all" />
              <div className="absolute bottom-12 left-12">
                <p className="font-serif italic text-2xl text-white">Shadow <span className="text-sm uppercase tracking-widest font-sans font-bold not-italic ml-4 opacity-50">001</span></p>
              </div>
            </motion.div>
            <motion.div 
              style={{ rotate: 1 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true }}
              className="relative h-[60vh] overflow-hidden group"
            >
              <img 
                src={systemData.lookbook.secondaryImage2} 
                className="w-full h-full object-cover transition-all duration-1000" 
                alt="Lookbook 3"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 transition-all" />
              <div className="absolute bottom-12 right-12 text-right">
                <p className="font-serif italic text-2xl text-white">Form <span className="text-sm uppercase tracking-widest font-sans font-bold not-italic ml-4 opacity-50">002</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Horizontal Menu - Sticky & Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-10 border-b border-white/5 sticky top-16 bg-bg/80 backdrop-blur-2xl z-40"
      >
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-12 min-w-max md:justify-center">
            {['All Series', ...(systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || ['T-Shirts', 'Pants', 'Shoes'])].map((cat) => (
              <Link 
                key={cat} 
                to="/shop" 
                className="group relative text-[10px] uppercase font-bold tracking-[0.4em] text-text-secondary hover:text-white transition-all"
              >
                {cat}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Grid - Reveal on Scroll */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto" id="featured">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-baseline gap-6 mb-20 border-b border-white/10 pb-12"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-text-secondary mb-4 block">Curated Series</span>
            <h2 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">Core Artifacts</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-white transition-colors">
            Explore Collection <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}><ArrowRight size={14} /></motion.div>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
          {featuredProducts.map((p, idx) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Guest Reviews & Submission */}
      <section className="py-32 px-6 md:px-12 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Display Column */}
            <div className="lg:w-2/3">
              <div className="mb-16">
                <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-text-secondary mb-4 block">Feedback Registry</span>
                <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter leading-none">Voices from the Archive</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 bg-card rounded-3xl border border-white/5 space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={cn(i < review.rating ? "text-white fill-white" : "text-white/20")} />
                        ))}
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Verified User</span>
                    </div>
                    <p className="text-sm italic font-serif text-[#EDEDED] leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] uppercase">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white">{review.userName}</p>
                        <p className="text-[8px] text-text-secondary uppercase">Artifact Enthusiast</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:w-1/3">
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 sticky top-32">
                <h3 className="text-2xl font-serif italic mb-8 text-white uppercase tracking-tight">Add Your Voice</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Display Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Identificator..."
                      value={newReview.userName}
                      onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                      className="w-full bg-card border border-white/10 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest text-white focus:border-white transition-all outline-none uppercase placeholder:text-white/10" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Rating Select</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: num})}
                          className={cn(
                            "w-10 h-10 rounded-full border flex items-center justify-center transition-all text-xs font-bold",
                            newReview.rating >= num ? "bg-white text-black border-white" : "bg-transparent border-white/10 text-white/40"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Commentary</label>
                    <textarea 
                      required
                      rows={4} 
                      placeholder="Describe your structural experience..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full bg-card border border-white/10 px-6 py-4 rounded-2xl text-sm italic font-serif text-white focus:border-white transition-all outline-none resize-none placeholder:text-white/10" 
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-white text-black font-bold uppercase text-[10px] tracking-[0.5em] rounded-full flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Transmit Review"}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ethos - Large Typography & Depth */}
      <section className="py-48 relative overflow-hidden bg-[#1c1b1b]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.01, 0.04, 0.01],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-[1200px] h-[1200px] border border-white/5 rounded-full" 
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] uppercase font-bold tracking-[1.5em] text-text-secondary mb-20 block">{systemData.manifesto.subtitle}</span>
            <h2 
              className="text-4xl md:text-[7vw] font-serif italic text-white leading-[0.85] mb-20 tracking-tighter"
              dangerouslySetInnerHTML={{ __html: systemData.manifesto.text }}
            />
            <div className="h-40 w-[1px] bg-gradient-to-b from-white/20 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Categorical Banners - Depth & Parallax Zoom */}
      <section className="py-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="group relative h-[700px] rounded-[2.5rem] overflow-hidden border border-white/5"
        >
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src={systemData.banners.banner1Image} 
            className="w-full h-full object-cover transition-all duration-1000" 
            alt="Category 1"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 
                className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-6 italic"
                dangerouslySetInnerHTML={{ __html: systemData.banners.banner1Title }}
              />
              <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                Explore Series <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="group relative h-[700px] rounded-[2.5rem] overflow-hidden border border-white/5"
        >
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src={systemData.banners.banner2Image} 
            className="w-full h-full object-cover transition-all duration-1000" 
            alt="Category 2"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 
                className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-6 italic"
                dangerouslySetInnerHTML={{ __html: systemData.banners.banner2Title }}
              />
              <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                Explore Series <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Flagships - Motion & Interactions */}
      <section className="py-40 bg-card relative overflow-hidden" id="stores">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <span className="text-[10px] uppercase font-bold tracking-[1em] text-text-secondary mb-6 block">Physical Presence</span>
            <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter italic">Flagships</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {stores.map((store, idx) => (
              <motion.div 
                key={store.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[3/4] md:aspect-square rounded-[3rem] overflow-hidden bg-bg/50 border border-white/5"
              >
                <img 
                  src={store.image} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                  alt={store.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
                  <h3 className="text-3xl md:text-5xl font-display font-bold mb-4 uppercase tracking-tighter italic">{store.name}</h3>
                  <p className="flex items-center gap-3 text-text-secondary text-sm mb-10 font-medium"><MapPin size={16} /> {store.location}</p>
                  <div className="flex items-center gap-6">
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all text-center"
                    >
                      Directions
                    </motion.a>
                    <motion.a 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      href={`https://wa.me/${store.whatsapp}`} 
                      className="p-4 bg-white/10 backdrop-blur-2xl text-white rounded-full hover:bg-white hover:text-black transition-all border border-white/10 shadow-xl"
                    >
                      <MessageSquare size={20} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto border-t border-white/5">
        <div className="mb-20 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-text-secondary mb-4 block">Knowledge Base</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter leading-none">Frequently Asked</h2>
        </div>
        <div className="space-y-6">
          {(systemData.faqs || []).map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group border-b border-white/10 pb-6"
            >
              <h3 className="text-xl font-serif italic text-white mb-4 group-hover:text-[#EDEDED]/70 transition-colors">{faq.question}</h3>
              <p className="text-text-secondary text-base leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Wrap up */}
      <section className="py-48 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-9xl font-display font-bold tracking-tighter mb-16 italic text-white/90">
            ENTER THE<br />7’O CLOCK<br />CIRCUIT
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-6 bg-white text-black font-display font-bold uppercase text-xs tracking-[0.5em] rounded-full"
              >
                Join Series
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
