import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { systemData } = useCMS();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center p-8 text-center"
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 1.1 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                scale: { duration: 2.5, ease: 'linear' }
              }}
              className="flex flex-col items-center"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-[-0.05em] leading-none mb-4 uppercase">
                {systemData.settings.splashText || "USED FLEX."}
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-text-secondary text-xs md:text-sm uppercase tracking-[0.4em]"
              >
                BEST USED FLEX SHEETS TEAM
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
  );
}
