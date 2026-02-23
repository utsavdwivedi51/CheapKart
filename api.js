/**
 * api.js — Axios service layer for Cheapkart frontend→backend communication
 *
 * Usage in components:
 *   import api from '../api/api';
 *   const { data } = await api.auth.login(email, password);
 *
 * To switch from localStorage mode to full API mode, update AppContext.js
 * to call these functions instead of directly dispatching.
 */

import axios from 'axios';

// ── Base instance ──────────────────────────────────────────────
const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
http.interceptors.request.use(config => {
  const token = localStorage.getItem('ck_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear stale token
http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ck_token');
      localStorage.removeItem('ck_user');
    }
    return Promise.reject(err?.response?.data || err);
  }
);

// ── Auth API ───────────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password, mobile) =>
    http.post('/auth/register', { name, email, password, mobile }),

  login: (email, password) =>
    http.post('/auth/login', { email, password }),

  getMe: () =>
    http.get('/auth/me'),

  updateProfile: (data) =>
    http.put('/auth/profile', data),

  changePassword: (currentPassword, newPassword) =>
    http.put('/auth/change-password', { currentPassword, newPassword }),
};

// ── Products API ───────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) =>
    http.get('/products', { params }),

  getById: (id) =>
    http.get(`/products/${id}`),

  search: (q, params = {}) =>
    http.get('/products', { params: { q, ...params } }),
};

// ── Orders API ─────────────────────────────────────────────────
export const ordersAPI = {
  place: (items, shippingAddress, payment) =>
    http.post('/orders', { items, shippingAddress, payment }),

  getAll: (params = {}) =>
    http.get('/orders', { params }),

  getById: (id) =>
    http.get(`/orders/${id}`),

  cancel: (id) =>
    http.put(`/orders/${id}/cancel`),
};

// ── Wishlist API ───────────────────────────────────────────────
export const wishlistAPI = {
  get: () =>
    http.get('/wishlist'),

  toggle: (productId) =>
    http.post(`/wishlist/${productId}`),
};

// ── Addresses API (future) ────────────────────────────────────
export const addressAPI = {
  getAll: () =>
    http.get('/addresses'),

  add: (address) =>
    http.post('/addresses', address),

  update: (id, address) =>
    http.put(`/addresses/${id}`, address),

  delete: (id) =>
    http.delete(`/addresses/${id}`),

  setDefault: (id) =>
    http.patch(`/addresses/${id}/default`),
};

export default http;

// ── Helper: save token after login/register ────────────────────
export const saveAuthToken = (token) => {
  localStorage.setItem('ck_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('ck_token');
  localStorage.removeItem('ck_user');
};
