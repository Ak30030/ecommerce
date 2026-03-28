import {Routes,Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {CheckoutPage} from './pages/CheckoutPage';
import {OrdersPage} from './pages/OrdersPage';
import {TrackingPage} from './pages/TrackingPage';
import { CartProvider } from './contexts/CartContext';
import { ResetButton } from './components/ResetButton';
import './App.css';

function App() {
  

  return (
    <CartProvider>
    <Routes>
    <Route index element={<HomePage />}/>
    <Route path="/checkout" element={<CheckoutPage />}/>
    <Route path="/orders" element={<OrdersPage />}/>
    <Route path="/tracking" element={<TrackingPage/>}/>
    </Routes>
    <ResetButton />
    </CartProvider>
   
  )
}

export default App
