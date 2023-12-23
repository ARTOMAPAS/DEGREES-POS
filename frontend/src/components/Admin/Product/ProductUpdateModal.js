import React, { useState, useEffect } from "react";
import { useProductsContext } from "../../hooks/useProductsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const ProductUpdateModal = ({ closeModal, productToUpdate }) => {
  const { dispatch } = useProductsContext();
  const { user } = useAuthContext();

  const [category, setCategory] = useState(productToUpdate.category);
  const [product_name, setProductName] = useState(productToUpdate.product_name);
  const [description, setDescription] = useState(productToUpdate.description);
  const [price, setPrice] = useState(productToUpdate.price);
  const [productImage, setProductImage] = useState(productToUpdate.productImage);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCategory(productToUpdate.category);
    setProductName(productToUpdate.product_name);
    setDescription(productToUpdate.description);
    setPrice(productToUpdate.price);
  }, [productToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("product_name", product_name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("added_by", user._id);
      if (productImage) {
        formData.append("productImage", productImage);
      }

      const response = await fetch(`/product/${productToUpdate._id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setError(null);
        setCategory(json.category);
        setProductName(json.product_name);
        setDescription(json.description);
        setPrice(json.price);
        setProductImage(json.productImage);
        dispatch({ type: "UPDATE_PRODUCT", payload: json });
        closeModal();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <form className="update" onSubmit={handleSubmit}>
          <h3>Update Product</h3>

          <label>Category</label>
          <input
            type="text"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          />
          <br />
          <label>Product Name</label>
          <input
            type="text"
            onChange={(e) => setProductName(e.target.value)}
            value={product_name}
          />
          <br />
          <label>Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <br />
          <label>Price</label>
          <input
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <br />
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <button>Update Product</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateModal;
