import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useProductsStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      if (error.message === 'Login failed: User not found') {
        alert('User not found. Please click the "Sign up" button below to create an account.');
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  // Redirect to home if the user is already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>

      <p>Don't have an account? <Link to="/SignUp">Sign up</Link></p>
    </div>
  );
};

export default Login;
