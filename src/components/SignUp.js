// Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isAuthenticated } = useProductsStore();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup({ name, email, password });
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  // Redirect to home if the user is already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="signup-container">
      <h2>Sign up</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" onClick={handleSignup}>
          Sign up
        </button>
      </form>
      
      {/* Provide a link to the login page */}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
