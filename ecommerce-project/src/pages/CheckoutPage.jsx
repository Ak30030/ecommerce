import axios from 'axios';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { formatMoney } from '../utils/money';
import './checkout-header.css';
import './CheckoutPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Loading.css';

export function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useNavigate();
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelayedNavigation = async (to) => {
    setIsNavigating(true);
    await wait(1000); // 1 second professional delay before navigation
    setIsNavigating(false);
    navigate(to);
  };

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      try {
        const [deliveryRes, paymentRes] = await Promise.all([
          axios.get('/api/delivery-options?expand=estimatedDeliveryTime'),
          axios.get('/api/payment-summary'),
        ]);

        setDeliveryOptions(deliveryRes.data);
        setPaymentSummary(paymentRes.data);
      } catch (error) {
        console.error('Error loading checkout data:', error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => setIsLoading(false), remaining);
      }
    };

    loadData();
  }, []);

  const handleDeliveryOptionChange = async (productId, deliveryOptionId) => {
    try {
      await axios.put(`/api/cart-items/${productId}`, { deliveryOptionId });
      await fetchCart();
      setCartItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, deliveryOptionId } : item)));
      const summary = await axios.get('/api/payment-summary');
      setPaymentSummary(summary.data);
    } catch (error) {
      console.error('Error updating delivery option:', error);
    }
  };

  const handleUpdateQuantity = (productId) => {
    console.log('Update quantity for', productId);
  };

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(`/api/cart-items/${productId}`);
      await fetchCart();
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      const summary = await axios.get('/api/payment-summary');
      setPaymentSummary(summary.data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/orders');
      await wait(750);
      await fetchCart();
      setCartItems([]);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/" className="logo-link" onClick={async (e) => { e.preventDefault(); await handleDelayedNavigation('/'); }}>
              <img className="logo" src="/images/mini-shop-logo.jpg" alt="" />
              <img className="mobile-logo" src="/images/mini-shop-logo.jpg" alt="" />
              <span className="brand-name" style={{ marginLeft: '8px', fontWeight: 700 }}>Mini Shop</span>
            </a>
          </div>

          <div className="checkout-header-middle-section">
            {isNavigating ? (
              <div className="checkout-loading">Preparing your page, please wait...</div>
            ) : isLoading ? (
              <div className="checkout-loading">Loading checkout data...</div>
            ) : (
              <>
                Checkout (<a href="#" className="return-to-home-link" onClick={async (e) => { e.preventDefault(); await handleDelayedNavigation('/'); }}>{cart.length} items</a>)
              </>
            )}
          </div>

          <div className="checkout-header-right-section">
            <img src="/images/icons/checkout-lock-icon.png" alt="Secure icon" />
          </div>
        </div>
      </div>

      {isNavigating && (
        <div className="navigation-wait-overlay">
          <div className="navigation-wait-message">Please wait while navigation completes...</div>
        </div>
      )}

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <a href="/" onClick={async (e) => { e.preventDefault(); await handleDelayedNavigation('/'); }}>Continue shopping</a>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="order-summary">
              {cartItems.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find((option) => option.id === cartItem.deliveryOptionId);

                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date: {selectedDeliveryOption ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D') : 'Not selected'}
                    </div>
                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image?.startsWith('/') ? cartItem.product.image : `/${cartItem.product.image}`}
                        alt={cartItem.product.name}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">{cartItem.product.name}</div>
                        <div className="product-price">{formatMoney(cartItem.product.priceCents)}</div>
                        <div className="product-quantity">
                          <span>
                            Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                          </span>
                          <span className="update-quantity-link link-primary" onClick={() => handleUpdateQuantity(cartItem.productId)}>Update</span>
                          <span className="delete-quantity-link link-primary" onClick={() => handleDeleteItem(cartItem.productId)}>Delete</span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">Choose a delivery option:</div>
                        {deliveryOptions.length === 0 ? (
                          <div className="no-delivery-options">Loading delivery options...</div>
                        ) : (
                          deliveryOptions.map((option) => {
                            const priceString = option.priceCents > 0 ? `${formatMoney(option.priceCents)} - Shipping` : 'FREE Shipping';
                            return (
                              <div key={option.id} className="delivery-option">
                                <input
                                  type="radio"
                                  checked={option.id === cartItem.deliveryOptionId}
                                  onChange={() => handleDeliveryOptionChange(cartItem.productId, option.id)}
                                  className="delivery-option-input"
                                  name={`delivery-option-${cartItem.productId}`}
                                />
                                <div>
                                  <div className="delivery-option-date">{dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}</div>
                                  <div className="delivery-option-price">{priceString}</div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="payment-summary">
              <div className="payment-summary-title">Payment Summary</div>

              {paymentSummary ? (
                <>
                  <div className="payment-summary-row">
                    <div>Items ({paymentSummary.totalItems}):</div>
                    <div className="payment-summary-money">{formatMoney(paymentSummary.productCostCents)}</div>
                  </div>
                  <div className="payment-summary-row">
                    <div>Shipping &amp; handling:</div>
                    <div className="payment-summary-money">{formatMoney(paymentSummary.shippingCostCents)}</div>
                  </div>
                  <div className="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostBeforeTaxCents)}</div>
                  </div>
                  <div className="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div className="payment-summary-money">{formatMoney(paymentSummary.taxCents)}</div>
                  </div>
                  <div className="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostCents)}</div>
                  </div>
                  <button className="place-order-button button-primary" onClick={handlePlaceOrder}>Place your order</button>
                </>
              ) : (
                <div>Loading payment summary...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
