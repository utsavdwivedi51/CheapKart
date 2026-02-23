import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { OrderSuccess, Wishlist, Orders, Profile, PlusPage, Notifications } from './pages/OtherPages';

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 16px' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontFamily: "'Fraunces', serif", marginBottom: 8, fontSize: 28 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}

function AppInner() {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);

  return (
    <>
      <Header onLoginClick={openLogin} />

      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/"                    element={<Home            onLoginRequired={openLogin} />} />
          <Route path="/category/:cat"       element={<Category        onLoginRequired={openLogin} />} />
          <Route path="/product/:id"         element={<ProductDetail   onLoginRequired={openLogin} />} />
          <Route path="/cart"                element={<Cart />} />
          <Route path="/checkout"            element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/wishlist"            element={<Wishlist        onLoginRequired={openLogin} />} />
          <Route path="/orders"              element={<Orders />} />
          <Route path="/profile"             element={<Profile         onLoginRequired={openLogin} />} />
          <Route path="/plus"                element={<PlusPage />} />
          <Route path="/notifications"       element={<Notifications />} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer />
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
