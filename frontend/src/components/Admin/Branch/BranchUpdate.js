import { useState, useEffect } from "react";
import { useBranchsContext } from "../../hooks/useBranchsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const BranchUpdate = ({ closeModal, branchToUpdate }) => {
  const { dispatch } = useBranchsContext();
  const { user } = useAuthContext();

  const [branch_name, setBranchName] = useState(branchToUpdate.branch_name);
  const [location, setLocation] = useState(branchToUpdate.location);
  const [branchImage, setBranchImage] = useState(branchToUpdate.branchImage);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBranchName(branchToUpdate.branch_name);
    setLocation(branchToUpdate.location);
    
  }, [branchToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        setError("You must be logged in!");
        return;
    }

    try {
        const body = JSON.stringify({
            branch_name,
            location,
            added_by: user._id,
            branchImage
        });
        console.log(body);
        const response = await fetch(`/branch/${branchToUpdate._id}`, {
            method: "PATCH",
            body,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setError(null);
            setBranchName(json.branch_name); // Update state with the new values
            setLocation(json.location);
            setBranchImage(json.branchImage);
            console.log("Branch Updated", json);
            dispatch({ type: "UPDATE_BRANCH", payload: json });
            closeModal(); // Call the closeModal function to close the modal
        }
    } catch (error) {
        console.error("Error updating branch:", error);
    }
};


  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBranchImage(file);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <form className="update" onSubmit={handleSubmit}>
          <h3>Update Branch</h3>

          <label>Branch Name</label>
          <input
            type="text"
            onChange={(e) => setBranchName(e.target.value)}
            value={branch_name}
          />
          <br />
          <label>Location</label>
          <input
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
          <br />
          <label>Branch Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <button>Update Branch</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default BranchUpdate;
