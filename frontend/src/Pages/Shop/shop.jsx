import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import shopData from '../../data/shop.json';
import "./shop.css";

const Shop = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('browse'); // browse, cart, checkout, confirmation

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('graminSwasthyaAuth');
    const prefs = localStorage.getItem('graminSwasthyaPrefs');
    
    if (!auth) {
      navigate('/language');
      return;
    }
    
    setUserAuth(JSON.parse(auth));
    if (prefs) {
      setUserPrefs(JSON.parse(prefs));
    }

    // Load existing cart
    const existingCart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    setCart(existingCart);
  }, [navigate]);

  const categories = [
    { id: 'all', name: 'All Medicines', icon: '💊' },
    { id: 'pain-relief', name: 'Pain Relief', icon: '🩹' },
    { id: 'fever', name: 'Fever & Cold', icon: '🤒' },
    { id: 'stomach', name: 'Stomach Care', icon: '🫃' },
    { id: 'vitamins', name: 'Vitamins', icon: '💪' },
    { id: 'first-aid', name: 'First Aid', icon: '🏥' },
    { id: 'chronic', name: 'Chronic Care', icon: '⚕️' }
  ];

  const filteredMedicines = shopData.medicines.filter(medicine => {
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...medicine, quantity: 1 }];
    }
    
    setCart(updatedCart);
    localStorage.setItem('medicineCart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(medicineId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.id === medicineId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('medicineCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (medicineId) => {
    const updatedCart = cart.filter(item => item.id !== medicineId);
    setCart(updatedCart);
    localStorage.setItem('medicineCart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart first');
      return;
    }
    setCurrentStep('checkout');
  };

  const confirmOrder = () => {
    // Simulate order processing
    const order = {
      id: Date.now(),
      items: cart,
      total: getTotalPrice(),
      deliveryFee: 50,
      patientAadhar: userAuth.aadhar,
      status: 'confirmed',
      estimatedDelivery: '2-3 business days',
      orderedAt: new Date().toISOString()
    };

    // Store order in localStorage (in real app, this would be saved to database)
    const existingOrders = JSON.parse(localStorage.getItem('medicineOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('medicineOrders', JSON.stringify(existingOrders));

    // Clear cart
    setCart([]);
    localStorage.removeItem('medicineCart');
    
    setCurrentStep('confirmation');
  };

  if (!userAuth) {
    return <div>Loading...</div>;
  }

  return (
    <MotionWrapper className="shop-container" variant="container">
      <div className="shop-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back to Home
        </button>
        <h1>💊 Medicine Shop</h1>
        <p>Order medicines with home delivery</p>
        
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)} 
          className="cart-toggle-btn"
        >
          🛒 Cart ({getTotalItems()})
        </button>
      </div>

      {currentStep === 'browse' && (
        <div className="browse-section">
          {/* Search and Filter */}
          <div className="search-filter-section">
            <div className="search-bar">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicines... / दवाई खोजें..."
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>

            <div className="category-filter">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Grid */}
          <div className="medicines-grid">
            {filteredMedicines.map(medicine => (
              <div key={medicine.id} className="medicine-card">
                <div className="medicine-image">
                  <img src={medicine.image || '/api/placeholder/150/150'} alt={medicine.name} />
                  {medicine.prescriptionRequired && (
                    <div className="prescription-badge">Rx Required</div>
                  )}
                </div>
                
                <div className="medicine-info">
                  <h3>{medicine.name}</h3>
                  <p className="generic-name">{medicine.genericName}</p>
                  <p className="manufacturer">by {medicine.manufacturer}</p>
                  
                  <div className="medicine-details">
                    <div className="price">
                      <span className="current-price">₹{medicine.price}</span>
                      {medicine.originalPrice && (
                        <span className="original-price">₹{medicine.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="stock-info">
                      {medicine.inStock ? (
                        <span className="in-stock">✅ In Stock</span>
                      ) : (
                        <span className="out-of-stock">❌ Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="medicine-meta">
                    <span className="dosage">💊 {medicine.dosage}</span>
                    <span className="pack-size">📦 {medicine.packSize}</span>
                  </div>

                  <div className="medicine-actions">
                    {cart.find(item => item.id === medicine.id) ? (
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(medicine.id, cart.find(item => item.id === medicine.id).quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">
                          {cart.find(item => item.id === medicine.id).quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(medicine.id, cart.find(item => item.id === medicine.id).quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(medicine)}
                        className="add-to-cart-btn"
                        disabled={!medicine.inStock}
                      >
                        {medicine.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="no-results">
              <h3>No medicines found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>🛒 Your Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className="close-cart-btn">×</button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image || '/api/placeholder/50/50'} alt={item.name} />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>₹{item.price} each</p>
                    </div>
                    <div className="cart-item-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <p>Total: ₹{getTotalPrice()}</p>
                  <p>Delivery: ₹50</p>
                  <h4>Grand Total: ₹{getTotalPrice() + 50}</h4>
                </div>
                <button onClick={proceedToCheckout} className="checkout-btn">
                  🚀 Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout */}
      {currentStep === 'checkout' && (
        <div className="checkout-section">
          <h2>🚀 Checkout</h2>
          
          <div className="checkout-content">
            <div className="order-summary">
              <h3>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="checkout-total">
                <div className="checkout-item">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="checkout-item">
                  <span>Delivery Fee:</span>
                  <span>₹50</span>
                </div>
                <div className="checkout-item total">
                  <span>Total:</span>
                  <span>₹{getTotalPrice() + 50}</span>
                </div>
              </div>
            </div>

            <div className="delivery-info">
              <h3>Delivery Information</h3>
              <div className="info-card">
                <p><strong>Delivery Address:</strong> Home address on file</p>
                <p><strong>Estimated Delivery:</strong> 2-3 business days</p>
                <p><strong>Payment Method:</strong> Cash on Delivery</p>
              </div>
            </div>

            <div className="prescription-notice">
              <h4>⚠️ Important Notice</h4>
              <p>Prescription medicines will require verification before delivery. Our pharmacist will contact you for prescription details.</p>
            </div>

            <div className="checkout-actions">
              <button onClick={() => setCurrentStep('browse')} className="back-to-shop-btn">
                ← Back to Shop
              </button>
              <button onClick={confirmOrder} className="confirm-order-btn">
                ✅ Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {currentStep === 'confirmation' && (
        <div className="confirmation-section">
          <div className="success-animation">
            <div className="success-icon">✅</div>
            <h2>Order Confirmed!</h2>
            <p>Your medicine order has been successfully placed</p>
          </div>

          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-card">
              <p><strong>Order Total:</strong> ₹{getTotalPrice() + 50}</p>
              <p><strong>Estimated Delivery:</strong> 2-3 business days</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              <p><strong>Tracking:</strong> SMS updates will be sent</p>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>📱 You'll receive SMS updates about your order</li>
              <li>📞 Our pharmacist may call for prescription verification</li>
              <li>🚛 Delivery partner will contact you before delivery</li>
              <li>💳 Payment will be collected on delivery</li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <button onClick={() => {
              setCurrentStep('browse');
              setIsCartOpen(false);
            }} className="continue-shopping-btn">
              🛒 Continue Shopping
            </button>
            <button onClick={() => navigate('/home')} className="home-btn">
              🏠 Back to Home
            </button>
          </div>
        </div>
      )}
    </MotionWrapper>
  );
};

export default Shop;