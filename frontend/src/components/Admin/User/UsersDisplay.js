
const UsersDisplay = ({ user,onViewDetails }) => {


  return (
    <tr>
      <td>{user.user_type}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td className="action-button" onClick={() => onViewDetails()}>
        View Details →
      </td>
    </tr>
  );
};

export default UsersDisplay;
