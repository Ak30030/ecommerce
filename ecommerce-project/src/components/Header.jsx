import './header.css';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function Header({searchQuery, setSearchQuery, onSearch, isLoading = false}) {
    const { cart } = useCart();

    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });
    
       return(

    <div className ="header">
        <div className ="left-section">
            <Link to="/" className ="header-link">
              <img
                className="logo"
                src="/images/mini-shop-logo.jpg"
                alt="Mini Shop Logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img
                className="mobile-logo"
                src="/images/mini-shop-logo.jpg"
                alt="Mini Shop Mobile Logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="brand-name">mini shop</span>
            </Link>
        </div>

        <div className ="middle-section">
            {isLoading ? (
                <div className="header-loading">
                    <div className="header-loading-spinner"></div>
                    <span className="header-loading-text">Loading...</span>
                </div>
            ) : (
                <>
                    <input className ="search-bar" type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

                    <button className ="search-button" onClick={onSearch}>
                    <img className ="search-icon" src="/images/icons/search-icon.png" />
                    </button>
                </>
            )}
        </div>

        <div className ="right-section">
            <Link to="/orders" className ="orders-link header-link">

            <span className ="orders-text">Orders</span>
            </Link>

            <Link to="/checkout" className ="cart-link header-link">
            <img className ="cart-icon" src="/images/icons/cart-icon.png" />
            <div className ="cart-quantity">{totalQuantity}</div>
            <div className ="cart-text">Cart</div>
            </Link>
        </div>
        </div>
        );
}
