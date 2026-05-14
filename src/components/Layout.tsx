import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { motion } from 'motion/react';

export default function Layout() {
  const { pathname } = useLocation();
  const { systemData } = useCMS();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />

      {/* WhatsApp Floating Button (Desktop Only) */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        href={`https://wa.me/${systemData.settings.whatsapp.replace(/\D/g, '')}?text=Hi%2C%20I%20have%20an%20immediate%20request`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all cursor-pointer"
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
}
