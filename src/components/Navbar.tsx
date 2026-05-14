import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { systemData } = useCMS();
  const { user, isAdmin, login } = useAuth();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY <= 50);

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrolledDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolledDown(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ 
          paddingTop: isScrolledDown ? '0.75rem' : '1.5rem',
          paddingBottom: isScrolledDown ? '0.75rem' : '1.5rem',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-6 md:px-12 flex items-center justify-between',
          isAtTop ? 'bg-[#1c1b1b]' : isScrolledDown ? 'bg-[#1c1b1b]/60 backdrop-blur-md shadow-sm border-b border-white/5' : 'bg-[#1c1b1b] shadow-lg border-b border-white/5'
        )}
      >
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-text-primary"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/refs/heads/main/flex/logo.png" 
              alt={systemData.settings.logoText || "USED FLEX."} 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl md:text-2xl font-serif italic font-bold tracking-tighter text-[#EDEDED] hidden sm:block">
              {systemData.settings.logoText || "USED FLEX."}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'New Arrivals', path: '/new-arrivals' },
              { name: 'Shop', path: '/shop' },
              { name: 'Categories', path: '/categories' },
              { name: 'Stores', path: '/stores' }
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="group relative text-[10px] uppercase tracking-[0.4em] font-bold text-[#EDEDED]/60 hover:text-white transition-colors"
              >
                {link.name}
                <motion.span 
                  className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden mr-2 relative"
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search artifacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 pr-10 text-[10px] uppercase tracking-widest font-bold text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isSearchOpen && searchQuery) {
                  handleSearch();
                } else if (isSearchOpen) {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            >
              <Search size={20} />
            </motion.button>
          </div>
          <button 
            onClick={async () => {
              if (!user) {
                await login();
              } else {
                navigate('/profile');
              }
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            >
              <User size={20} />
            </motion.div>
          </button>
          <Link to="/checkout" className="group flex items-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingBag size={20} />
            </motion.div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -5 }}
                  className="ml-1 w-5 h-5 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#1c1b1b] z-[70] p-8 flex flex-col border-r border-white/5"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display font-bold text-xl">NAVIGATION</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {[
                  'Home', 'Shop', 'Categories', 'Stores', 'Profile'
                ].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-2xl font-display font-semibold uppercase tracking-tight hover:translate-x-2 transition-all"
                    onClick={(e) => {
                      if (item === 'Profile' && !user) {
                        e.preventDefault();
                        login();
                      }
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-border">
                <p className="text-text-secondary text-sm mb-4 uppercase tracking-widest">Connect</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-lg">Instagram</a>
                  <a href={`https://wa.me/${systemData.settings.whatsapp.replace(/\D/g, '')}?text=Hi%2C%20I%20have%20an%20immediate%20request`} target="_blank" rel="noopener noreferrer" className="text-lg">WhatsApp</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
