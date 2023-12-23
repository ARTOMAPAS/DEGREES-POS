import React from 'react';

const ProductCard = ({ product, onSelect, isOrdered, orderedQuantity}) => {


  return (
    <div className={`cashier-product-card ${isOrdered ? 'ordered' : ''}`}>
      {product.productImage && (
        <img
          className="cashier-product-card-img"
          src={product.productImage.startsWith('/productuploads/') ? `${process.env.REACT_APP_SERVER_URL}${product.productImage}` : product.productImage}
          alt={product.product_name}
        />
      )}
      <div className="cashier-product-info">
        <div className="cashier-product-name">{product.product_name}</div>
        <div className="cashier-product-description">{product.description}</div>
        <div className="cashier-product-price">{product.price}</div>
        {isOrdered && (
          <div>

            <span className='quantity'>Ordered: {orderedQuantity}</span>

          </div>
        )}
        {!isOrdered && (
          <div>
            <button onClick={() => onSelect(product, 1)}>Add Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
