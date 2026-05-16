import { User, Package, Heart, MapPin, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../hooks/useWishlist';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { wishlist } = useWishlist();
  const { user, isAdmin, login, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'orders' | 'wishlist' | 'addresses' | 'settings'>('orders');

  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbIcon, setDbIcon] = useState('');

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStatus, setResetStatus] = useState<{message: string, error?: boolean} | null>(null);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const d = await getDoc(doc(db, 'users', user.uid));
          if (d.exists()) {
            const data = d.data();
            setAddresses(data.addresses || []);
            setDbName(data.name || user.displayName || 'John Doe');
            setDbIcon(data.icon || user.photoURL || '');
          } else {
            setDbName(user.displayName || 'John Doe');
            setDbIcon(user.photoURL || '');
          }
        } catch (err: any) {
          if (!err.message?.includes('client is offline')) {
            console.error("Failed to fetch user data from Firestore:", err);
          }
          setDbName(user.displayName || 'John Doe');
          setDbIcon(user.photoURL || '');
        }
      };
      fetchUserData();
    }
  }, [user]);

  const saveUserData = async (data: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    } catch (err) {
      console.error("Failed to save user data:", err);
    }
  };

  const handleAddAddress = async () => {
    if (newAddress.trim() === '') return;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setNewAddress('');
    await saveUserData({ addresses: updated });
  };

  const handleDeleteAddress = async (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    setAddresses(updated);
    await saveUserData({ addresses: updated });
  };

  const handleUpdateProfile = async () => {
    await saveUserData({ name: dbName, icon: dbIcon });
    alert('Profile updated successfully!');
  };

  const handleRequestReset = async () => {
    try {
      setResetStatus(null);
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResetToken(data.token);
      setResetStatus({ message: 'Reset token generated (simulated email).' });
    } catch (e: any) {
      setResetStatus({ message: e.message, error: true });
    }
  };

  const handleResetPassword = async () => {
    try {
      setResetStatus(null);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResetStatus({ message: data.message });
      setResetToken('');
      setNewPassword('');
    } catch (e: any) {
      setResetStatus({ message: e.message, error: true });
    }
  };

  const dummyOrders = [
    { id: '#7C0112', date: 'Oct 12, 2026', status: 'Delivered', total: 2499, tracking: '7C_TRK_90012' },
    { id: '#7C0098', date: 'Sept 24, 2026', status: 'In Transit', total: 5499, tracking: '7C_TRK_88201' },
  ];

  const handleShareWishlist = () => {
    const list = wishlist.join(',');
    const url = `${window.location.origin}/wishlist?ids=${list}`;
    navigator.clipboard.writeText(url);
    alert('Wishlist link copied to clipboard! You can share this curated collection with others.');
  };

  const wishlistItems = PRODUCTS.filter(p => wishlist.includes(p.id));

  if (!user) {
    return (
      <div className="pt-48 pb-24 px-6 max-w-lg mx-auto text-center">
        <h1 className="text-4xl font-serif italic mb-6">Access Profile</h1>
        <p className="text-text-secondary mb-8">Please login to view your orders, wishlist, and account settings.</p>
        <button 
          onClick={login}
          className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-80 shrink-0 space-y-2">
          <div className="bg-card p-8 rounded-2xl mb-8 flex flex-col items-center text-center">
            {dbIcon ? (
              <img src={dbIcon} alt="Profile" className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-white/10" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-white">
                <User size={48} />
              </div>
            )}
            <h3 className="text-xl font-bold uppercase tracking-tight">{dbName}</h3>
            <p className="text-xs text-text-secondary tracking-widest uppercase truncate max-w-full">{user.email}</p>
          </div>

          {[
            ...(isAdmin ? [{ id: 'admin', icon: Settings, label: 'Admin Panel', color: 'text-amber-500' }] : []),
            { id: 'orders', icon: Package, label: 'My Orders' },
            { id: 'wishlist', icon: Heart, label: 'Wishlist' },
            { id: 'addresses', icon: MapPin, label: 'Addresses' },
            { id: 'settings', icon: Settings, label: 'Account Settings' },
            { id: 'logout', icon: LogOut, label: 'Logout', color: 'text-red-500' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.id === 'logout') {
                  logout();
                  navigate('/');
                } else if (item.id === 'admin') {
                  navigate('/admin');
                } else {
                  setActiveView(item.id as any);
                }
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                activeView === item.id ? 'bg-white text-black' : 'hover:bg-card text-text-secondary hover:text-white'
              } ${item.color || ''}`}
            >
              <item.icon size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              {item.id === 'wishlist' && wishlist.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{wishlist.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-12 w-full">
          {activeView === 'orders' && (
            <section>
              <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-8">Recent Orders</h2>
              <div className="space-y-4">
                {dummyOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-border/50"
                  >
                    <div>
                      <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-bold font-display">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Date</p>
                      <p className="font-bold">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Status</p>
                      <div className="flex flex-col gap-1">
                        <span className="px-3 py-1 bg-neutral-800 text-white text-[10px] uppercase font-bold tracking-widest rounded-full self-start">
                          {order.status}
                        </span>
                        {order.status === 'In Transit' && (
                          <a href="#" className="text-[9px] text-white underline tracking-widest uppercase hover:opacity-70">
                            Track: {order.tracking}
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Total</p>
                      <p className="font-bold font-display">₹{order.total.toLocaleString()}</p>
                    </div>
                    <button className="px-6 py-3 border border-border hover:bg-white hover:text-black transition-all rounded-full text-[10px] font-bold uppercase tracking-widest">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {activeView === 'wishlist' && (
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold uppercase tracking-widest">Your Wishlist</h2>
                {wishlistItems.length > 0 && (
                  <button 
                    onClick={handleShareWishlist}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Share Archive
                  </button>
                )}
              </div>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="bg-card p-20 rounded-3xl text-center border border-dashed border-border">
                  <Heart size={48} className="mx-auto mb-4 text-text-secondary opacity-30" />
                  <p className="text-text-secondary font-display uppercase tracking-widest">Your wishlist is empty</p>
                </div>
              )}
            </section>
          )}

          {activeView === 'addresses' && (
            <section>
              <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-8">Saved Addresses</h2>
              <div className="space-y-4 mb-8">
                {addresses.length === 0 && (
                  <p className="text-text-secondary italic font-serif">No addresses saved yet.</p>
                )}
                {addresses.map((addr, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-2xl border border-white/5 flex justify-between items-center group">
                    <p className="text-sm font-medium">{addr}</p>
                    <button 
                      onClick={() => handleDeleteAddress(idx)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs tracking-widest uppercase font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm uppercase tracking-widest font-bold mb-4">Add New Address</h3>
                <textarea 
                  rows={3}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white outline-none resize-none mb-4"
                />
                <button 
                  onClick={handleAddAddress}
                  className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
                >
                  Save Address
                </button>
              </div>
            </section>
          )}

          {activeView === 'settings' && (
            <section className="space-y-8">
              <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-8">Account Settings</h2>
              
              <div className="bg-card p-8 rounded-3xl border border-white/5 space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2 block">Display Name</label>
                  <input 
                    type="text" 
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2 block">Profile Icon URL</label>
                  <input 
                    type="text" 
                    value={dbIcon}
                    onChange={(e) => setDbIcon(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white outline-none"
                  />
                </div>
                <button 
                  onClick={handleUpdateProfile}
                  className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
                >
                  Update Profile
                </button>
              </div>

              <div className="bg-card p-8 rounded-3xl border border-white/5 space-y-4 relative overflow-hidden">
                <h3 className="text-lg italic font-serif text-white mb-2">Password Reset</h3>
                <p className="text-sm text-text-secondary max-w-lg mb-6">
                  Initiate a password reset utilizing a secure token.
                </p>
                <button 
                  onClick={() => setShowResetModal(true)}
                  className="inline-block border border-white/20 hover:border-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Reset Password
                </button>
                
                <h3 className="text-lg italic font-serif text-white mb-2 mt-8">Google Security & 2FA</h3>
                <p className="text-sm text-text-secondary max-w-lg mb-6">
                  If you log in via Google, primary security and Two-Factor Authentication (2FA) are managed directly through your Google Account settings.
                </p>
                <a 
                  href="https://myaccount.google.com/security" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block border border-white/20 hover:border-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Manage on Google
                </a>
                <ShieldAlert className="absolute -bottom-4 -right-4 w-48 h-48 opacity-[0.03] pointer-events-none" />
              </div>

              <div className="bg-red-500/10 p-8 rounded-3xl border border-red-500/20 space-y-4">
                <h3 className="text-lg italic font-serif text-red-500 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-400/80 max-w-lg mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                      deleteAccount();
                    }
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
                >
                  Delete Account
                </button>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
          <div 
            onClick={() => setShowResetModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#1c1b1b] border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-serif italic text-white mb-2">Reset Password</h2>
            <p className="text-sm text-text-secondary mb-6">Initiate a secure password reset flow.</p>
            
            {resetStatus && (
              <p className={`text-xs mb-4 p-3 rounded-lg ${resetStatus.error ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {resetStatus.message}
              </p>
            )}

            {!resetToken ? (
              <button 
                onClick={handleRequestReset}
                className="w-full bg-white text-black px-6 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
              >
                Request Reset Token
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2 block">Reset Token</label>
                  <input 
                    type="text" 
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste reset token here"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2 block">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white outline-none"
                  />
                </div>
                <button 
                  onClick={handleResetPassword}
                  className="w-full bg-white text-black px-6 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
                >
                  Confirm Reset
                </button>
              </div>
            )}
            
            <button 
              onClick={() => {
                setShowResetModal(false);
                setResetToken('');
                setResetStatus(null);
              }}
              className="mt-6 w-full text-center text-xs text-text-secondary uppercase tracking-widest hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
