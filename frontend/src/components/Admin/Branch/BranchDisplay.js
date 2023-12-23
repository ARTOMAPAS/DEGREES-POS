import React from "react";
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const BranchDisplay = ({ branch }) => {
  const navigate = useNavigate();

  const handleBranchClick = () => {
    // Navigate to the branch display page using the branch ID
    navigate(`/branch/${branch._id}`);
  };

  return (
    <div className="branch-display" onClick={handleBranchClick}>
      {branch.branchImage && (
        <img
          className="branch-img"
          src={branch.branchImage.startsWith('/branchuploads/') ? `${process.env.REACT_APP_SERVER_URL}${branch.branchImage}` : branch.branchImage}
          alt={branch.branch_name}
        />
      )}
      <h4>{branch.branch_name}</h4>
      <p>Location: {branch.location}</p>
      <p>
        Date Created:{" "}
        {formatDistanceToNow(new Date(branch.createdAt), { addSuffix: true })}
      </p>
    </div>
  );
};

export default BranchDisplay;
