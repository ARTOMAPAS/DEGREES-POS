import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBranchsContext } from "../../../hooks/useBranchsContext";
// import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

const BranchDetails = () => {
  const { branchId } = useParams();
  const { branchs, dispatch } = useBranchsContext();
  // const { users} = useUsersContext()
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [updatedBranchName, setUpdatedBranchName] = useState("");
  const [updatedLocation, setUpdatedLocation] = useState("");
  const [updatedBranchImage, setUpdatedBranchImage] = useState(null);

  useEffect(() => {
    const selectedBranch = branchs.find((b) => b._id === branchId);
    if (selectedBranch) {
      setBranch(selectedBranch);
      setUpdatedBranchName(selectedBranch.branch_name);
      setUpdatedLocation(selectedBranch.location);
    } else {
      // Handle branch not found, you may redirect or display an error
    }
  }, [branchs, branchId]);

  const handleUpdateDetails = async () => {
    if (!user || !branch) {
      return;
    }

    try {
      const response = await fetch(`/branch/${branch._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          branch_name: updatedBranchName,
          location: updatedLocation,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_BRANCH", payload: json });
        setEditingDetails(false);
      }
    } catch (error) {
      console.error("Error updating branch details:", error);
    }
  };

  const handleUpdateImage = async () => {
    if (!user || !branch || !updatedBranchImage) {
      return;
    }
    console.log("image")
    try {
      const base64Image = updatedBranchImage ? await convertImageToBase64(updatedBranchImage) : null;
      const response = await fetch(`/branch/${branch._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          branchImage: base64Image,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_BRANCH", payload: json });
        setEditingImage(false);
      }
    } catch (error) {
      console.error("Error updating branch image:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || !branch) {
      return;
    }

    try {
      const response = await fetch(`/branch/${branch._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_BRANCH", payload: json });
        // Redirect to the branches page after deletion
        navigate("/branch");
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedBranchImage(file);
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
    <div className="branch-details">
      {branch ? (
        <>
          {branch.branchImage && (
            <div className="branch-detail-img">
            <img
              src={
                branch.branchImage.startsWith("/branchuploads/")
                  ? `${process.env.REACT_APP_SERVER_URL}${branch.branchImage}`
                  : branch.branchImage
              }
              alt={branch.branch_name}
            />
          </div>
          )}
          <div className="branch-details-edit">
          {editingImage ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button onClick={handleUpdateImage}>Save Image</button>
              <button onClick={() => setEditingImage(false)}>Cancel</button>
            </>
          ) : (
            <>
              {editingDetails ? (
                <>
                  <input
                    type="text"
                    value={updatedBranchName}
                    onChange={(e) => setUpdatedBranchName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={updatedLocation}
                    onChange={(e) => setUpdatedLocation(e.target.value)}
                  />
                  <button onClick={handleUpdateDetails}>Save Details</button>
                  <button onClick={() => setEditingDetails(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="branch-edit-img" onClick={() => setEditingImage(true)}>Change Image</button>
                  <h4>{branch.branch_name}</h4>
                  <p>Location: {branch.location}</p>
                  {/* <p>
                      Assigned Users:{" "}
                      {branch.assignedUser.map((userId) => (
                        <span key={userId}>{userId}, </span>
                      ))}
                    </p> */}
                  {/* Other branch details here */}
                  <button onClick={() => setEditingDetails(true)}>Edit Details</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}
            </>
          )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BranchDetails;
