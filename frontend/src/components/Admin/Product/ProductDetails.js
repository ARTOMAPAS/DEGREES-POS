import React from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';


const ProductDetails = ({ product }) => {


  return (
    <div>
      {product.productImage && (
        <img
          className="product-img"
          src={product.productImage}
          alt={product.product_name}
        />
      )}
      <h4>{product.product_name}</h4>
      <p>Category: {product.category}</p>
      <p>Price: {product.price}</p>
      <p>Description: {product.description}</p>
      <p>{formatDistanceToNow(new Date(product.createdAt), { addSuffix: true})}</p>
      <button>Update Product</button>
    </div>
  );
};

export default ProductDetails;
