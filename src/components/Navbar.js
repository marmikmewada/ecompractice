import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store'; // Assuming this is the path

const Navbar = () => {
  const { productsInCart, isAuthenticated, logout } = useProductsStore(); // Get cart length and authentication status from store

  useEffect(() => {
    // Re-render the component whenever productsInCart changes
    console.log(productsInCart);
  }, [productsInCart]);

  return (
    <div className='navbar'>
      <Link className='Link' to="/">
        <h1>Shopping App</h1>
      </Link>

      <div className="links">
        <Link title='Profile' to="/Profile" className='Link'>Profile</Link>
        <Link title='Products' to="/" className='Link'>Products</Link>
        {/* Cart link with badge */}
        <Link title='Cart' to="/Cart" className='Link'>
          Cart {productsInCart > 0 ? `${productsInCart}` : ''}
        </Link>

        {/* Conditional rendering for login/logout button */}
        {isAuthenticated ? (
          <button className="logout-button" onClick={logout}>Logout</button>
        ) : (
          <Link title='Login' to="/Login" className='Link'>Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
