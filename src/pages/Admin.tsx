import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Store, 
  Settings, 
  Plus, 
  Search,
  MoreVertical,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Save,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useCMS } from '../context/CMSContext';

import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Product } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddStore, setShowAddStore] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [newStore, setNewStore] = useState<Partial<Store>>({
    name: '', location: '', image: '', whatsapp: '', specialties: [], mapUrl: ''
  });
  const { systemData, updateSystemData, products, stores, updateProduct, deleteProduct, updateStore, orders, updateOrderStatus } = useCMS();
  const [isSaved, setIsSaved] = useState(false);

  const [catInput, setCatInput] = useState('');
  const [subcatInput, setSubcatInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCatValue, setEditCatValue] = useState('');
  const [productError, setProductError] = useState('');

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 't-shirts',
    description: '',
    images: [] as string[],
    sizes: [] as string[],
    condition: 'New'
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price === undefined || newProduct.price <= 0) {
      setProductError("Artifact Name and Base Price (greater than 0) are required.");
      return;
    }
    setProductError('');
    const prodId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    try {
      await updateProduct({
        ...newProduct,
        id: prodId,
        subcategory: newProduct.subcategory || 'general',
        colors: newProduct.colors || [],
        newArrival: newProduct.newArrival || true,
        bestSeller: newProduct.bestSeller || false
      });
      setShowAddProduct(false);
      setEditingProduct(null);
      setNewProduct({ name: '', price: 0, category: 't-shirts', description: '', images: [], sizes: [], condition: 'New' });
    } catch (e: any) {
      setProductError(e.message || "Failed to save artifact. Check permissions.");
    }
  };

  const handleSystemUpdate = async (section: keyof typeof systemData, field: string | null, value: any) => {
    try {
      await updateSystemData(section, field, value);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e: any) {
      alert("Failed to save changes: " + (e.message || "Database error."));
    }
  };

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.location) {
      alert("Store Name and Location are required.");
      return;
    }
    const storeId = editingStore ? editingStore.id : `store-${Date.now()}`;
    try {
      await updateStore({
        ...newStore,
        id: storeId,
        coordinates: newStore.coordinates || { lat: 0, lng: 0 },
        status: newStore.status || 'active'
      });
      setShowAddStore(false);
      setEditingStore(null);
      setNewStore({ name: '', location: '', image: '', whatsapp: '', specialties: [], mapUrl: '' });
    } catch (e: any) {
      alert(e.message || "Failed to save store.");
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: totalOrders > 0 ? '+12%' : '0%' },
    { label: 'Orders Received', value: totalOrders.toString(), icon: ShoppingBag, trend: totalOrders > 0 ? '+8%' : '0%' },
    { label: 'New Members', value: totalOrders > 0 ? '89' : '0', icon: Users, trend: totalOrders > 0 ? '+24%' : '0%' },
    { label: 'Conversion Rate', value: totalOrders > 0 ? '3.2%' : '0%', icon: TrendingUp, trend: totalOrders > 0 ? '+0.5%' : '0%' },
  ];

  const adminMenu = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'inventory', icon: ShoppingBag, label: 'Inventory' },
    { id: 'categories', icon: LayoutDashboard, label: 'Categories' },
    { id: 'curation', icon: Settings, label: 'Home Curation' },
    { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
    { id: 'stores', icon: Store, label: 'Storefronts' },
    { id: 'leads', icon: MessageSquare, label: 'WhatsApp Queue' },
    { id: 'settings', icon: Settings, label: 'General Settings' },
    { id: 'content', icon: LayoutDashboard, label: 'Page Content' },
  ];

  const getSalesData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const initialSales = days.map(day => ({ name: day, sales: 0, volume: 0 }));
    orders.forEach(order => {
      const date = new Date(order.date);
      const dayName = days[date.getDay()];
      const dayData = initialSales.find(d => d.name === dayName);
      if (dayData) {
        dayData.sales += order.total;
        dayData.volume += 1;
      }
    });
    return [
      initialSales[1], initialSales[2], initialSales[3], initialSales[4], initialSales[5], initialSales[6], initialSales[0]
    ];
  };

  const salesData = getSalesData();

  const demoData = [
    { name: '18-24', value: 40 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 10 },
  ];
  const COLORS = ['#ffffff', '#a3a3a3', '#525252', '#262626'];

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Sidebar for Desktop */}
      <div className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-32 h-fit">
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-serif italic text-xl">7</div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Central Intelligence</h2>
            <p className="text-[9px] uppercase tracking-widest text-text-secondary">v2.4.0 • Authorized only</p>
          </div>
        </div>

        <div className="space-y-1">
          {adminMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-[10px] uppercase tracking-[0.4em] group",
                activeTab === item.id 
                  ? "bg-white text-black shadow-2xl shadow-white/10" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn("transition-transform group-hover:scale-110", activeTab === item.id ? "text-black" : "text-text-secondary")} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="pt-12 px-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-[9px] uppercase font-bold tracking-widest text-text-secondary mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-white">All Terminals Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-grow space-y-10 min-w-0">
        {/* Context Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter capitalize leading-none">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-text-secondary uppercase tracking-[0.4em] text-[10px] mt-4">Operational Sector: {activeTab}</p>
          </div>
          
          <div className="flex items-center gap-4">
             {isSaved && (
               <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] uppercase font-bold tracking-widest text-green-500"
               >
                 Changes Persisted
               </motion.span>
             )}
             <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
               <ShieldCheck size={14} /> System Secure
             </button>
             {activeTab === 'inventory' && (
               <button 
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ name: '', price: 0, category: 't-shirts', description: '', images: [], sizes: [], condition: 'New' });
                  setShowAddProduct(true);
                }}
                className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2">
                 <Plus size={16} /> Deploy Prototype
               </button>
             )}
          </div>
        </div>

        {/* Dynamic Context Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="dashboard" className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[#1c1b1b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary">
                        <stat.icon size={24} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full",
                        stat.trend.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-text-secondary text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif italic text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-[#1c1b1b] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col">
                  <h3 className="text-xl font-serif italic text-white uppercase mb-6">Sales Trend (Weekly)</h3>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                        <Line type="monotone" dataKey="sales" stroke="#ffffff" strokeWidth={3} dot={{ fill: '#000', stroke: '#fff', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-6">
                  <div className="bg-[#1c1b1b] border border-white/5 rounded-[3rem] p-8 shadow-2xl flex flex-col">
                    <h3 className="text-sm font-serif italic text-white uppercase mb-2">User Demographics</h3>
                    <div className="flex-grow flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={demoData}
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {demoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="ml-4 space-y-2">
                        {demoData.map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="text-[10px] text-text-secondary uppercase tracking-widest">{d.name} ({d.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1c1b1b] border border-white/5 rounded-[3rem] p-8 shadow-2xl flex flex-col">
                    <h3 className="text-sm font-serif italic text-white uppercase mb-2">Order Volume</h3>
                    <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                          <Line type="monotone" dataKey="volume" stroke="#a3a3a3" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="orders" className="bg-[#1c1b1b] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xl font-serif italic text-white uppercase">Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Order ID</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Customer</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Total</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Date</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="font-mono text-sm text-white mb-1 uppercase tracking-widest">{order.id}</p>
                        </td>
                        <td className="px-10 py-8 font-serif italic text-white">{order.customerName}</td>
                        <td className="px-10 py-8 font-mono text-white">₹{order.total.toLocaleString()}</td>
                        <td className="px-10 py-8 text-xs text-text-secondary">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-10 py-8">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={cn(
                              "text-[9px] uppercase tracking-widest font-bold border px-4 py-1 rounded-full outline-none appearance-none cursor-pointer",
                              order.status === 'Delivered' ? "border-green-500/20 text-green-500 bg-green-500/10" :
                              order.status === 'Pending' ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/10" :
                              "border-red-500/20 text-red-500 bg-red-500/10"
                            )}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="inventory" className="bg-[#1c1b1b] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xl font-serif italic text-white uppercase">Archive Goods</h3>
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input 
                      type="text"
                      placeholder="Search archive..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-[10px] uppercase font-bold text-white placeholder-text-secondary outline-none focus:border-white transition-colors"
                    />
                    <div className="flex gap-4">
                      {['All', 'Clothing', 'Shoes', 'Innerwear'].map(filter => (
                        <button 
                          key={filter} 
                          onClick={() => setInventoryFilter(filter)}
                          className={cn(
                            "text-[10px] uppercase font-bold tracking-widest transition-colors",
                            inventoryFilter === filter ? "text-white" : "text-[#EDEDED]/40 hover:text-white"
                          )}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Signature / ID</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Category</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Price</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Status</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-bold text-text-secondary">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.filter(p => {
                      if (inventoryFilter !== 'All') {
                        if (inventoryFilter === 'Clothing' && !['t-shirts', 'shirts', 'pants', 'shorts', 'baggy'].includes(p.category)) return false;
                        if (inventoryFilter === 'Shoes' && p.category !== 'shoes') return false;
                        if (inventoryFilter === 'Innerwear' && p.category !== 'innerwear') return false;
                      }
                      if (inventorySearch && !p.name.toLowerCase().includes(inventorySearch.toLowerCase()) && !p.id.toLowerCase().includes(inventorySearch.toLowerCase())) {
                        return false;
                      }
                      return true;
                    }).sort((a,b) => {
                       // if id is prod-XYZ, it has a timestamp. so sort by ID if possible
                       if (a.id.startsWith('prod-') && b.id.startsWith('prod-')) {
                         return b.id.localeCompare(a.id);
                       }
                       if (a.id.startsWith('prod-')) return -1;
                       if (b.id.startsWith('prod-')) return 1;
                       return 0; // fallback relative order
                    }).slice(0, 50).map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <img src={p.images[0]} alt="" className="w-14 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <div>
                              <p className="font-serif italic text-lg text-white mb-1 leading-tight">{p.name}</p>
                              <p className="text-[9px] text-text-secondary font-mono tracking-widest uppercase">UUID: {p.id.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[9px] uppercase tracking-widest font-bold border border-white/10 px-4 py-1 rounded-full text-[#EDEDED]">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-10 py-8 font-serif italic text-white">₹{p.price.toLocaleString()}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#EDEDED]">Active</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(p);
                                setNewProduct({
                                  ...p,
                                  colors: p.colors?.map(c => typeof c === 'string' ? c : (c as any).name) || []
                                });
                                setShowAddProduct(true);
                              }}
                              className="p-3 hover:bg-white/10 hover:text-white rounded-full transition-colors text-text-secondary"
                            >
                              <Settings size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Delete this artifact?')) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-text-secondary"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="categories" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || ['t-shirts']).map(cat => (
                <div key={cat} className="group relative bg-[#1c1b1b] p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all shadow-2xl overflow-hidden text-center">
                   {editingCategory !== cat && (
                     <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingCategory(cat);
                            setEditCatValue(cat);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full text-white"
                        >
                          <Settings size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            // Can't use confirm directly, but for now we'll delete it immediately or just leave confirm as it usually works in AI Studio, but to be safe let's just delete
                            const cats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                            handleSystemUpdate('storeConfig', 'categories', cats.filter(c => c !== cat).join(', '));
                          }}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-full"
                        >
                          <span className="text-xl leading-none">&times;</span>
                        </button>
                     </div>
                   )}
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-secondary group-hover:bg-white group-hover:text-black transition-all">
                      <ShoppingBag size={24} />
                   </div>
                   {editingCategory === cat ? (
                     <div className="flex flex-col gap-2">
                       <input 
                         type="text" 
                         value={editCatValue} 
                         onChange={(e) => setEditCatValue(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-white outline-none focus:border-white transition-colors text-center"
                       />
                       <div className="flex gap-2 justify-center">
                         <button 
                           onClick={() => {
                             if (editCatValue.trim() && editCatValue.trim() !== cat) {
                               const ObjectCats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                               const newCats = ObjectCats.map(c => c === cat ? editCatValue.trim() : c);
                               handleSystemUpdate('storeConfig', 'categories', newCats.join(', '));
                             }
                             setEditingCategory(null);
                           }}
                           className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg"
                         >
                           Save
                         </button>
                         <button 
                           onClick={() => setEditingCategory(null)}
                           className="px-4 py-2 bg-white/10 text-white text-xs rounded-lg"
                         >
                           Cancel
                         </button>
                       </div>
                     </div>
                   ) : (
                     <>
                       <h4 className="text-lg font-serif italic text-white mb-2 capitalize">{cat}</h4>
                       <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Piece Count: {products.filter(p => p.category === cat).length}</p>
                     </>
                   )}
                </div>
              ))}
              <div className="bg-white/5 border-2 border-dashed border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:bg-white/10 transition-all h-full min-h-[220px]">
                 {editingCategory === 'new' ? (
                   <div className="flex flex-col gap-2 w-full">
                     <input 
                       type="text" 
                       value={editCatValue} 
                       onChange={(e) => setEditCatValue(e.target.value)}
                       placeholder="Category name"
                       className="w-full bg-black/20 border border-white/10 px-4 py-2 rounded-lg text-white outline-none focus:border-white transition-colors text-center"
                     />
                     <div className="flex gap-2 justify-center">
                       <button 
                         onClick={() => {
                           if (editCatValue.trim()) {
                             const cats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                             if (!cats.includes(editCatValue.trim())) {
                               handleSystemUpdate('storeConfig', 'categories', [...cats, editCatValue.trim()].join(', '));
                             }
                           }
                           setEditingCategory(null);
                         }}
                         className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg"
                       >
                         Add
                       </button>
                       <button 
                         onClick={() => setEditingCategory(null)}
                         className="px-4 py-2 bg-white/10 text-white text-xs rounded-lg"
                       >
                         Cancel
                       </button>
                     </div>
                   </div>
                 ) : (
                   <button 
                     className="w-full h-full flex flex-col items-center justify-center gap-4"
                     onClick={() => {
                       setEditingCategory('new');
                       setEditCatValue('');
                     }}
                   >
                     <Plus size={24} className="text-text-secondary group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary">New Sector</span>
                   </button>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'curation' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="curation" className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                    <h3 className="text-xl font-serif italic text-white uppercase">Hero Section Edit</h3>
                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Subtitle Label</label>
                         <input 
                           type="text" 
                           value={systemData.hero.subtitle} 
                           onChange={(e) => handleSystemUpdate('hero', 'subtitle', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white focus:border-white transition-all outline-none" 
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Headline (Serif)</label>
                            <input 
                              type="text" 
                              value={systemData.hero.titlePrimary} 
                              onChange={(e) => handleSystemUpdate('hero', 'titlePrimary', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white focus:border-white outline-none" 
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Headline (Display)</label>
                            <input 
                              type="text" 
                              value={systemData.hero.titleSecondary} 
                              onChange={(e) => handleSystemUpdate('hero', 'titleSecondary', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white focus:border-white outline-none" 
                            />
                          </div>
                       </div>
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Hero Background URL</label>
                         <div className="flex gap-4">
                           <input 
                             type="text" 
                             value={systemData.hero.backgroundImage} 
                             onChange={(e) => handleSystemUpdate('hero', 'backgroundImage', e.target.value)}
                             className="flex-grow bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] text-white/50 focus:border-white outline-none" 
                           />
                           <button className="px-6 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10"><ImageIcon size={18} /></button>
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                    <h3 className="text-xl font-serif italic text-white uppercase">Narrative Marquee</h3>
                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Primary Marquee Content</label>
                         <textarea 
                           rows={3} 
                           value={systemData.marquee.text} 
                           onChange={(e) => handleSystemUpdate('marquee', 'text', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white outline-none resize-none" 
                         />
                       </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-4">Manifesto / Ethos</h4>
                        <div className="space-y-6">
                           <div>
                             <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Subtitle</label>
                             <input 
                               type="text" 
                               value={systemData.manifesto?.subtitle || ''} 
                               onChange={(e) => handleSystemUpdate('manifesto', 'subtitle', e.target.value)}
                               className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white focus:border-white outline-none" 
                             />
                           </div>
                           <div>
                             <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Text Content (HTML allowed)</label>
                             <textarea 
                               rows={3} 
                               value={systemData.manifesto?.text || ''} 
                               onChange={(e) => handleSystemUpdate('manifesto', 'text', e.target.value)}
                               className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white outline-none resize-none" 
                             />
                           </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-4">Lookbook Media Registry</h4>
                        <div className="grid grid-cols-3 gap-4">
                           {[
                             { id: 'mainImage', label: 'Main' },
                             { id: 'secondaryImage1', label: 'Side A' },
                             { id: 'secondaryImage2', label: 'Side B' }
                           ].map((item) => (
                             <div key={item.id} className="space-y-2">
                               <p className="text-[8px] uppercase tracking-widest text-text-secondary text-center">{item.label}</p>
                               <button 
                                 onClick={() => {
                                   const url = prompt('Enter Image URL', (systemData.lookbook as any)[item.id]);
                                   if (url) handleSystemUpdate('lookbook', item.id, url);
                                 }}
                                 className="aspect-[3/4] w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden group relative"
                               >
                                 <img src={(systemData.lookbook as any)[item.id]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                   <ImageIcon size={16} className="text-white" />
                                 </div>
                               </button>
                             </div>
                           ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-4">Category Banners</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                             <p className="text-[8px] uppercase tracking-widest text-text-secondary">Banner 1</p>
                             <input 
                               type="text" 
                               value={systemData.banners?.banner1Title || ''} 
                               onChange={(e) => handleSystemUpdate('banners', 'banner1Title', e.target.value)}
                               placeholder="Title (HTML allowed)"
                               className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs font-bold tracking-widest text-white outline-none" 
                             />
                             <button 
                               onClick={() => {
                                 const url = prompt('Enter Image URL', systemData.banners?.banner1Image);
                                 if (url) handleSystemUpdate('banners', 'banner1Image', url);
                               }}
                               className="aspect-square w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden group relative"
                             >
                               <img src={systemData.banners?.banner1Image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <ImageIcon size={16} className="text-white" />
                               </div>
                             </button>
                           </div>
                           <div className="space-y-4">
                             <p className="text-[8px] uppercase tracking-widest text-text-secondary">Banner 2</p>
                             <input 
                               type="text" 
                               value={systemData.banners?.banner2Title || ''} 
                               onChange={(e) => handleSystemUpdate('banners', 'banner2Title', e.target.value)}
                               placeholder="Title (HTML allowed)"
                               className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs font-bold tracking-widest text-white outline-none" 
                             />
                             <button 
                               onClick={() => {
                                 const url = prompt('Enter Image URL', systemData.banners?.banner2Image);
                                 if (url) handleSystemUpdate('banners', 'banner2Image', url);
                               }}
                               className="aspect-square w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden group relative"
                             >
                               <img src={systemData.banners?.banner2Image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <ImageIcon size={16} className="text-white" />
                               </div>
                             </button>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stores' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="stores" className="grid grid-cols-1 gap-6">
              <button 
                onClick={() => {
                  setEditingStore(null);
                  setNewStore({ name: '', location: '', image: '', whatsapp: '', specialties: [], mapUrl: '' });
                  setShowAddStore(true);
                }}
                className="w-full py-12 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] text-text-secondary hover:text-white hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-4 group"
              >
                 <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Plus size={32} />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Sync New Terminal</span>
              </button>
              {stores.map((store) => (
                <div key={store.id} className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
                   <div className="w-full md:w-48 h-32 bg-white/5 rounded-2xl overflow-hidden grayscale">
                      <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-grow">
                      <h4 className="text-2xl font-serif italic text-white mb-1">{store.name}</h4>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-4">{store.status === 'active' ? 'ACTIVE TERMINAL • OPERATIONAL' : 'INBOUND TERMINAL • COMING SOON'}</p>
                      <p className="text-text-secondary text-xs leading-relaxed max-w-xl">{store.location}</p>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setEditingStore(store);
                          setNewStore(store);
                          setShowAddStore(true);
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"
                      >
                        <Settings size={18} />
                      </button>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="reviews" className="bg-[#1c1b1b] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xl font-serif italic text-white uppercase">Client Testimonials</h3>
                 <div className="flex gap-4">
                    <button className="text-[10px] uppercase font-bold tracking-widest text-[#EDEDED]/40 hover:text-white transition-colors">Pending (3)</button>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-white transition-colors">Approved</button>
                 </div>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { id: 1, user: 'Aryan Sharma', rating: 5, comment: "The drop shoulder fit is exactly what I've been looking for. Quality is insane.", product: 'Archive 01 Tee', status: 'Approved' },
                  { id: 2, user: 'Vikram Singh', rating: 4, comment: "Pants fit perfectly. The cargo pockets actually look premium, not bulky.", product: 'Tactical Cargo', status: 'Pending' },
                  { id: 3, user: 'Nisha Gupta', rating: 5, comment: "Obsessed with the silhouette of the baggy series. Will buy again.", product: 'Baggy V2', status: 'Approved' },
                ].map((review) => (
                  <div key={review.id} className="p-10 flex flex-col md:flex-row gap-8 hover:bg-white/5 transition-colors">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-serif italic text-white mb-1">{review.user}</h4>
                          <div className="flex gap-1 mb-2">
                             {[...Array(5)].map((_, i) => (
                               <div key={i} className={cn("w-2 h-2 rounded-full", i < review.rating ? "bg-white" : "bg-white/20")} />
                             ))}
                          </div>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Regarding: {review.product}</p>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest",
                          review.status === 'Approved' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>{review.status}</span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed italic">"{review.comment}"</p>
                    </div>
                    <div className="flex md:flex-col gap-4 self-end md:self-center">
                       <button className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white"><ShieldCheck size={18} /></button>
                       <button className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/20 hover:text-red-500 text-white transition-colors"><MoreVertical size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="settings" className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                     <h3 className="text-xl font-serif italic text-white uppercase">Communication Pulse</h3>
                     <div className="space-y-6">
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Primary WhatsApp Interface</label>
                           <input 
                             type="text" 
                             value={systemData.settings.whatsapp} 
                             onChange={(e) => handleSystemUpdate('settings', 'whatsapp', e.target.value)}
                             className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-mono text-white focus:border-white outline-none" 
                           />
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                           <div>
                              <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Live Notifications</p>
                              <p className="text-[9px] text-text-secondary uppercase">Synchronize WhatsApp with Order Feed</p>
                           </div>
                           <button 
                             onClick={() => handleSystemUpdate('settings', 'notifications', !systemData.settings.notifications)}
                             className={cn(
                               "w-12 h-6 rounded-full relative transition-colors",
                               systemData.settings.notifications ? "bg-white" : "bg-white/10"
                             )}
                           >
                              <div className={cn(
                                "absolute top-1 w-4 h-4 bg-black rounded-full transition-all",
                                systemData.settings.notifications ? "right-1" : "right-7"
                              )} />
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                      <h3 className="text-xl font-serif italic text-white uppercase">Brand Identity</h3>
                     <div className="space-y-6">
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Logo Text</label>
                           <input 
                             type="text" 
                             value={systemData.settings.logoText || ''} 
                             onChange={(e) => handleSystemUpdate('settings', 'logoText', e.target.value)}
                             className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white focus:border-white outline-none" 
                           />
                        </div>
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Splash Screen Text</label>
                           <input 
                             type="text" 
                             value={systemData.settings.splashText || ''} 
                             onChange={(e) => handleSystemUpdate('settings', 'splashText', e.target.value)}
                             className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-display uppercase tracking-widest text-white focus:border-white outline-none" 
                           />
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                 <h3 className="text-xl font-serif italic text-white uppercase">Store Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Categories</label>
                           <div className="flex gap-2 flex-wrap mb-3">
                             {(systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || []).map(cat => (
                               <span key={cat} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                 {cat}
                                 <button type="button" onClick={() => {
                                   const cats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                   handleSystemUpdate('storeConfig', 'categories', cats.filter(c => c !== cat).join(', '));
                                 }} className="hover:text-red-500">&times;</button>
                               </span>
                             ))}
                           </div>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={catInput}
                               onChange={(e) => setCatInput(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const val = catInput.trim();
                                   if (val) {
                                    const cats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                    if (!cats.includes(val)) {
                                      handleSystemUpdate('storeConfig', 'categories', [...cats, val].join(', '));
                                    }
                                    setCatInput('');
                                   }
                                 }
                               }}
                               placeholder="New Category..."
                               className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none" 
                             />
                             <button 
                               type="button"
                               onClick={() => {
                                 const val = catInput.trim();
                                 if (val) {
                                  const cats = systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                  if (!cats.includes(val)) {
                                    handleSystemUpdate('storeConfig', 'categories', [...cats, val].join(', '));
                                  }
                                  setCatInput('');
                                 }
                               }}
                               className="px-6 bg-white text-black font-bold text-xs rounded-2xl"
                             >
                               Add
                             </button>
                           </div>
                        </div>
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Subcategories</label>
                           <div className="flex gap-2 flex-wrap mb-3">
                             {(systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || []).map(sub => (
                               <span key={sub} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                 {sub}
                                 <button type="button" onClick={() => {
                                   const subs = systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                   handleSystemUpdate('storeConfig', 'subcategories', subs.filter(c => c !== sub).join(', '));
                                 }} className="hover:text-red-500">&times;</button>
                               </span>
                             ))}
                           </div>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={subcatInput}
                               onChange={(e) => setSubcatInput(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const val = subcatInput.trim();
                                   if (val) {
                                    const subs = systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                    if (!subs.includes(val)) {
                                      handleSystemUpdate('storeConfig', 'subcategories', [...subs, val].join(', '));
                                    }
                                    setSubcatInput('');
                                   }
                                 }
                               }}
                               placeholder="New Subcategory..."
                               className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none" 
                             />
                             <button 
                               type="button"
                               onClick={() => {
                                 const val = subcatInput.trim();
                                 if (val) {
                                  const subs = systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                  if (!subs.includes(val)) {
                                    handleSystemUpdate('storeConfig', 'subcategories', [...subs, val].join(', '));
                                  }
                                  setSubcatInput('');
                                 }
                               }}
                               className="px-6 bg-white text-black font-bold text-xs rounded-2xl"
                             >
                               Add
                             </button>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Available Sizes</label>
                           <div className="flex gap-2 flex-wrap mb-3">
                             {(systemData.storeConfig?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || []).map(sz => (
                               <span key={sz} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                 {sz}
                                 <button type="button" onClick={() => {
                                   const sizes = systemData.storeConfig?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                   handleSystemUpdate('storeConfig', 'sizes', sizes.filter(s => s !== sz).join(', '));
                                 }} className="hover:text-red-500">&times;</button>
                               </span>
                             ))}
                           </div>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={sizeInput}
                               onChange={(e) => setSizeInput(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const val = sizeInput.trim();
                                   if (val) {
                                    const sizes = systemData.storeConfig?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                    if (!sizes.includes(val)) {
                                      handleSystemUpdate('storeConfig', 'sizes', [...sizes, val].join(', '));
                                    }
                                    setSizeInput('');
                                   }
                                 }
                               }}
                               placeholder="New Size (e.g. 10x10)..."
                               className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none" 
                             />
                             <button 
                               type="button"
                               onClick={() => {
                                 const val = sizeInput.trim();
                                 if (val) {
                                  const sizes = systemData.storeConfig?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                  if (!sizes.includes(val)) {
                                    handleSystemUpdate('storeConfig', 'sizes', [...sizes, val].join(', '));
                                  }
                                  setSizeInput('');
                                 }
                               }}
                               className="px-6 bg-white text-black font-bold text-xs rounded-2xl"
                             >
                               Add
                             </button>
                           </div>
                        </div>
                        <div>
                           <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Available Colors</label>
                           <div className="flex gap-2 flex-wrap mb-3">
                             {(systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || []).map(color => (
                               <span key={color} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                 {color}
                                 <button type="button" onClick={() => {
                                   const colors = systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                   handleSystemUpdate('storeConfig', 'colors', colors.filter(c => c !== color).join(', '));
                                 }} className="hover:text-red-500">&times;</button>
                               </span>
                             ))}
                           </div>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={colorInput}
                               onChange={(e) => setColorInput(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const val = colorInput.trim();
                                   if (val) {
                                    const colors = systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                    if (!colors.includes(val)) {
                                      handleSystemUpdate('storeConfig', 'colors', [...colors, val].join(', '));
                                    }
                                    setColorInput('');
                                   }
                                 }
                               }}
                               placeholder="New Color..."
                               className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none" 
                             />
                             <button 
                               type="button"
                               onClick={() => {
                                 const val = colorInput.trim();
                                 if (val) {
                                  const colors = systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || [];
                                  if (!colors.includes(val)) {
                                    handleSystemUpdate('storeConfig', 'colors', [...colors, val].join(', '));
                                  }
                                  setColorInput('');
                                 }
                               }}
                               className="px-6 bg-white text-black font-bold text-xs rounded-2xl"
                             >
                               Add
                             </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                  <h3 className="text-xl font-serif italic text-white uppercase">SEO Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Home Meta Title</label>
                         <input 
                           type="text"
                           value={systemData.seo?.homeTitle || ''}
                           onChange={(e) => handleSystemUpdate('seo', 'homeTitle', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none"
                         />
                       </div>
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Home Meta Description</label>
                         <textarea 
                           rows={3}
                           value={systemData.seo?.homeDescription || ''}
                           onChange={(e) => handleSystemUpdate('seo', 'homeDescription', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white resize-none focus:border-white outline-none"
                         />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Product Meta Suffix</label>
                         <input 
                           type="text"
                           value={systemData.seo?.productTitleSuffix || ''}
                           onChange={(e) => handleSystemUpdate('seo', 'productTitleSuffix', e.target.value)}
                           placeholder=" e.g. | 7'O CLOCK"
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none"
                         />
                       </div>
                       <div>
                         <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Default OG Image URL</label>
                         <input 
                           type="text"
                           value={systemData.seo?.homeOgImage || ''}
                           onChange={(e) => handleSystemUpdate('seo', 'homeOgImage', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none"
                         />
                       </div>
                    </div>
                  </div>
               </div>

               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                  <h3 className="text-xl font-serif italic text-white uppercase mb-8">Security & Maintenance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <button onClick={() => alert('Cache flushed successfully.')} className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center group hover:bg-red-500 transition-all">
                        <p className="text-[10px] font-bold text-red-500 group-hover:text-black uppercase tracking-[0.3em]">Flush Cache Archive</p>
                     </button>
                     <button onClick={() => alert('System report generated and downloaded.')} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-center hover:bg-white hover:text-black transition-all">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Generate System Report</p>
                     </button>
                     <button onClick={() => alert('System deployed successfully to live terminals.')} className="p-8 bg-white text-black rounded-[2rem] text-center hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Deploy System v2.4.1</p>
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="leads" className="bg-[#1c1b1b] rounded-[3rem] border border-white/5 p-20 flex flex-col items-center justify-center text-center shadow-2xl">
               <MessageSquare size={48} className="text-green-500 mb-8" />
               <h3 className="text-4xl font-serif italic text-white mb-4 uppercase">WhatsApp Live Pulse</h3>
               <p className="text-text-secondary text-xs uppercase tracking-[0.5em] mb-10 max-w-md mx-auto">Connecting to mobile terminals... Authorized personnel only.</p>
               <button onClick={() => alert('Secure link generated and copied to clipboard.')} className="px-12 py-6 bg-green-500 text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-full">Secure Link</button>
            </motion.div>
          )}
          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="content" className="space-y-8">
               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                  <h3 className="text-xl font-serif italic text-white uppercase">Policies Registration</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Privacy Policy</label>
                      <textarea 
                        rows={4}
                        value={systemData.policies?.privacy || ''}
                        onChange={(e) => handleSystemUpdate('policies', 'privacy', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white outline-none resize-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Terms of Service</label>
                      <textarea 
                        rows={4}
                        value={systemData.policies?.terms || ''}
                        onChange={(e) => handleSystemUpdate('policies', 'terms', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white outline-none resize-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Refund Policy</label>
                      <textarea 
                        rows={4}
                        value={systemData.policies?.refund || ''}
                        onChange={(e) => handleSystemUpdate('policies', 'refund', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-serif italic text-white outline-none resize-none focus:border-white"
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                  <h3 className="text-xl font-serif italic text-white uppercase">Footer Configuration</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">About Text</label>
                      <textarea 
                        rows={3}
                        value={systemData.footer?.aboutText || ''}
                        onChange={(e) => handleSystemUpdate('footer', 'aboutText', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white outline-none resize-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.3em] text-text-secondary mb-3 block">Copyright Text</label>
                      <input 
                        type="text"
                        value={systemData.footer?.copyright || ''}
                        onChange={(e) => handleSystemUpdate('footer', 'copyright', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs text-white focus:border-white outline-none"
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-[#1c1b1b] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-serif italic text-white uppercase">FAQs</h3>
                    <button 
                      onClick={() => {
                        const newFaqs = [...(systemData.faqs || []), { question: 'New Question', answer: 'New Answer' }];
                        handleSystemUpdate('faqs', null, newFaqs);
                      }}
                      className="px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-[10px] font-bold uppercase transition-colors"
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <div className="space-y-6">
                    {(systemData.faqs || []).map((faq, idx) => (
                      <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-4 relative group">
                         <button 
                           onClick={() => {
                             const newFaqs = systemData.faqs?.filter((_, i) => i !== idx);
                             handleSystemUpdate('faqs', null, newFaqs);
                           }}
                           className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           ×
                         </button>
                         <input 
                           type="text" 
                           value={faq.question}
                           placeholder="Question"
                           onChange={(e) => {
                             const newFaqs = [...(systemData.faqs || [])];
                             newFaqs[idx].question = e.target.value;
                             handleSystemUpdate('faqs', null, newFaqs);
                           }}
                           className="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white font-bold outline-none focus:border-white"
                         />
                         <textarea 
                           rows={2}
                           value={faq.answer}
                           placeholder="Answer"
                           onChange={(e) => {
                             const newFaqs = [...(systemData.faqs || [])];
                             newFaqs[idx].answer = e.target.value;
                             handleSystemUpdate('faqs', null, newFaqs);
                           }}
                           className="w-full bg-transparent text-sm text-text-secondary outline-none resize-none"
                         />
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal - Outside of Main container for full screen fix */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 md:p-12 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProduct(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="relative w-full max-w-2xl h-full bg-[#1c1b1b] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                 <h2 className="text-3xl font-serif italic text-white">{editingProduct ? 'Update Sandbox Artifact' : 'Deploy Prototype'}</h2>
                 <button onClick={() => setShowAddProduct(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 text-xl font-light">×</button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 space-y-10 scrollbar-hide">
                 {/* Preset Templates */}
                 <div className="space-y-4">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Deploy From Template</label>
                    <div className="grid grid-cols-3 gap-3">
                       {['Premium Tee', 'Tactical Bottom', 'Outer Shell'].map(t => (
                         <button key={t} className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-[8px] font-bold uppercase tracking-widest text-white hover:border-white transition-all">{t}</button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Artifact Identity</label>
                    <input 
                      type="text" 
                      placeholder="Designator name..." 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-white transition-colors" 
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <input 
                         type="number" 
                         placeholder="Base Price (INR)" 
                         value={newProduct.price || ''}
                         onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-white transition-colors" 
                       />
                       <select 
                         value={newProduct.category}
                         onChange={(e) => setNewProduct({...newProduct, category: e.target.value.toLowerCase()})}
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
                       >
                          <option value="" disabled>Category</option>
                          {(systemData.storeConfig?.categories?.split(',').map(s => s.trim()).filter(Boolean) || ['t-shirts']).map(cat => (
                            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                          ))}
                       </select>
                       <select 
                         value={newProduct.subcategory || ''}
                         onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value.toLowerCase()})}
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
                       >
                          <option value="" disabled>Subcategory</option>
                          {(systemData.storeConfig?.subcategories?.split(',').map(s => s.trim()).filter(Boolean) || ['general']).map(sub => (
                            <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                          ))}
                       </select>
                       <select 
                         value={newProduct.condition || 'New'}
                         onChange={(e) => setNewProduct({...newProduct, condition: e.target.value as any})}
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
                       >
                          <option value="New">New</option>
                          <option value="Used - Excellent">Used - Excellent</option>
                          <option value="Used - Good">Used - Good</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Visual Matrix (Media)</label>
                    <div className="grid grid-cols-4 gap-4">
                       <div className="flex flex-col gap-2 relative">
                         <button 
                           onClick={() => {
                             const url = prompt('Enter Image URL');
                             if (url) setNewProduct({...newProduct, images: [...(newProduct.images || []), url]});
                           }}
                           className="aspect-[3/4] w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                         >
                            <Plus size={20} />
                         </button>
                         <label className="text-[8px] uppercase tracking-widest text-center text-text-secondary cursor-pointer hover:text-white transition-colors">
                           Or Upload File
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setNewProduct({...newProduct, images: [...(newProduct.images || []), reader.result as string]});
                               };
                               reader.readAsDataURL(file);
                             }
                           }} />
                         </label>
                       </div>
                       {newProduct.images?.map((img, i) => (
                         <div key={i} className="relative aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden group">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                           <button 
                             onClick={() => setNewProduct({...newProduct, images: newProduct.images?.filter((_, idx) => idx !== i)})}
                             className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                           >
                             ×
                           </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Structural Variants</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[8px] uppercase tracking-widest mb-4 font-bold text-text-secondary">Custom Product Sizes</p>
                          <div className="flex gap-2 flex-wrap mb-4">
                             {newProduct.sizes.map(sz => (
                               <span key={sz} className="px-3 h-9 bg-white text-black border border-white rounded-lg flex items-center justify-center text-[10px] gap-2">
                                 {sz}
                                 <button type="button" onClick={() => setNewProduct({...newProduct, sizes: newProduct.sizes.filter(s => s !== sz)})} className="hover:text-red-500 font-bold">&times;</button>
                               </span>
                             ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={customSizeInput}
                              onChange={(e) => setCustomSizeInput(e.target.value)}
                              placeholder="New size (e.g. 10x15)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = customSizeInput.trim();
                                  if (val && !newProduct.sizes?.includes(val)) {
                                    setNewProduct({...newProduct, sizes: [...(newProduct.sizes || []), val]});
                                  }
                                  setCustomSizeInput('');
                                }
                              }}
                              className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-xs text-white focus:border-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = customSizeInput.trim();
                                if (val && !newProduct.sizes?.includes(val)) {
                                  setNewProduct({...newProduct, sizes: [...(newProduct.sizes || []), val]});
                                }
                                setCustomSizeInput('');
                              }}
                              className="px-4 bg-white text-black font-bold text-[10px] rounded-lg"
                            >
                              Add
                            </button>
                          </div>
                       </div>
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[8px] uppercase tracking-widest mb-4 font-bold text-text-secondary">Color Selection</p>
                          <div className="flex gap-2 flex-wrap">
                             {(systemData.storeConfig?.colors?.split(',').map(s => s.trim()).filter(Boolean) || ['Black', 'White']).map(color => (
                               <button 
                                 key={color} 
                                 onClick={() => {
                                   const currentColors = newProduct.colors || [];
                                   if (currentColors.includes(color)) {
                                     setNewProduct({...newProduct, colors: currentColors.filter((c: string) => c !== color)});
                                   } else {
                                     setNewProduct({...newProduct, colors: [...currentColors, color]});
                                   }
                                 }}
                                 className={cn("px-3 h-9 border rounded-lg flex items-center justify-center text-[10px] transition-all", newProduct.colors?.includes(color) ? "bg-white text-black border-white" : "bg-white/10 text-white border-transparent")}
                               >
                                 {color}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Product Narrative</label>
                    <textarea 
                      rows={4} 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-white transition-colors resize-none text-sm" 
                      placeholder="Describe the architectural intent behind this artifact..." 
                    />
                 </div>
              </div>
              <div className="p-10 border-t border-white/5 shrink-0 space-y-4">
                 {productError && (
                   <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{productError}</div>
                 )}
                 <button onClick={handleAddProduct} className="w-full py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-full">{editingProduct ? 'Save Changes' : 'Deploy Prototype'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Store Modal */}
      <AnimatePresence>
        {showAddStore && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 md:p-12 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStore(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="relative w-full max-w-2xl h-full bg-[#1c1b1b] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                 <h2 className="text-3xl font-serif italic text-white">{editingStore ? 'Update Storefront' : 'Initialize Storefront'}</h2>
                 <button onClick={() => setShowAddStore(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 text-xl font-light">×</button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 space-y-10 scrollbar-hide">
                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Identity & Contact</label>
                    <input 
                      type="text" 
                      placeholder="Store Name..." 
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                      className="w-full bg-transparent border-b text-center border-white/10 px-4 py-4 text-2xl font-serif italic text-white placeholder-text-secondary outline-none focus:border-white transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="WhatsApp Contact (e.g. 917907976506)" 
                      value={newStore.whatsapp}
                      onChange={(e) => setNewStore({...newStore, whatsapp: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] text-white focus:border-white outline-none" 
                    />
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Visual Asset</label>
                    <div className="flex gap-4 items-center">
                       <input 
                         type="text" 
                         value={newStore.image}
                         onChange={(e) => setNewStore({...newStore, image: e.target.value})}
                         className="flex-grow bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[10px] text-white focus:border-white outline-none" 
                         placeholder="Primary HQ image URL..." 
                       />
                       {newStore.image && (
                         <img src={newStore.image} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                       )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Location & Topography</label>
                    <textarea 
                      rows={2} 
                      value={newStore.location}
                      onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-white transition-colors resize-none text-sm" 
                      placeholder="Street address..." 
                    />
                    <textarea 
                      rows={3} 
                      value={newStore.mapUrl || ''}
                      onChange={(e) => setNewStore({...newStore, mapUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-text-secondary outline-none focus:border-white transition-colors resize-none text-xs font-mono" 
                      placeholder='Google Maps iframe HTML or URL...' 
                    />
                 </div>

                 <div className="space-y-6">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Parameters</label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Status</p>
                          <select 
                            value={newStore.status}
                            onChange={(e) => setNewStore({...newStore, status: e.target.value as 'active' | 'coming_soon'})}
                            className="bg-transparent text-text-secondary text-xs outline-none w-full text-center mt-2"
                          >
                             <option value="active">Active Terminal</option>
                             <option value="coming_soon">Coming Soon</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-10 border-t border-white/5 shrink-0">
                 <button onClick={handleAddStore} className="w-full py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-full">{editingStore ? 'Update Configuration' : 'Initialize Terminal'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
