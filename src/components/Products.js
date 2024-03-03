import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '../store/Store';

const Products = () => {
  const {
    products,
    searchResults,
    search,
    setSelectedProductId,
    addToCart,
    setProducts,
  } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch products when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products'); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data); // Update the store with the fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='products-section'>
      <form onSubmit={handleSubmit} className='search-bar'>
        <input
          type='text'
          value={searchTerm}
          onChange={handleInputChange}
          placeholder='Search products...'
        />
        <button type='submit'>Search</button>
      </form>

      <div className='products-container'>
        {(searchResults && searchResults.length > 0
          ? searchResults
          : products
        ).map((product) => (
          <div key={product.id} className='product'>
            <Link
              onClick={() => setSelectedProductId(product.id)}
              to={`/SingleProduct`}
            >
              <img src={product.image} alt={product.name} />
            </Link>

            <div className='details'>
              <Link
                onClick={() => setSelectedProductId(product.id)}
                className='Link black'
                to={`/SingleProduct`}
              >
                <h4>{product.title}</h4>
              </Link>
              <h5>{product.price}</h5>
              <button onClick={() => addToCart(product)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>

      {!products.length && !searchTerm && (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Products;
