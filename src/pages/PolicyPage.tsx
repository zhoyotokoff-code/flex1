import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

export default function PolicyPage() {
  const { pathname } = useLocation();
  const { systemData } = useCMS();

  let title = '';
  let content = '';

  if (pathname === '/privacy-policy') {
    title = 'Privacy Policy';
    content = systemData.policies?.privacy || '';
  } else if (pathname === '/terms') {
    title = 'Terms of Service';
    content = systemData.policies?.terms || '';
  } else if (pathname === '/refund-policy') {
    title = 'Refund Policy';
    content = systemData.policies?.refund || '';
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center md:text-left"
      >
        <span className="text-[10px] uppercase font-bold tracking-[1em] text-text-secondary mb-4 block">Legal</span>
        <h1 className="text-4xl md:text-7xl font-serif italic text-white tracking-tighter mb-4 leading-none">{title}</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert prose-p:text-text-secondary prose-headings:text-white prose-a:text-white max-w-none font-serif italic text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
