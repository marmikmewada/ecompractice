import React from 'react';
import { useProductsStore } from '../store/Store'; // Assuming this is the path

const SingleProduct = () => {
  const { products, selectedProductId, addToCart } = useProductsStore();

  const product = products.find((product) => product.id === selectedProductId);

  if (!product) {
    return <p className="product-not-found">Product not found.</p>;
  }

  const { image, title, price, description } = product;

  return (
    <div className="single-product-container">
      <img src={image} alt={title} className="product-image" />
      <div className="product-details">
        <h2 className="product-title">{title}</h2>
        <p className="product-price">{price}</p>
        <p className="product-description">{description}</p>
        <div className="product-actions">
          <button
            className="add-to-cart-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
