import {Header} from '../components/header';
import './OrdersPage.css';

export function OrdersPage() {
    return (
        <>
            <title>Orders</title>
            
            <Header/>

            <div className="orders-page">
                <div className="page-title">Your orders</div>
                
                <div className="orders-grid">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999',
                        fontSize: '18px'
                    }}>
                        <p>No orders yet.</p>
                        <p>Your orders will appear here.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
