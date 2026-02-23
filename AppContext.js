import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('ck_user') || 'null'),
  cart: JSON.parse(localStorage.getItem('ck_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('ck_wishlist') || '[]'),
  orders: JSON.parse(localStorage.getItem('ck_orders') || '[]'),
  toasts: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      localStorage.setItem('ck_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    }
    case 'LOGOUT': {
      localStorage.removeItem('ck_user');
      return { ...state, user: null };
    }
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existing = state.cart.find(c => c.id === product.id);
      const cart = existing
        ? state.cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
        : [...state.cart, { ...product, qty: 1 }];
      localStorage.setItem('ck_cart', JSON.stringify(cart));
      return { ...state, cart };
    }
    case 'REMOVE_FROM_CART': {
      const cart = state.cart.filter(c => c.id !== action.payload);
      localStorage.setItem('ck_cart', JSON.stringify(cart));
      return { ...state, cart };
    }
    case 'UPDATE_QTY': {
      const { id, delta } = action.payload;
      const cart = state.cart
        .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter(c => c.qty > 0);
      localStorage.setItem('ck_cart', JSON.stringify(cart));
      return { ...state, cart };
    }
    case 'CLEAR_CART': {
      localStorage.setItem('ck_cart', '[]');
      return { ...state, cart: [] };
    }
    case 'TOGGLE_WISHLIST': {
      const product = action.payload;
      const idx = state.wishlist.findIndex(w => w.id === product.id);
      const wishlist = idx >= 0
        ? state.wishlist.filter(w => w.id !== product.id)
        : [...state.wishlist, product];
      localStorage.setItem('ck_wishlist', JSON.stringify(wishlist));
      return { ...state, wishlist };
    }
    case 'PLACE_ORDER': {
      const orders = [action.payload, ...state.orders];
      localStorage.setItem('ck_orders', JSON.stringify(orders));
      localStorage.setItem('ck_cart', '[]');
      return { ...state, orders, cart: [] };
    }
    case 'ADD_TOAST': {
      return { ...state, toasts: [...state.toasts, action.payload] };
    }
    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Each toast gets a unique, stable ID at creation time
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  const toast = {
    success: (m) => showToast(m, 'success'),
    error:   (m) => showToast(m, 'error'),
    info:    (m) => showToast(m, 'info'),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, toast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
