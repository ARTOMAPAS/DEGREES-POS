import { useState, useEffect } from "react";
import { useProductsContext } from "../../../hooks/useProductsContext";
import { useCategoriesContext } from "../../../hooks/useCategoriesContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

const ProductForm = ({ closeModal }) => {
  const { dispatch } = useProductsContext();
  const { categories, dispatch: dispatchCategories } = useCategoriesContext();
  const { user } = useAuthContext();

  const [category, setCategory] = useState("");
  const [product_name, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [added_by] = useState(user._id);
  const [productImage, setProductImage] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    // Fetch existing categories when the component mounts
    const fetchCategories = async () => {
      const response = await fetch('/category', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatchCategories({ type: "SET_CATEGORIES", payload: json });
      }
    };

    fetchCategories();
  }, [user.token, dispatchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }
    console.log(product_name)
    // Continue with adding the product
    const productData = {
      category_id: category,
      product_name,
      description,
      price,
      added_by,
      productImage: productImage ? await convertImageToBase64(productImage) : null,
    };
    const response = await fetch('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const jsonData = await response.json();

    if (!response.ok) {
      setError(jsonData.error);
      setEmptyFields(jsonData.emptyFields);
    }

    if (response.ok) {
      setError(null);
      setCategory("");
      setProductName("");
      setDescription("");
      setPrice("");
      setEmptyFields([]);
      console.log("New Product Added", jsonData);
      dispatch({ type: "CREATE_PRODUCT", payload: jsonData });
      closeModal();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <form className="create" onSubmit={handleSubmit}>
          <h3>Add new Product</h3>
          <label>Category</label>
          <div>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className={emptyFields.includes("category_id") ? "error" : ""}
            >
              <option value="">Select or type a category</option>
              {categories &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
            </select>
          </div>
          <br />
          <label>Product Name</label>
          <input
            type="text"
            onChange={(e) => setProductName(e.target.value)}
            value={product_name}
            className={emptyFields.includes("product_name") ? "error" : ""}
          />
          <br />
          <label>Description</label>
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className={emptyFields.includes("description") ? "error" : ""}
          />
          <br />
          <label>Price</label>
          <input
            type="Number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className={emptyFields.includes("price") ? "error" : ""}
          />
          <br />
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <button>Add Product</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
