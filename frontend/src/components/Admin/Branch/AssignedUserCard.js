import React from 'react';

const AssignedUserCard = ({ user }) => {
  return (
    <div className="user-detail">
      {/* Add other details you want to display */}
      <img
        className="userImage"
        src={
          user.userImage.startsWith('/useruploads/')
            ? `${process.env.REACT_APP_SERVER_URL}${user.userImage}`
            : user.userImage
        }
        alt={user.name}
      />
      <p>User Type: {user.user_type}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add other details you want to display */}
    </div>
  );
};

export default AssignedUserCard;