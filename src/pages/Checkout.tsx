import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, MapPin, Truck, ChevronRight, Plus, Minus, Trash2, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

type PaymentMethod = 'upi' | 'whatsapp';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif italic text-white mb-6">Your Bag is Empty</h1>
        <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.4em] border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'whatsapp') {
      const itemsList = cart.map(item => `- ${item.name} (${item.size}, ${item.color}) x${item.quantity}`).join('\n');
      const message = `Hi 7'O Clock, I'd like to place an order:
\nITEMS:
${itemsList}
\nTOTAL: ₹${totalPrice.toLocaleString()}
\nSHIPPING:
${formData.name}
${formData.phone}
${formData.address}, ${formData.city} - ${formData.pincode}
Landmark: ${formData.landmark || 'N/A'}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert('Redirecting to secure UPI payment gateway...');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-8 overflow-hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm uppercase font-bold tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Selection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Progress & Form */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-serif italic text-white tracking-tighter mb-4 uppercase">Archive Order</h1>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-[0.4em]">Section 04: finalize delivery</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <MapPin size={20} className="text-text-secondary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Shipping Intelligence</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Recipient Name"
                  className="bg-transparent border-b border-white/20 py-4 focus:border-white outline-none transition-colors text-sm w-full"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Line"
                  className="bg-transparent border-b border-white/20 py-4 focus:border-white outline-none transition-colors text-sm w-full"
                />
              </div>

              <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                placeholder="Full Architectural Address"
                className="w-full bg-transparent border-b border-white/20 py-4 focus:border-white outline-none transition-colors text-sm resize-none"
              />

              <div className="grid grid-cols-2 gap-6">
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="bg-transparent border-b border-white/20 py-4 focus:border-white outline-none transition-colors text-sm w-full"
                />
                <input
                  required
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Zip / Code"
                  className="bg-transparent border-b border-white/20 py-4 focus:border-white outline-none transition-colors text-sm w-full"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4 text-white">
                <Smartphone size={20} className="text-text-secondary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Payment Protocol</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    "p-6 border rounded-2xl flex flex-col gap-4 text-left transition-all",
                    paymentMethod === 'upi' ? "border-white bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-white/10 opacity-50 hover:opacity-100"
                  )}
                >
                   <CreditCard size={24} />
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest">Instant Secured</p>
                     <p className="text-lg font-serif italic text-white leading-none mt-1">UPI / GPay</p>
                   </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={cn(
                    "p-6 border rounded-2xl flex flex-col gap-4 text-left transition-all",
                    paymentMethod === 'whatsapp' ? "border-white bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-white/10 opacity-50 hover:opacity-100"
                  )}
                >
                   <MessageCircle size={24} />
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest">Manual Assist</p>
                     <p className="text-lg font-serif italic text-white leading-none mt-1">WhatsApp Order</p>
                   </div>
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={cn(
                "w-full py-8 text-black font-bold font-display text-[10px] uppercase tracking-[0.5em] rounded-full shadow-2xl transition-all flex items-center justify-center gap-4",
                paymentMethod === 'whatsapp' ? "bg-green-500 shadow-green-500/20" : "bg-white shadow-white/10"
              )}
            >
              {paymentMethod === 'whatsapp' ? <MessageCircle size={18} /> : <CreditCard size={18} />}
              Initiate Transaction
            </motion.button>
          </form>
        </div>

        {/* Bag Summary */}
        <div className="lg:sticky lg:top-32 h-fit space-y-12">
            <div className="bg-[#1c1b1b] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
               <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                 <h2 className="text-xl font-serif italic text-white">Your Bag</h2>
                 <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">{cart.length} pieces</span>
               </div>

               <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 scrollbar-hide mb-10">
                 <AnimatePresence>
                   {cart.map((item) => (
                     <motion.div 
                       key={item.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="flex gap-6 group"
                     >
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                           <div className="flex justify-between items-start">
                             <h4 className="text-sm font-bold uppercase tracking-tight text-white mb-1">{item.name}</h4>
                             <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 size={14} />
                             </button>
                           </div>
                           <p className="text-[10px] uppercase tracking-widest text-[#EDEDED]/40 mb-4">{item.size} • {item.color}</p>
                           
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10">
                                 <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-white"><Minus size={12} /></button>
                                 <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                 <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-white"><Plus size={12} /></button>
                              </div>
                              <p className="text-sm font-serif italic text-white">₹{item.price.toLocaleString()}</p>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>

               <div className="space-y-4 pt-8 border-t border-white/5">
                 <div className="flex justify-between items-center text-xs text-text-secondary uppercase tracking-widest">
                    <span>Signature Delivery</span>
                    <span className="text-green-500">Free</span>
                 </div>
                 <div className="flex justify-between items-center pt-4 mb-6">
                    <span className="text-2xl font-serif italic text-white">Archive Total</span>
                    <span className="text-2xl font-serif italic text-white">₹{totalPrice.toLocaleString()}</span>
                 </div>
                 <Link to="/shop" className="w-full py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 mt-4 text-center">
                    Continue Shopping
                 </Link>
               </div>
            </div>

            <div className="flex items-center gap-4 px-10 text-text-secondary">
               <ShieldCheck size={20} className="text-white/20" />
               <p className="text-[9px] uppercase font-bold tracking-[0.3em] leading-relaxed">
                 Encrypted transaction Protocol. Guaranteed Authenticity and Quality Intelligence with every piece.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
