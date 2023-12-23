import React, { useState, useEffect } from 'react';
import { useUsersContext } from '../../../hooks/useUsersContext';
import { useAuthContext } from '../../../hooks/useAuthContext';


const UserUpdateModal = ({ closeModal, userToUpdate ,viewUserDetails }) => {
  const { dispatch } = useUsersContext();
  const { user } = useAuthContext();

  const [userType, setUserType] = useState(userToUpdate.user_type);
  const [branchIdAssigned, setBranchIdAssigned] = useState(userToUpdate.branch_id_assigned);
  const [name, setName] = useState(userToUpdate.name);
  const [userName, setUserName] = useState(userToUpdate.user_name);
  const [email, setEmail] = useState(userToUpdate.email);
  const [userImage, setUserImage] = useState(userToUpdate.userImage);
  const [emptyFields, setEmptyFields] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserType(userToUpdate.user_type);
    setBranchIdAssigned(userToUpdate.branch_id_assigned);
    setName(userToUpdate.name);
    setUserName(userToUpdate.user_name);
    setEmail(userToUpdate.email);
  }, [userToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError('You must be logged in!');
      return;
    }

    if (!userType || !name || !userName || !email) {
      setError('Please fill in all the required fields.');
      return;
    }
  
    try {
      let updateuser;
  
      if (userType === "Admin") {
        if (userImage === null) {
          updateuser = { user_type: userType, branch_id_assigned: branchIdAssigned, name, user_name: userName, email }
        } else {
          const base64Image = await convertImageToBase64(userImage);
          updateuser = { user_type: userType, branch_id_assigned: branchIdAssigned, name, user_name: userName, email, userImage: base64Image }
        }
      } else {
        if (userImage === null) {
          updateuser = { user_type: userType, branch_id_assigned: branchIdAssigned, name, user_name: userName, email }
        } else {
          const base64Image = await convertImageToBase64(userImage);
          updateuser = { user_type: userType, branch_id_assigned: branchIdAssigned, name, user_name: userName, email, userImage: base64Image }
        }
      }
  
      const response = await fetch(`/user/${userToUpdate._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateuser),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setError(null);
        setUserType(json.user_type);
        setBranchIdAssigned(json.branch_id_assigned);
        setName(json.name);
        setUserName(json.user_name);
        setEmail(json.email);
        setUserImage(json.userImage);
        dispatch({ type: 'UPDATE_USERS', payload: json });
        closeModal();
        setEmptyFields([]);
        viewUserDetails(json);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserImage(file);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <form className="update" onSubmit={handleSubmit}>
          <h3>Update User</h3>

          <center>
          <img
              className="user-image-update-modal"
              src={
                userImage
                  ? typeof userImage === 'string'
                    ? userImage.startsWith('/useruploads/')
                      ? `${process.env.REACT_APP_SERVER_URL}${userImage}`
                      : userImage
                    : URL.createObjectURL(userImage) // Display the preview of the selected image
                  : '' // Provide a placeholder image path or handle it accordingly
              }
              alt={name}
            />
          </center>
          <input className="image-update" type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <label>User Type</label>
          <select onChange={(e) => setUserType(e.target.value)} value={userType}>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
          </select>
          <br />

          <label>Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} value={name} 
            className={emptyFields.includes("name") ? "error" : ""}
          />
          <br />
          <label>User Name</label>
          <input type="text" onChange={(e) => setUserName(e.target.value)} value={userName}
            className={emptyFields.includes("user-name") ? "error" : ""}
          />
          <br />
          <label>Email</label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} 
           className={emptyFields.includes("email") ? "error" : ""}
          />
          <br />
          <button>Update User</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;
