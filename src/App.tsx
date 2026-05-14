/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import CategoriesPage from './pages/CategoriesPage';
import NewArrivals from './pages/NewArrivals';
import StoresPage from './pages/StoresPage';
import SearchPage from './pages/SearchPage';
import WishlistSharedPage from './pages/WishlistSharedPage';
import { CartProvider } from './context/CartContext';
import { CMSProvider } from './context/CMSContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import PolicyPage from './pages/PolicyPage';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  return (
    <HelmetProvider>
      <CMSProvider>
        <AuthProvider>
          <Router>
            <CartProvider>
              <AnimatePresence>
                {!isReady && <SplashScreen onComplete={() => setIsReady(true)} />}
              </AnimatePresence>
              
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="new-arrivals" element={<NewArrivals />} />
                  <Route path="product/:id" element={<ProductPage />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="categories" element={<CategoriesPage />} /> 
                  <Route path="stores" element={<StoresPage />} /> 
                  <Route path="search" element={<SearchPage />} /> 
                  <Route path="wishlist" element={<WishlistSharedPage />} /> 
                  <Route path="privacy-policy" element={<PolicyPage />} /> 
                  <Route path="terms" element={<PolicyPage />} /> 
                  <Route path="refund-policy" element={<PolicyPage />} /> 
                </Route>
              </Routes>
            </CartProvider>
          </Router>
        </AuthProvider>
      </CMSProvider>
    </HelmetProvider>
  );
}
