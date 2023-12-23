import React, { useState, useEffect } from 'react';
import { useItemTypesContext } from '../../../hooks/useItemTypesContext';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ItemTypeModal = ({ closeModal }) => {
  const { user } = useAuthContext();
  const { itemTypes, dispatch: dispatchItemType } = useItemTypesContext();
  const [newItemType, setNewItemType] = useState('');
  const [isEditing, setEditing] = useState(false);
  const [selectedItemTypeId, setSelectedItemTypeId] = useState(null);

  useEffect(() => {
    // Fetch item types if not available
    if (!itemTypes && user) {
      const fetchItemTypes = async () => {
        try {
          const response = await fetch('/itemType', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const json = await response.json();
          if (response.ok) {
            dispatchItemType({ type: 'SET_ITEMTYPES', payload: json });
          } else {
            // Handle error if needed
          }
        } catch (error) {
          console.error('Error fetching item types:', error);
        }
      };

      fetchItemTypes();
    }
  }, [itemTypes, dispatchItemType, user]);

  const handleEditItemType = async () => {
    if (newItemType.trim() === '') return;

    try {
      let response;
      console.log(selectedItemTypeId);
      if (isEditing && selectedItemTypeId) {
        // Update existing item type
        response = await fetch(`/itemType/${selectedItemTypeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ itemType_name: newItemType }),
        });
      } else {
        console.log('add');
        // Add new item type
        response = await fetch('/itemType', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ itemType_name: newItemType, added_by: user._id }),
        });
      }

      const json = await response.json();

      if (response.ok) {
        if (isEditing && selectedItemTypeId) {
          // If editing, update the existing item type in the state
          dispatchItemType({ type: 'UPDATE_ITEMTYPE', payload: json });
          setEditing(false);
        } else {
          // If adding, create a new item type in the state
          dispatchItemType({ type: 'CREATE_ITEMTYPE', payload: json });
        }

        // Reset the input field
        setNewItemType('');
        setSelectedItemTypeId(null);
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error('Error handling item type edit:', error);
    }
  };

  const handleAddItemType = () => {
    setEditing(false);
    handleEditItemType();
  };

  const handleDeleteItemType = async (itemTypeId) => {
    try {
      const response = await fetch(`/itemType/${itemTypeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatchItemType({ type: 'DELETE_ITEM_TYPE', payload: json });
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error('Error deleting item type:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <h2>ITEM TYPES</h2>
        <input
          type="text"
          placeholder="Add Item Type"
          value={newItemType}
          onChange={(e) => setNewItemType(e.target.value)}
        />
        <button onClick={handleAddItemType}>
          {isEditing ? 'Save Edit' : 'Add Item Type'}
        </button>
        <h3>List of Item Types:</h3>
        {itemTypes ? (
          <table>
            <thead>
              <tr>
                <th>Item Type Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {itemTypes.map((itemType) => (
                <tr key={itemType._id}>
                  <td>{itemType.itemType_name}</td>
                  <td>
                    <button onClick={() => handleEditItemType(itemType._id, itemType.itemType_name)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteItemType(itemType._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading item types...</p>
        )}
      </div>
    </div>
  );
};

export default ItemTypeModal;
