import { useState, useEffect } from "react";
import { useUsersContext } from "../../../hooks/useUsersContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useBranchsContext } from "../../../hooks/useBranchsContext";
import secureRandomPassword from 'secure-random-password';


const UserForm = ({ closeModal }) => {
  const { dispatch } = useUsersContext();
  const { user } = useAuthContext();
  const { branchs, dispatch: branchDispatch } = useBranchsContext(); 
  
  const [added_by] = useState(user?._id);
  const [user_type, setUserType] = useState("");
  const [name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(secureRandomPassword.randomPassword());
  const [selectedBranch, setSelectedBranch] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);


  // Fetch branches when the component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      const response = await fetch("/branch", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        // Dispatch the SET_BRANCHS action
        branchDispatch({ type: "SET_BRANCHS", payload: json });
      }
    };

    fetchBranches();
  }, [user, branchDispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError("You must be Logged in!");
      return;
    }
  
    let users;
    if (user_type === "Admin") {
      // For admin users, exclude branch_id_assigned
      users = { user_type, name, user_name, email, password, added_by };
    } else {
      // For other users, include branch_id_assigned
      users = { user_type, name, user_name, email, password, added_by, branch_id_assigned: selectedBranch };
    }

    console.log(users)
  
    const response = await fetch("/user", {
      method: "POST",
      body: JSON.stringify(users),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
  
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setError(null);
      setUserType("");
      setName("");
      setUserName("");
      setEmail("");
      setPassword(secureRandomPassword.randomPassword()); // Generate a new random password for the next user
      setSelectedBranch("");
      setEmptyFields([]);
      console.log("New User Added", json);
      dispatch({ type: "CREATE_USERS", payload: json });
      closeModal();
    }
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        <form className="create" onSubmit={handleSubmit}>
          <h3>Add new User</h3>
          <div className="form-row">
            <div className="form-column">
              <label>User Type</label>
              <select
                onChange={(e) => setUserType(e.target.value)}
                value={user_type}
                className={emptyFields.includes("user_type") ? "error" : ""}
              >
                <option value="">Select User Type</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>
            {user_type !== "Admin" && (
              <div className="form-column">
                <label>Assign to Branch</label>
                <select
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  value={selectedBranch}
                  className={emptyFields.includes("branch_id_assigned") ? "error" : ""}
                >
                  <option value="">Assign Branch</option>
                  {branchs &&
                    branchs.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branch_name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <br />
          <label>Full Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className={emptyFields.includes("name") ? "error" : ""}
          />
          <br />
          <label>User Name</label>
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            value={user_name}
            className={emptyFields.includes("user_name") ? "error" : ""}
          />
          <br />
          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={emptyFields.includes("email") ? "error" : ""}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={emptyFields.includes("password") ? "error" : ""}
          />
          <br />
          
          <button>Add User</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default UserForm;
