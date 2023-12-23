import { useState } from "react";
import { useUsersContext } from "../../../../hooks/useUsersContext";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import secureRandomPassword from 'secure-random-password';


const AddCashierForm = ({ closeModal }) => {
  const { dispatch } = useUsersContext();
  const { user } = useAuthContext();
  const [added_by] = useState(user?._id);
  const [name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(secureRandomPassword.randomPassword());
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError("You must be Logged in!");
      return;
    }
  
    let users = { user_type:"Cashier", name, user_name, email, password, added_by, branch_id_assigned: user.branchID };

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
      setName("");
      setUserName("");
      setEmail("");
      setPassword(secureRandomPassword.randomPassword());
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
          <h3>Add new Cashier</h3>
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

export default AddCashierForm;
