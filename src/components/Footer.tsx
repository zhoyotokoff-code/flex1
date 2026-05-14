import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Footer() {
  const { systemData } = useCMS();

  return (
    <footer className="bg-bg border-t border-border pt-16 pb-24 md:pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-display font-bold tracking-tighter mb-6 block">
            {systemData.settings.logoText || "USED FLEX."}
          </Link>
          <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
            {systemData.footer?.aboutText || "Redefining modern masculinity with luxury streetwear and precision tailoring. Style starts at 7'O Clock."}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-3 bg-card rounded-full hover:bg-white hover:text-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-3 bg-card rounded-full hover:bg-white hover:text-black transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-3 bg-card rounded-full hover:bg-white hover:text-black transition-all">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-3 bg-card rounded-full hover:bg-white hover:text-black transition-all">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-[0.2em] mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4">
            {['Home', 'Shop', 'Categories', 'Stores', 'About Us', 'Contact'].map((item) => (
              <li key={item}>
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-[0.2em] mb-6">Contact</h4>
          <address className="not-italic flex flex-col gap-4 text-text-secondary">
            <p>Main Road, Perinthalmanna<br />Kerala, India</p>
            <p>Phone: {systemData.settings.whatsapp}</p>
            <p>Email: usedflex@gmail.com</p>
          </address>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-secondary text-sm">
          {systemData.footer?.copyright || `© ${new Date().getFullYear()} USED FLEX. sheets team . All Rights Reserved.`}
        </p>
        <div className="flex gap-6 text-sm text-text-secondary">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
