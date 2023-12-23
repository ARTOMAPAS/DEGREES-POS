import React, { useState } from 'react';

const AvailabilityRadio = ({ selectedProduct, user, isAvailable }) => {
  const [availability, setAvailability] = useState(isAvailable);

  const handleAvailabilityChange = async (value) => {
    if (!user || !selectedProduct) {
      return;
    }

    try {
      console.log("Branch ID:", user.branchID);
      console.log("Product ID:", selectedProduct._id);
      console.log(`/branch/updateAvailability/${user.branchID}`);
      const response = await fetch(`/branch/updateAvailability/${user.branchID}`, {
        method: "PATCH",
        body: JSON.stringify({
          productId: selectedProduct._id,
          availability: value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        console.log(json);
        
        // Handle the updated branch data as needed
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };


  return (
    <div>
      <label>
        <input
          type="radio"
          value="available"
          checked={availability === "available"}
         
          onClick={() => {
            setAvailability('available');
            handleAvailabilityChange('available');
          }}
        />
        Available
      </label>
      <label>
        <input
          type="radio"
          value="notAvailable"
          checked={availability === "notAvailable"}
          
          onClick={() => {
            setAvailability('notAvailable');
            handleAvailabilityChange('notAvailable');
          }}
        />
        Not Available
      </label>
    </div>
  );
};

export default AvailabilityRadio;