import React from "react";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";

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

        
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
