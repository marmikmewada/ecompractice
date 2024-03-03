import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Profile = () => {
  const {
    user,
    fetchUser,
    fetchPreviousOrders,
    fetchCurrentOrderStatus,
    login,
    isAuthenticated,
    error,
  } = useProductsStore();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          await fetchUser();
          await fetchPreviousOrders();
          await fetchCurrentOrderStatus();
          setIsDataLoaded(true);
        } else {
          setIsDataLoaded(true); // Don't attempt default login or redirect
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsDataLoaded(true); // Set to true to avoid indefinite loading
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, login]);

  if (!isDataLoaded) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error loading profile data.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      {!isAuthenticated && (
        <div className="login-container">
          <p>You are not logged in.</p>
          <button onClick={() => navigate('/login')}>Login</button>
          <p>
            New user? <Link to="/signup">Sign up</Link> here.
          </p>
        </div>
      )}

      {isAuthenticated && (
        <div className="user-info">
          <p className="user-info-item">Name: {user.name}</p>
          <p className="user-info-item">Email: {user.email}</p>
        </div>
      )}

      {user.previousOrders.length > 0 && (
        <>
          <h3 className="orders-title">Previous Orders</h3>
          <ul className="order-list">
            {user.previousOrders.map((order) => (
              <li key={order.id} className="order-item">
                Order ID: {order.id}
                {/* Display other relevant order details as needed */}
              </li>
            ))}
          </ul>
        </>
      )}

      {user.currentOrderStatus && (
        <>
          <h3 className="pending-order-title">Pending Order</h3>
          <p className="order-status">
            Current Order Status: {user.currentOrderStatus}
          </p>
        </>
      )}
    </div>
  );
};

export default Profile;
