import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';

const BranchDisplay = () => {
    const { user } = useAuthContext();
    const [branchData, setBranchData] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchBranchData = async () => {
          try {
            if (!user.branchID) {
              console.error('User branchID is null or undefined.');
              return;
            }
      
            const response = await fetch(`/branch/${user.branchID}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
      
            const json = await response.json();
      
            if (response.ok) {
              setBranchData(json);
            } else {
              console.error('Error fetching branch data:', json);
            }
          } catch (error) {
            console.error('Error fetching branch data:', error);
          }
        };
      
        if (user && user.branchID) {
          fetchBranchData();
        }
      }, [user]);
      

    const handleBranchClick = () => {
      // Navigate to the branch display page using the branch ID
      console.log(branchData._id)
      navigate(`/branch/${branchData._id}`);
    };
  
    return (
      <div >
        {/* {branchData && branchData.branchImage && branchData.branch_name && (
            <img
                className="branch-img"
                src={
                branchData.branchImage.startsWith('/branchuploads/')
                    ? `${process.env.REACT_APP_SERVER_URL}${branchData.branchImage}`
                    : branchData.branchImage
                }
                alt={branchData.branch_name}
            />
            )} */}

                
        <h4>{branchData?.branch_name}</h4>
        <p>Location: {branchData?.location}</p>
        <div onClick={handleBranchClick}><u>View Details →</u></div>
      </div>
    );
  };
  
  export default BranchDisplay;
