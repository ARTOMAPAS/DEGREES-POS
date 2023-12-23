// ItemForm.js
import { useState, useEffect } from "react";
import { useItemsContext } from "../../../hooks/useItemsContext";
import { useItemTypesContext } from "../../../hooks/useItemTypesContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

const ItemForm = ({ closeModal }) => {
  const { dispatch } = useItemsContext();
  const { itemTypes, dispatch: dispatchItemTypes } = useItemTypesContext();
  const { user } = useAuthContext();

  const [itemType, setItemType] = useState("");
  const [item_name, setItemName] = useState("");
  const [costs, setCosts] = useState([]);
  const [total_qty, setTotalQty] = useState("");
  const [added_by] = useState(user._id);
  const [itemImage, setItemImage] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    // Fetch existing itemTypes when the component mounts
    const fetchItemTypes = async () => {
      const response = await fetch('/itemType', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatchItemTypes({ type: "SET_CATEGORIES", payload: json });
      }
    };

    fetchItemTypes();
  }, [user.token, dispatchItemTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    // Continue with adding the item
    const itemData = {
      branchId: user.branchID, // Assuming branchId is derived from user
      item_type: itemType,
      item_name,
      costs,
      total_qty,
      added_by,
      itemImage: itemImage ? await convertImageToBase64(itemImage) : null,
    };
    
    const response = await fetch('/item', {
      method: 'POST',
      body: JSON.stringify(itemData),
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
      setItemType("");
      setItemName("");
      setCosts([]);
      setTotalQty("");
      setEmptyFields([]);
      console.log("New Item Added", jsonData);
      dispatch({ type: "CREATE_ITEM", payload: jsonData });
      closeModal();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);
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
          <h3>Add new Item</h3>
          <label>ItemType</label>
          <div>
            <select
              onChange={(e) => setItemType(e.target.value)}
              value={itemType}
              className={emptyFields.includes("item_type") ? "error" : ""}
            >
              <option value="">Select or type a itemType</option>
              {itemTypes &&
                itemTypes.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.itemType_name}
                  </option>
                ))}
            </select>
          </div>
          <br />
          <label>Item Name</label>
          <input
            type="text"
            onChange={(e) => setItemName(e.target.value)}
            value={item_name}
            className={emptyFields.includes("item_name") ? "error" : ""}
          />
          <br />
          <label>Costs</label>
          <input
            type="text"
            onChange={(e) => setCosts(e.target.value.split(",").map(cost => parseFloat(cost)))}
            value={costs.join(",")}
            className={emptyFields.includes("costs") ? "error" : ""}
          />
          <br />
          <label>Total Quantity</label>
          <input
            type="Number"
            onChange={(e) => setTotalQty(e.target.value)}
            value={total_qty}
            className={emptyFields.includes("total_qty") ? "error" : ""}
          />
          <br />
          <label>Item Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <button>Add Item</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
