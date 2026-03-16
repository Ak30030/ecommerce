import { Header } from "../components/header";
import "./OrdersPage.css";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "3a5a925a-ff34-644a-d890-035c1d785808",
    placed: "February 20",
    total: 61.3,
    items: [
      {
        id: 1,
        name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
        image: "images/products/athletic-cotton-socks-6-pairs.jpg",
        delivered: "March 3",
        quantity: 2,
      },
      {
        id: 2,
        name: "Intermediate Size Basketball",
        image: "images/products/intermediate-composite-basketball.jpg",
        delivered: "February 25",
        quantity: 1,
      },
      {
        id: 3,
        name: "Adults Plain Cotton T-Shirt - 2 Pack",
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        delivered: "March 3",
        quantity: 1,
      },
    ],
  },
];

export function OrdersPage() {
  return (
    <>
      <div className="orders-header">
        <div className="header-left">
          <Link to="/" className="header-link">
            <img className="logo" src="images/logo-white.png" alt="logo" />
          </Link>
        </div>

        <div className="header-right">
          <Link to="/checkout" className="header-link">
            Cart
          </Link>
        </div>
      </div>

      <div className="orders-page">
        <h1>Your Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-summary">
              <div>
                <div className="order-summary-label">Order Placed:</div>
                {order.placed}
              </div>
              <div>
                <div className="order-summary-label">Total:</div>
                ${order.total.toFixed(2)}
              </div>
              <div>
                <div className="order-summary-label">Order ID:</div>
                {order.id}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-meta">
                      Delivered on: {item.delivered} • Quantity: {item.quantity}
                    </div>
                    <div className="order-item-actions">
                      <button className="button-primary">Add to Cart</button>
                      <button className="button-secondary">Track package</button>
                    </div>
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

