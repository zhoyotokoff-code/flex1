import { Home, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useWishlist } from '../hooks/useWishlist';

export default function MobileBottomNav() {
  const location = useLocation();
  const { wishlist } = useWishlist();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: MessageSquare, label: 'WhatsApp', path: 'whatsapp' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-t border-border px-6 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.path === 'whatsapp') {
            return (
              <a
                key={item.label}
                href="https://wa.me/918001234567"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1 text-text-secondary hover:text-white transition-colors"
              >
                <item.icon size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative",
                isActive ? "text-white scale-110" : "text-text-secondary opacity-60"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
              
              {item.label === 'Profile' && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
