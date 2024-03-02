import React from 'react';
import { useProductsStore } from '../store/Store';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, addToCart, removeFromCart, emptyCart } = useProductsStore();

  const handleEmptyCart = () => {
    emptyCart(); // Use the emptyCart function to clear the cart and set productsInCart to 0
  };

  const handleCheckout = () => {
    // Alert the user that checkout is currently unavailable
    alert('Checkout functionality coming soon!');

    // Optionally, you can add logic to:
    // - Log the cart contents to the console or other storage
    // - Clear the cart after displaying the alert
  };

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className='cart-container'>
      <h2>Your Cart</h2>
      <ul className='cart-items'>
        {cart.map((item) => (
          <li key={item.id} className='cart-item'>
            <div className='item-image-container'>
              <img src={item.image} alt={item.title} width="100" />
            </div>
            <div className='item-details'>
              <h4>{item.title}</h4>
              <p>Price: {item.price}</p>
              <div className='quantity-controls'>
                <button
                  onClick={() => removeFromCart(item.id)}
                  disabled={item.quantity === 1} // Disable "Remove" for quantity 1
                  className='quantity-button'
                >
                  -
                </button>
                <p className='quantity-value'>{item.quantity}</p>
                <button onClick={() => addToCart(item)} className='quantity-button'>
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleEmptyCart} className='empty-cart-button'>
        Empty Cart
      </button>
      {/* Add the checkout button */}
      <Link to={'/Checkout'}>
      <button onClick={handleCheckout} className='checkout-button'>
        Checkout (Coming Soon)
      </button>
      </Link>
    </div>
  );
};

export default Cart;
