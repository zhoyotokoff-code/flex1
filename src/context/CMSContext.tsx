import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, getDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCTS as INITIAL_PRODUCTS, STORES as INITIAL_STORES } from '../constants';

export const DEFAULT_SYSTEM_DATA = {
  hero: {
    subtitle: 'The New Standard',
    titlePrimary: 'Sophisticated',
    titleSecondary: 'Sculpted Wear',
    backgroundImage: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=1920&h=1080',
    desktopVideo: '',
    mobileVideo: '',
    ctaText: 'Shop Pieces'
  },
  marquee: {
    text: "THE ARCHIVE COLLECTION • SUMMER SERIES 2026 • 7'O CLOCK SIGNATURE"
  },
  lookbook: {
    mainImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1920',
    mainTitle: 'Silent Structure',
    secondaryImage1: 'https://shorturl.at/JqAoR?auto=format&fit=crop&q=80&w=1000',
    secondaryImage2: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=1000'
  },
  manifesto: {
    subtitle: 'Manifesto',
    text: 'Architecture for the body.<br />Silence for the soul.'
  },
  banners: {
    banner1Image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=1000',
    banner1Title: 'Structural<br />Denim',
    banner2Image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
    banner2Title: 'Technical<br />Outerwear'
  },
  policies: {
    privacy: 'Privacy policy text here...',
    terms: 'Terms of service text here...',
    refund: 'Refund policy text here...'
  },
  faqs: [
    { question: 'What is the return policy?', answer: 'We accept returns within 14 days.' }
  ],
  footer: {
    aboutText: 'Redefining modern masculinity with luxury streetwear and precision tailoring. Style starts at 7\'O Clock.',
    copyright: '© 2024 USED FLEX. SHEETS TEAM . All Rights Reserved.'
  },
  seo: {
    homeTitle: "7'O CLOCK MENS FASHION",
    homeDescription: "Redefining modern masculinity with luxury streetwear and precision tailoring.",
    homeOgImage: "https://images.unsplash.com/photo-1550614000-4b95d4ebfa88",
    productTitleSuffix: " | USED FLEX."
  },
  settings: {
    whatsapp: '+91 7907976506',
    currency: 'INR',
    notifications: true,
    logoText: 'USED FLEX.',
    splashText: 'USED FLEX.',
    mapXml: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!..." width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
  },
  storeConfig: {
    categories: 't-shirts, pants, baggys, shoes',
    subcategories: 'general, premium, limited',
    sizes: 'XS, S, M, L, XL, XXL',
    colors: 'Black, White'
  }
};

export type SystemData = typeof DEFAULT_SYSTEM_DATA;

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  total: number;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  date: string;
};

const DEFAULT_ORDERS: Order[] = [];

