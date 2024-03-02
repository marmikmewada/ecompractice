import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store'; // Assuming this is the path to your store

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { products, setProducts, setSelectedProductId, addToCart } = useProductsStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
        
      }
      // console.log(cart)
    };

    fetchData();
  }, []);

  return (
    <div className='products-section'>
      {isLoading ? (
        <h1 className='loading'>Loading products...</h1>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className='products-container'>
          {products.map((product) => (
            <div key={product.id} className="product">
              <Link onClick={() => setSelectedProductId(product.id)} to={`/SingleProduct`}>
                <img src={product.image} alt={product.name} />
              </Link>

              <div className='details'>
                <Link onClick={() => setSelectedProductId(product.id)} className='Link black' to={`/SingleProduct`}>
                  <h4>{product.title}</h4>
                </Link>
                <h5>{product.price}</h5>
                <button onClick={() => {addToCart(product)}}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
