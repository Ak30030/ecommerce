import './header.css';
import './TrackingPage.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../components/header';
import './Loading.css';

export function TrackingPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            const loadOrder = async () => {
                const startTime = Date.now();
                try {
                    console.log('Starting to load order for tracking...');
                    const response = await axios.get(`/api/orders/${orderId}?expand=products`);
                    console.log('Order loaded successfully');
                    setOrder(response.data);
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    // Ensure loading screen shows for at least 1 second
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, 1000 - elapsed);
                    setTimeout(() => {
                        console.log('Setting isLoading to false for tracking');
                        setIsLoading(false);
                    }, remaining);
                }
            };
            loadOrder();
        } else {
            setIsLoading(false);
        }
    }, [orderId]);

    const handleSearch = () => {
        // No search functionality on tracking page
    };

    const getProgressStatus = (deliveryTime) => {
        const now = new Date();
        const delivery = new Date(deliveryTime);
        const diffDays = Math.ceil((delivery - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Delivered';
        if (diffDays <= 3) return 'Shipped';
        return 'Preparing';
    };

    const deliveryDate = order?.products?.[0]?.estimatedDeliveryTimeMs ? new Date(order.products[0].estimatedDeliveryTimeMs).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';

    return (
        <>
        {isLoading ? (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading tracking...</p>
            </div>
        ) : (
        <>
         <title>Tracking</title>

            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />

            <div className="tracking-page">
                <div className="order-tracking">
                    <Link className="back-to-orders-link link-primary" to="/orders">
                        View all orders
                    </Link>

                    <div className="delivery-date">
                        Order arriving on {deliveryDate}
                    </div>

                    {order?.products?.map((item, index) => {
                        const product = item.product;
                        const status = getProgressStatus(item.estimatedDeliveryTimeMs);
                        return (
                            <div key={index} className="product-tracking">
                                <div className="product-info">
                                    {product?.name || 'Product Name'}
                                </div>

                                <div className="product-info">
                                    Quantity: {item.quantity || 1}
                                </div>

                                <img className="product-image" src={product?.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : '/images/products/athletic-cotton-socks-6-pairs.jpg'} />

                                <div className="progress-labels-container">
                                    <div className={`progress-label ${status === 'Preparing' ? 'current-status' : ''}`}>
                                        Preparing
                                    </div>
                                    <div className={`progress-label ${status === 'Shipped' ? 'current-status' : ''}`}>
                                        Shipped
                                    </div>
                                    <div className={`progress-label ${status === 'Delivered' ? 'current-status' : ''}`}>
                                        Delivered
                                    </div>
                                </div>

                                <div className="progress-bar-container">
                                    <div className="progress-bar"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
        )}
        </>
    );
}