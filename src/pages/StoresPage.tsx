import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function StoresPage() {
  const { stores, systemData } = useCMS();
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 text-center md:text-left"
      >
        <span className="text-[10px] uppercase font-bold tracking-[1em] text-text-secondary mb-4 block">Physical Presence</span>
        <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter mb-4 leading-none">The Network</h1>
      </motion.div>

      {systemData.settings.mapXml && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full aspect-[21/9] bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden mb-32 child-iframe-full shadow-2xl"
          dangerouslySetInnerHTML={{ __html: systemData.settings.mapXml }}
        />
      )}

      <div className="grid grid-cols-1 gap-32">
        {stores.map((store, idx) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
          >
            <div className="w-full md:w-1/2 aspect-[16/10] overflow-hidden rounded-[3rem] border border-white/5 group relative">
              <img 
                src={store.image} 
                alt={store.name} 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {store.status === 'coming_soon' && (
                <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center">
                  <div className="text-center group-hover:scale-110 transition-transform duration-500 bg-black/40 backdrop-blur-md p-6 rounded-3xl">
                    <Clock className="mx-auto mb-4 text-[#EDEDED]/40" size={40} />
                    <p className="text-[10px] uppercase tracking-[1em] font-bold">Unlocking Soon</p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter uppercase">{store.name}</h2>
                 <p className="flex items-center gap-3 text-text-secondary font-medium tracking-wide">
                   <MapPin size={18} /> {store.location}
                 </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-text-secondary mb-4">Store Collections</p>
                <div className="flex flex-wrap gap-4">
                  {store.specialties.map(spec => (
                    <span key={spec} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {store.mapUrl && store.mapUrl.includes('<iframe') && (
                <div 
                  className="w-full aspect-video mt-8 rounded-2xl overflow-hidden grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500 iframe-container"
                  dangerouslySetInnerHTML={{ __html: store.mapUrl }} 
                />
              )}
              
              <div className="flex items-center gap-6 pt-8">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={store.mapUrl && !store.mapUrl.includes('<iframe') ? store.mapUrl : `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat || 0},${store.coordinates.lng || 0}`}
                  target="_blank"
                  className={`px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all text-center ${
                    store.status === 'active' ? 'bg-white text-black' : 'bg-white/5 text-white/20 pointer-events-none'
                  }`}
                >
                  Get Directions
                </motion.a>
                <motion.a 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   href={`https://wa.me/${store.whatsapp}`}
                   className="p-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all"
                >
                  <MessageSquare size={24} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
