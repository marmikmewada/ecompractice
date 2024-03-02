// Checkout.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Checkout = () => {
  const { cart, products, isAuthenticated, setCart } = useProductsStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(10); // Example delivery charge

  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total price, discounts, tax, etc. based on your application logic
    let totalPrice = 0;

    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    });

    // Apply discounts, tax, etc.
    const calculatedDiscount = 0; // Example: calculateDiscountFunction();
    const calculatedTax = 0; // Example: calculateTaxFunction();

    setDiscount(calculatedDiscount);
    setTax(calculatedTax);
    setTotalPrice(totalPrice + calculatedTax + deliveryCharge - calculatedDiscount);
  }, [cart, products]);

  const handlePayNow = () => {
    // Implement payment logic here (e.g., redirect to a payment gateway)
    // For simplicity, this example just empties the cart
    setCart([]);
    navigate('/'); // Redirect to the home page after payment
  };

  if (!isAuthenticated) {
    return <p>Please login to proceed to checkout.</p>;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul className="order-items">
          {cart.map((item) => (
            <li key={item.id} className="order-item">
              {/* Display product details as needed */}
              <p>{item.name} - Quantity: {item.quantity}</p>
              {/* Add other product details (price, etc.) */}
            </li>
          ))}
        </ul>
        <div className="price-details">
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <p>Discount: ${discount.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Delivery Charge: ${deliveryCharge.toFixed(2)}</p>
          <h4>Total Amount: ${(totalPrice + tax + deliveryCharge - discount).toFixed(2)}</h4>
        </div>
      </div>
      <button className="pay-now-button" onClick={handlePayNow}>
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
