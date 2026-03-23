import axios from "axios";
import { useState, useEffect } from "react";
import { Header } from "../components/header";
import "./OrdersPage.css";

const hardcodedOrders = [
  {
    id: "3a5a925a-ff34-644a-d890-035c1d785808",
    placed: "February 20",
    total: 61.3,
    items: [
      {
        id: 1,
        name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
        image: "/images/products/athletic-cotton-socks-6-pairs.jpg",
        delivered: "March 3",
        quantity: 2,
      },
      {
        id: 2,
        name: "Intermediate Size Basketball",
        image: "/images/products/intermediate-composite-basketball.jpg",
        delivered: "February 25",
        quantity: 1,
      },
      {
        id: 3,
        name: "Adults Plain Cotton T-Shirt - 2 Pack",
        image: "/images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        delivered: "March 3",
        quantity: 1,
      },
    ],
  }
];

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState(hardcodedOrders);

  useEffect(() => {
    axios.get('/api/orders?expand=products')
      .then((response) => {
        console.log('API response:', response.data);

        const normalized = response.data.map((order) => ({
          ...order,
          placed: order.placed || (order.orderTimeMs ? new Date(order.orderTimeMs).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Unknown'),
          total: order.total ?? (order.totalCostCents ? order.totalCostCents / 100 : 0),
          totalCents: order.totalCents ?? order.totalCostCents,
          items: order.items || order.products?.map((item) => ({
            id: item.id || item.productId || Math.random(),
            name: item.name || item.product?.name || 'Unknown Product',
            image: item.image || item.product?.image || '/images/products/athletic-cotton-socks-6-pairs.jpg',
            delivered: item.delivered || (item.estimatedDeliveryTimeMs ? new Date(item.estimatedDeliveryTimeMs).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : null),
            quantity: item.quantity ?? 1,
          })) || [],
        }));

        setOrders(normalized);
      });
  }, []);

  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page-container">
        <h1 className="orders-title">Your Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="order-card">

            {/* Order Summary Bar */}
            <div className="order-summary-bar">
              <div className="order-summary-item">
                <span className="summary-label">Order Placed:</span>
                <span className="summary-value">{order.placed}</span>
              </div>
              <div className="order-summary-item">
                <span className="summary-label">Total:</span>
                <span className="summary-value">
                  ${order.totalCents
                    ? (order.totalCents / 100).toFixed(2)
                    : (order.total ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="order-summary-item order-id">
                <span className="summary-label">Order ID:</span>
                <span className="summary-value">{order.id}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-list">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item-row">
                  <img
                    src={item.image?.startsWith('/') ? item.image : `/${item.image}`}
                    alt={item.name}
                    className="order-item-img"
                  />

                  <div className="order-item-info">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-delivered">
                      {item.delivered
                        ? `Delivered on: ${item.delivered}`
                        : `Arriving on: ${item.arriving}`}
                    </div>
                    <div className="order-item-qty">Quantity: {item.quantity}</div>
                    <button className="btn-add-to-cart">🛒 Add to Cart</button>
                  </div>

                  <div className="order-item-actions">
                    <button className="btn-track">Track package</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </>
  );
}