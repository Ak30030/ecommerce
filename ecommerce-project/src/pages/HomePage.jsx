import axios from 'axios';
import { useEffect,useState } from 'react';
import { Header } from '../components/header';
import { formatMoney } from '../utils/money';   
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Loading.css';

export function HomePage() {
    const [products, setProducts] = useState([]);
    const [addedToCart, setAddedToCart] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const { fetchCart } = useCart();
    const [isLoading, setIsLoading] = useState(true);
   

    useEffect(() => {
        const loadProducts = async () => {
            const startTime = Date.now();
            try {
                console.log('Starting to load products...');
                const response = await axios.get('/api/products');
                console.log('Products loaded successfully');
                setProducts(response.data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                // Ensure loading screen shows for at least 1 second
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 1000 - elapsed);
                setTimeout(() => {
                    console.log('Setting isLoading to false for home');
                    setIsLoading(false);
                }, remaining);
            }
        };
        loadProducts();
    }, []);

    const handleAddToCart = (productId, quantity) => {
        axios.post('/api/cart-items', { productId, quantity })
            .then(() => {
                setAddedToCart(prev => ({ ...prev, [productId]: true }));
                setTimeout(() => setAddedToCart(prev => ({ ...prev, [productId]: false })), 2000);
                fetchCart(); // Update cart after adding
            })
            .catch(error => console.error('Error adding to cart:', error));
    };

    const handleSearch = () => {
        axios.get(`/api/products?search=${encodeURIComponent(searchQuery)}`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error searching products:', error));
    };

    return (
        <>
        
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} isLoading={isLoading} />

            <div className="home-page">
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-container">
                            <div className="product-image-container">
                                <img
                                    className="product-image"
                                    src={product.image?.startsWith('/') ? product.image : `/${product.image}`}
                                />
                            </div>

                            <div className="product-name limit-text-to-2-lines">
                               {product.name}
                            </div>

                            <div className="product-rating-container">
                                <img className="product-rating-stars"
                                    src={`/images/ratings/rating-${product.rating.stars * 10}.png`} />
                                <div className="product-rating-count link-primary">
                                {product.rating.count}
                                </div>
                            </div>

                            <div className="product-price">
                                {formatMoney(product.priceCents)}
                            </div>

                            <div className="product-quantity-container">
                                <select id={`quantity-${product.id}`}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>

                            <div className="product-spacer"></div>

                            <div className={`added-to-cart ${addedToCart[product.id] ? 'visible' : ''}`}>
                                <img src="/images/icons/checkmark.png" />
                                Added
                            </div>

                            <button className="add-to-cart-button button-primary" onClick={() => {
                                const select = document.getElementById(`quantity-${product.id}`);
                                const quantity = parseInt(select.value);
                                handleAddToCart(product.id, quantity);
                            }}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

                {products.length === 0 && searchQuery && (
                    <div className="no-results-message">
                        No product match your search
                    </div>
                )}
            </div>
        </>
    );
}