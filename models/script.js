document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the button element by its ID
    const sortButton = document.getElementById("sortButton");
  
    // Attach a click event listener to the button
    sortButton.addEventListener("click", function () {
      // Call the sortTable function when the button is clicked
      console.log("sort button clicked");
      sortTable();
    });
  });
  
function sortTable() {
    console.log("sort button clicked");
    const sortBy = document.getElementById("sortPriority").value;
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");
  
    // Get all rows within the tbody, excluding the header row
    const rows = Array.from(tbody.querySelectorAll("tr"));
  
    rows.sort((a, b) => {
      const priorityA = a.querySelector('td:nth-child(6)').textContent.toLowerCase();
      const priorityB = b.querySelector('td:nth-child(6)').textContent.toLowerCase();
  
      // Define a custom priority order
      const priorityOrder = ["low", "medium", "high", "urgent"];
  
      // Compare based on the selected sorting order
      if (sortBy === "asc") {
        return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
      } else if (sortBy === "desc") {
        return priorityOrder.indexOf(priorityB) - priorityOrder.indexOf(priorityA);
      }
  
      return 0; // Default case (no change in order)
    });
  
    // Clear the existing tbody content
    tbody.innerHTML = "";
  
    // Append the sorted rows back to the tbody
    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  }
  