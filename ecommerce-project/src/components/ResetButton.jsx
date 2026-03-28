import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import './ResetButton.css';

export function ResetButton() {
    const { fetchCart } = useCart();

    const handleReset = () => {
        axios.post('/api/reset')
            .then(() => {
                fetchCart();
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error resetting database:', error);
            });
    };

    return (
        <button className="reset-button-floating" onClick={handleReset}>
            🔄
        </button>
    );
}
