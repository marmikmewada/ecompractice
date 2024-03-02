import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, fetchUser, isSignupRedirect, setIsSignupRedirect } = useProductsStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Check if the user should be redirected to signup
  if (isSignupRedirect) {
    // Reset the signup redirection flag
    setIsSignupRedirect(false);
    navigate('/signup');
    return null;
  }

  // Redirect to home if the user is already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* ... (existing form fields) */}
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
      
      {/* Provide a link to the signup page */}
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
