import { useState } from "react";
import { useBranchsContext } from "../../../hooks/useBranchsContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

const BranchForm = ({ closeModal }) => {
  const { dispatch } = useBranchsContext();
  const { user } = useAuthContext();

  const [branch_name, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [branchImage, setBranchImage] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    // Continue with adding the branch
    const branchData = {
      branch_name,
      location,
      added_by: user._id,
      branchImage: branchImage ? await convertImageToBase64(branchImage) : null,
    };

    const response = await fetch("/branch", {
      method: "POST",
      body: JSON.stringify(branchData),
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
      setBranchName("");
      setLocation("");
      setBranchImage(null);
      console.log("New Branch Added", jsonData);
      dispatch({ type: "CREATE_BRANCH", payload: jsonData });
      closeModal();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBranchImage(file);
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
          <h3>Add new Branch</h3>

          <label>Branch Name</label>
          <input
            type="text"
            onChange={(e) => setBranchName(e.target.value)}
            value={branch_name}
            className={emptyFields.includes("branch_name") ? "error" : ""}
          />
          <br />
          <label>Location</label>
          <input
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className={emptyFields.includes("location") ? "error" : ""}
          />
          <br />
          <label>Branch Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <br />
          <button>Add Branch</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
