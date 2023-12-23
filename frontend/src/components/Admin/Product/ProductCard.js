
import '../../../style/product.css';

const ProductCard = ({ product, onSelect }) => {

  return (
    <div className="product-card" onClick={onSelect}>
      {product.productImage && (
        <img
          className="product-card-img"
          src={product.productImage.startsWith('/productuploads/') ? `${process.env.REACT_APP_SERVER_URL}${product.productImage}` : product.productImage}
          alt={product.product_name}
        />
      )}
      <div className="product-info">
        <div className="product-name">{product.product_name}</div>
        <div className="product-price">{product.price}</div>
        <div><u>View Details →</u></div>
      </div>
    </div>
  );
};

export default ProductCard;
