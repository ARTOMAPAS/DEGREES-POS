// arrangeBranches.js

document.addEventListener("DOMContentLoaded", function () {
  arrangeBranches();
});
  
  window.addEventListener("resize", function () {
    arrangeBranches();
  });
  
  function arrangeBranches() {
    const branchesContainer = document.querySelector(".branches");
    const branchDisplay = document.querySelectorAll(".branch-display");

    console.log("branchesContainer:", branchesContainer);
    console.log("branchDisplay:", branchDisplay);

    if (branchesContainer && branchDisplay.length > 0) {
      const containerWidth = branchesContainer.offsetWidth;
      const branchWidth = branchDisplay[0].offsetWidth;
      const maxBranchesPerRow = Math.floor(containerWidth / branchWidth);

      branchDisplay.forEach((branch, index) => {
        const rowIndex = Math.floor(index / maxBranchesPerRow);
        branch.style.order = rowIndex;
      });
    } else {
      console.warn("No elements found with the specified class.");
    }

  }
  