interface CMSContextType {
  systemData: SystemData;
  updateSystemData: (section: keyof SystemData, field: string | null, value: any) => Promise<void>;
  loading: boolean;
  products: typeof INITIAL_PRODUCTS;
  updateProduct: (product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  stores: typeof INITIAL_STORES;
  updateStore: (store: any) => Promise<void>;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [systemData, setSystemData] = useState<SystemData>(() => {
    const saved = localStorage.getItem('archive_system_data');
    return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_DATA;
  });
  const [products, setProducts] = useState<typeof INITIAL_PRODUCTS>(() => {
    const saved = localStorage.getItem('archive_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [stores, setStores] = useState<typeof INITIAL_STORES>(() => {
    const saved = localStorage.getItem('archive_stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('archive_orders_v2');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt loading from localstorage first for instant render
    const saved = localStorage.getItem('archive_system_data');
    if (saved) {
      try {
        setSystemData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse system data");
      }
    }

    const unsubSystem = onSnapshot(doc(db, 'system', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const fireData = docSnap.data() as Partial<SystemData>;
        const mergedData = {
          hero: { ...DEFAULT_SYSTEM_DATA.hero, ...(fireData.hero || {}) },
          marquee: { ...DEFAULT_SYSTEM_DATA.marquee, ...(fireData.marquee || {}) },
          lookbook: { ...DEFAULT_SYSTEM_DATA.lookbook, ...(fireData.lookbook || {}) },
          manifesto: { ...DEFAULT_SYSTEM_DATA.manifesto, ...(fireData.manifesto || {}) },
          banners: { ...DEFAULT_SYSTEM_DATA.banners, ...(fireData.banners || {}) },
          policies: { ...DEFAULT_SYSTEM_DATA.policies, ...(fireData.policies || {}) },
          faqs: fireData.faqs || DEFAULT_SYSTEM_DATA.faqs,
          footer: { ...DEFAULT_SYSTEM_DATA.footer, ...(fireData.footer || {}) },
          seo: { ...DEFAULT_SYSTEM_DATA.seo, ...(fireData.seo || {}) },
          settings: { ...DEFAULT_SYSTEM_DATA.settings, ...(fireData.settings || {}) },
          storeConfig: { ...DEFAULT_SYSTEM_DATA.storeConfig, ...(fireData.storeConfig || {}) },
        };
        setSystemData(mergedData);
        localStorage.setItem('archive_system_data', JSON.stringify(mergedData));
      } else {
        // Initialize default locally and try to sync
        setSystemData(DEFAULT_SYSTEM_DATA);
        const seedSystem = async () => {
          try {
            await setDoc(doc(db, 'system', 'config'), DEFAULT_SYSTEM_DATA, { merge: true });
          } catch(e) {
            console.warn("Could not seed system config");
          }
        };
        seedSystem();
      }
    }, (error) => {
      console.warn("CMS System listener error:", error);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedProducts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as typeof INITIAL_PRODUCTS;
        setProducts(loadedProducts);
        localStorage.setItem('archive_products', JSON.stringify(loadedProducts));
      } else {
        // Fallback to initial locally if empty
        const initial = JSON.parse(localStorage.getItem('archive_products') || JSON.stringify(INITIAL_PRODUCTS));
        setProducts(initial);
        // Try to seed but don't crash if no permissions
        initial.forEach(async (p: any) => {
            try {
              const cleanP = Object.fromEntries(Object.entries(p).filter(([_, v]) => v !== undefined));
              await setDoc(doc(db, 'products', p.id), cleanP);
            } catch (e) {
              console.warn("Could not seed product", p.id);
            }
        });
      }
    }, (error) => {
      console.warn("CMS Products listener error:", error);
    });

    const unsubStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedStores = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as typeof INITIAL_STORES;
        setStores(loadedStores);
        localStorage.setItem('archive_stores', JSON.stringify(loadedStores));
      } else {
        const initial = JSON.parse(localStorage.getItem('archive_stores') || JSON.stringify(INITIAL_STORES));
        setStores(initial);
        initial.forEach(async (s: any) => {
            try {
              const cleanS = Object.fromEntries(Object.entries(s).filter(([_, v]) => v !== undefined));
              await setDoc(doc(db, 'stores', s.id), cleanS);
            } catch (e) {
              console.warn("Could not seed store", s.id);
            }
        });
      }
    }, (error) => {
      console.warn("CMS Stores listener error:", error);
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Order[];
        setOrders(loadedOrders);
        localStorage.setItem('archive_orders_v2', JSON.stringify(loadedOrders));
      } else {
        const initial = JSON.parse(localStorage.getItem('archive_orders_v2') || JSON.stringify(DEFAULT_ORDERS));
        setOrders(initial);
        initial.forEach(async (o: any) => {
            try {
              await setDoc(doc(db, 'orders', o.id), o);
            } catch (e) {
              console.warn("Could not seed order", o.id);
            }
        });
      }
      setLoading(false);
    }, (error) => {
      console.warn("CMS Orders listener error:", error);
      setLoading(false);
    });

    return () => {
        unsubSystem();
        unsubProducts();
        unsubStores();
        unsubOrders();
    };
  }, []);

  const updateSystemData = async (section: keyof SystemData, field: string | null, value: any) => {
    let newData;
    if (field === null) {
      newData = {
        ...systemData,
        [section]: value
      };
    } else {
      newData = {
        ...systemData,
        [section]: {
          ...systemData[section],
          [field]: value
        }
      };
    }
    setSystemData(newData); // optimistic update
    localStorage.setItem('archive_system_data', JSON.stringify(newData));
    try {
      await setDoc(doc(db, 'system', 'config'), newData, { merge: true });
    } catch(e) {
      console.warn("Firebase updateSystemData failed, relying on local state.", e);
    }
  };
  
  const updateProduct = async (product: any) => {
    // Optimistic update
    const newProducts = products.map(p => p.id === product.id ? { ...p, ...product } : p);
    if (!products.some(p => p.id === product.id)) {
      newProducts.unshift(product);
    }
    setProducts(newProducts);
    localStorage.setItem('archive_products', JSON.stringify(newProducts));
    
    try {
      await setDoc(doc(db, 'products', product.id), product, { merge: true });
    } catch(e) {
      console.warn("Firebase updateProduct failed, relying on local state.", e);
    }
  };
  
  const deleteProduct = async (id: string) => {
    // Optimistic update
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('archive_products', JSON.stringify(newProducts));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn("Firebase deleteProduct failed, relying on local state.", e);
    }
  };

  const updateStore = async (store: any) => {
    // Optimistic update
    const newStores = stores.map(s => s.id === store.id ? { ...s, ...store } : s);
    if (!stores.some(s => s.id === store.id)) {
      newStores.push(store);
    }
    setStores(newStores);
    localStorage.setItem('archive_stores', JSON.stringify(newStores));

    try {
      await setDoc(doc(db, 'stores', store.id), store, { merge: true });
    } catch (e) {
      console.warn("Firebase updateStore failed, relying on local state.", e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
      await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
  };

  return (
    <CMSContext.Provider value={{ systemData, updateSystemData, loading, products, updateProduct, deleteProduct, stores, updateStore, orders, updateOrderStatus }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
