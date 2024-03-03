import React from "react";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Signup from "./components/SignUp";

import "./App.css"; // Assuming the CSS file is in the same directory
import SingleProduct from "./components/SingleProduct";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/SingleProduct" element={<SingleProduct/>}/>
        <Route path="/Checkout" element={<Checkout/>}/>
        <Route path="/SignUp" element={<Signup/>}/>
        <Route path="/Login" element={<Login/>}/>


        

        
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
