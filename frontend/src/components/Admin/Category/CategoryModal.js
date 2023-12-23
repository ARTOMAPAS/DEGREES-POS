import React, { useState, useEffect } from 'react';
import { useCategoriesContext } from '../../../hooks/useCategoriesContext';
import { useAuthContext } from '../../../hooks/useAuthContext';

const CategoryModal = ({ closeModal }) => {
  const { user } = useAuthContext();
  const { categories, dispatch } = useCategoriesContext();
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  useEffect(() => {
    // Fetch categories if not available
    if (!categories && user) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/category', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const json = await response.json();
          if (response.ok) {
            dispatch({ type: 'SET_CATEGORIES', payload: json });
          } else {
            // Handle error if needed
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
    }
  }, [categories, dispatch, user]);

  const handleEditCategory = async () => {
    if (newCategory.trim() === '') return;
  
    try {
      let response;
      console.log(selectedCategoryId)
      if (isEditing && selectedCategoryId) {
        // Update existing category
        response = await fetch(`/category/${selectedCategoryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ category_name: newCategory }),
        });
      } else {
        console.log("add")
        // Add new category
        response = await fetch('/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ category_name: newCategory, added_by: user._id }),
        });
      }
  
      const json = await response.json();
  
      if (response.ok) {
        if (isEditing && selectedCategoryId) {
          // If editing, update the existing category in the state
          dispatch({ type: 'UPDATE_CATEGORY', payload: json });
          setEditing(false);
        } else {
          // If adding, create a new category in the state
          dispatch({ type: 'CREATE_CATEGORY', payload: json });
        }
  
        // Reset the input field
        setNewCategory('');
        setSelectedCategoryId(null)
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error('Error handling category edit:', error);
    }
  };
  
  const handleAddCategory = () => {
    setEditing(false);
    handleEditCategory();
  };  

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_CATEGORY', payload: json });
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <h2>CATEGORIES</h2>
        <input
          type="text"
          placeholder="Add Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>
          {isEditing ? 'Save Edit' : 'Add Category'}
        </button>
        <h3>List of Categories:</h3>
        {categories ? (
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.category_name}</td>
                  <td>
                    <button onClick={() => handleEditCategory(category._id, category.category_name)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;
