import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, discount } from '../data';
import './OtherPages.css';
import './OrderSuccess.css';

// ─────────────────────────────────────────
// ORDER SUCCESS PAGE
// ─────────────────────────────────────────
export function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been confirmed. You'll receive updates via SMS &amp; email.</p>
        <div className="order-id-box">
          <div className="oid-label">Order ID</div>
          <div className="oid-value">{orderId}</div>
        </div>
        <div className="success-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
            <i className="fas fa-map-marker-alt"></i> Track Order
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// WISHLIST PAGE
// ─────────────────────────────────────────
export function Wishlist({ onLoginRequired }) {
  const { state, dispatch, toast } = useApp();
  const navigate = useNavigate();
  const { wishlist } = state;

  if (!state.user) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3 className="empty-title">Save your favourite items</h3>
          <p className="empty-desc">Login to view and manage your Wishlist</p>
          <button className="btn btn-primary" onClick={onLoginRequired}>Login Now</button>
        </div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3 className="empty-title">Your Wishlist is empty</h3>
          <p className="empty-desc">Save items you love to your wishlist. Review them anytime.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <h2 className="page-heading">
        My Wishlist{' '}
        <span className="page-heading-count">({wishlist.length})</span>
      </h2>
      <div className="wishlist-grid">
        {wishlist.map(p => {
          const disc = discount(p);
          return (
            <div key={p.id} className="wishlist-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="wishlist-card-img">{p.emoji}</div>
              <div className="wishlist-card-body">
                <div className="wishlist-card-name" title={p.name}>{p.name}</div>
                <div className="wishlist-price-row">
                  <span className="wishlist-price">{formatPrice(p.price)}</span>
                  <span className="wishlist-orig">{formatPrice(p.original)}</span>
                  <span className="wishlist-disc">{disc}% off</span>
                </div>
                <div className="wishlist-actions">
                  <button
                    className="btn btn-accent btn-sm"
                    style={{ flex: 1 }}
                    onClick={e => {
                      e.stopPropagation();
                      dispatch({ type: 'ADD_TO_CART', payload: p });
                      toast.success('Added to Cart 🛒');
                    }}
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  <button
                    className="btn btn-sm wishlist-remove-btn"
                    onClick={e => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_WISHLIST', payload: p });
                      toast.info('Removed from Wishlist');
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ORDERS PAGE
// ─────────────────────────────────────────
export function Orders() {
  const { state, toast } = useApp();
  const navigate = useNavigate();
  const { orders } = state;

  if (!state.user) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">Track your orders</h3>
          <p className="empty-desc">Login to see your order history and tracking.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">No orders yet!</h3>
          <p className="empty-desc">All your orders will appear here after you shop.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      </div>
    );
  }

  const statusColor = (status) => {
    const map = {
      'Delivered': 'var(--success)',
      'Processing': 'var(--accent)',
      'Cancelled': 'var(--danger)',
      'Shipped': 'var(--primary)',
      'Returned': 'var(--text-light)',
    };
    return map[status] || 'var(--primary)';
  };

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <h2 className="page-heading">My Orders</h2>
      {[...orders].map(o => (
        <div key={o.id} className="order-card">
          <div className="order-card-header">
            <div>
              <div className="order-id">Order #{o.id}</div>
              <div className="order-date">Placed on {o.date}</div>
            </div>
            <div className="order-status" style={{ color: statusColor(o.status) }}>
              {o.status}
            </div>
          </div>

          {o.items.map((item, i) => (
            <div key={i} className="order-item-row">
              <div className="order-item-emoji">{item.emoji}</div>
              <div className="order-item-info">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-meta">
                  Qty: {item.qty} &bull; {formatPrice(item.price * item.qty)}
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                Buy Again
              </button>
            </div>
          ))}

          <div className="order-card-footer">
            <div className="order-footer-total">
              Total:{' '}
              <strong>
                {formatPrice(o.total || o.items.reduce((s, i) => s + i.price * i.qty, 0))}
              </strong>
            </div>
            <div className="order-footer-actions">
              {['Track Order', 'Return', 'Invoice', 'Rate & Review'].map(a => (
                <button
                  key={a}
                  className="btn btn-outline btn-sm"
                  onClick={() => toast.info(`${a} — coming soon`)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────
export function Profile({ onLoginRequired }) {
  const { state, dispatch, toast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('personal');

  if (!state.user) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3 className="empty-title">Please login</h3>
          <p className="empty-desc">Login to view your profile, orders and more.</p>
          <button className="btn btn-primary" onClick={onLoginRequired}>Login Now</button>
        </div>
      </div>
    );
  }

  const { user } = state;

  const TABS = [
    { key: 'personal',  icon: 'fa-user',           label: 'Personal Info' },
    { key: 'orders',    icon: 'fa-box',             label: 'My Orders' },
    { key: 'addresses', icon: 'fa-map-marker-alt',  label: 'My Addresses' },
    { key: 'payments',  icon: 'fa-credit-card',     label: 'Payments' },
    { key: 'reviews',   icon: 'fa-star',            label: 'Reviews' },
    { key: 'notifs',    icon: 'fa-bell',            label: 'Notifications' },
  ];

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-circle">
            {(user.avatar || user.name[0]).toUpperCase()}
          </div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>

          <nav className="profile-nav">
            {TABS.map(t => (
              <div
                key={t.key}
                className={`profile-nav-item ${tab === t.key && t.key !== 'orders' ? 'active' : ''}`}
                onClick={() => t.key === 'orders' ? navigate('/orders') : setTab(t.key)}
              >
                <i className={`fas ${t.icon}`}></i>
                {t.label}
              </div>
            ))}
            <div
              className="profile-nav-item profile-logout"
              onClick={() => {
                dispatch({ type: 'LOGOUT' });
                navigate('/');
                toast.info('Logged out successfully');
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <div className="profile-content">

          {tab === 'personal' && (
            <div>
              <h3 className="profile-section-title">Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="input" defaultValue={user.name.split(' ')[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="input" defaultValue={user.name.split(' ')[1] || ''} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="input" type="email" defaultValue={user.email} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input className="input" type="tel" placeholder="Enter mobile number" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="select">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="input" type="date" />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('Profile updated ✅')}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          )}

          {tab === 'addresses' && (
            <div>
              <h3 className="profile-section-title">My Addresses</h3>
              <div className="address-card">
                <div className="address-type-badge">HOME</div>
                <div className="address-detail">
                  <strong>{user.name}</strong><br />
                  123 MG Road, Koramangala<br />
                  Bangalore – 560034, Karnataka<br />
                  Mobile: 9876543210
                </div>
                <div className="address-btns">
                  <button className="btn btn-outline btn-sm" onClick={() => toast.info('Edit address coming soon')}>Edit</button>
                  <button className="btn btn-sm addr-delete-btn" onClick={() => toast.info('Address removed')}>Remove</button>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => toast.info('Add address coming soon!')}>
                <i className="fas fa-plus"></i> Add New Address
              </button>
            </div>
          )}

          {tab === 'payments' && (
            <div>
              <h3 className="profile-section-title">Saved Payment Methods</h3>
              <div className="payment-method-card">
                <i className="fas fa-credit-card pm-icon pm-bank"></i>
                <div className="pm-info">
                  <div className="pm-name">HDFC Bank Debit Card</div>
                  <div className="pm-sub">**** **** **** 4521</div>
                </div>
                <button className="btn btn-sm pm-remove-btn" onClick={() => toast.info('Card removed')}>Remove</button>
              </div>
              <div className="payment-method-card">
                <i className="fas fa-mobile-alt pm-icon pm-upi"></i>
                <div className="pm-info">
                  <div className="pm-name">UPI — user@okaxis</div>
                  <div className="pm-sub">Linked and verified ✓</div>
                </div>
                <button className="btn btn-sm pm-remove-btn" onClick={() => toast.info('UPI removed')}>Remove</button>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => toast.info('Add payment method coming soon!')}>
                <i className="fas fa-plus"></i> Add Method
              </button>
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              <h3 className="profile-section-title">My Reviews</h3>
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div style={{ fontSize: 56 }}>⭐</div>
                <h3 className="empty-title" style={{ marginTop: 12 }}>No reviews yet</h3>
                <p className="empty-desc">Rate and review your purchased products.</p>
                <button className="btn btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
              </div>
            </div>
          )}

          {tab === 'notifs' && (
            <div>
              <h3 className="profile-section-title">Notification Preferences</h3>
              {[
                { label: 'Order Updates', desc: 'Shipping, delivery and cancellation alerts' },
                { label: 'Price Drop Alerts', desc: 'When wishlist items go on sale' },
                { label: 'Offers & Deals', desc: 'Personalised deals, coupons and flash sales' },
                { label: 'New Arrivals', desc: 'Latest products in your favourite categories' },
                { label: 'Cheapkart Plus', desc: 'SuperCoins balance and Plus-member benefits' },
              ].map((n, i) => (
                <div key={i} className="notif-pref-row">
                  <div>
                    <div className="notif-label">{n.label}</div>
                    <div className="notif-desc">{n.desc}</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PLUS PAGE
// ─────────────────────────────────────────
export function PlusPage() {
  const navigate = useNavigate();
  const BENEFITS = [
    { icon: '🚀', title: 'Free Express Delivery', desc: 'Priority delivery on all orders' },
    { icon: '🪙', title: '2× SuperCoins', desc: 'Double coins on every purchase' },
    { icon: '🎬', title: 'Hotstar Premium', desc: '1-year subscription included' },
    { icon: '🏥', title: 'Health Insurance', desc: '₹1 lakh coverage for the family' },
    { icon: '🔁', title: 'Easy Returns', desc: 'Hassle-free returns on all orders' },
    { icon: '🎁', title: 'Exclusive Offers', desc: 'Members-only deals and discounts' },
  ];

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="plus-hero">
        <div className="plus-hero-star">⭐</div>
        <h1 className="plus-hero-title">Cheapkart Plus</h1>
        <p className="plus-hero-sub">Earn &amp; burn SuperCoins. Unlock exclusive benefits every day!</p>
        <div className="plus-stats">
          <div className="plus-stat"><div className="plus-stat-val">100</div><div className="plus-stat-label">SuperCoins Earned</div></div>
          <div className="plus-stat"><div className="plus-stat-val">4</div><div className="plus-stat-label">Free Deliveries Left</div></div>
          <div className="plus-stat"><div className="plus-stat-val">Gold</div><div className="plus-stat-label">Current Tier</div></div>
        </div>
        <button className="plus-upgrade-btn" onClick={() => {}}>Upgrade to Plus — ₹499/yr</button>
      </div>

      <h2 className="plus-benefits-title">Plus Benefits</h2>
      <div className="plus-benefits-grid">
        {BENEFITS.map((b, i) => (
          <div key={i} className="plus-benefit-card">
            <div className="plus-benefit-icon">{b.icon}</div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="plus-cta-strip">
        <p>Start earning SuperCoins with your next purchase!</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Shop Now</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// NOTIFICATIONS PAGE
// ─────────────────────────────────────────
export function Notifications() {
  const { toast } = useApp();
  const navigate = useNavigate();

  const NOTIFS = [
    { icon: '📦', type: 'Order', title: 'Your order has been shipped!', desc: 'Order #OD1234567890 is on its way. Expected delivery: Tomorrow', time: '2 hours ago', unread: true },
    { icon: '🏷️', type: 'Offer', title: 'Flash Sale starts in 1 hour!', desc: 'Electronics up to 60% off. Set a reminder to never miss a deal.', time: '5 hours ago', unread: true },
    { icon: '💰', type: 'Price Drop', title: 'Price drop on your wishlist item', desc: 'Samsung Galaxy S24 Ultra is now ₹10,000 cheaper!', time: '1 day ago', unread: false },
    { icon: '🪙', type: 'SuperCoins', title: 'You earned 50 SuperCoins!', desc: 'Coins credited for your last purchase. Total balance: 150 coins.', time: '2 days ago', unread: false },
    { icon: '⭐', type: 'Review', title: 'Rate your recent purchase', desc: 'How was your Nike Air Max 270? Leave a review and earn 20 coins.', time: '3 days ago', unread: false },
    { icon: '🎁', type: 'Offer', title: 'Exclusive Plus member deal', desc: 'Get 15% extra off on orders above ₹2000 — valid today only.', time: '4 days ago', unread: false },
  ];

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="page-heading" style={{ marginBottom: 0 }}>Notifications</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => toast.info('All notifications marked as read')}>
          Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            className="card"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, cursor: 'pointer',
              borderLeft: n.unread ? '4px solid var(--primary)' : '4px solid transparent',
              background: n.unread ? 'var(--primary-light)' : 'var(--white)',
              transition: 'all 0.2s',
            }}
            onClick={() => toast.info('Opening notification...')}
          >
            <div style={{ fontSize: 36, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 10, marginBottom: 4, display: 'inline-block' }}>
                    {n.type}
                  </span>
                  <div style={{ fontWeight: n.unread ? 700 : 500, fontSize: 14, marginTop: 2 }}>{n.title}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', flexShrink: 0 }}>{n.time}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4, lineHeight: 1.5 }}>{n.desc}</div>
            </div>
            {n.unread && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }}></div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          <i className="fas fa-shopping-bag"></i> Continue Shopping
        </button>
      </div>
    </div>
  );
}
