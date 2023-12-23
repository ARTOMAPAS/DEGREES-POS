// const BASE_URL = "localhost:3000"; // Replace with your actual API base URL

export const updateBranch = async (branchId, updatedData, authToken) => {
  try {
    const response = await fetch(`/branch/${branchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include authorization header if needed
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update branch");
    }

    const updatedBranch = await response.json();
    return updatedBranch;
  } catch (error) {
    console.error("API error:", error);
    throw error; // You might want to handle this error in the calling code
  }
};