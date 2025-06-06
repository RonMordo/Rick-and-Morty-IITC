/**
 * Location Detail Page Script
 * Handles the display of detailed information for a single location
 */

/**
 * Loads and displays details for a specific location
 * @param {string} id - The location ID to load
 */
function loadLocationDetails(id) {
  // TODO: Implement location detail loading
  // 1. Show loading state
  // 2. Fetch location data using the API module
  // 3. Extract resident IDs from location.residents URLs
  // 4. Fetch all residents of this location
  // 5. Update UI with location and resident data
  // 6. Handle any errors
  // 7. Hide loading state
  fetch(`https://rickandmortyapi.com/api/location/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching location data");
      }
      return response.json();
    })
    .then((locationData) => {
      Promise.all(
        locationData.residents.map((residentUrl) =>
          fetch(residentUrl).then((response) => response.json())
        )
      ).then((residents) => {
        updateUI(locationData, residents);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Updates the UI with location and resident data
 * @param {Object} location - The location data
 * @param {Array} residents - Array of resident data
 */
function updateUI(location, residents) {
  // TODO: Implement the UI update
  // 1. Get the detail container element
  // 2. Create location header with basic info
  // 3. Create residents section
  // 4. For each resident:
  //    - Create a card with image and basic info
  //    - Make the card link to the character detail page
  // 5. Handle empty states (no residents)
  const contentContainer = document.querySelector(".content-container");
  const locationDetailsEl = document.createElement("div");
  locationDetailsEl.className = "location-details";
  locationDetailsEl.innerHTML = `
    <h3>Name: ${location.name}</h3>
    <p>Dimension: ${location.dimension}</p>
    <p>Type: ${location.type}</p>
    <p>Created: ${location.created}</p>
  `;
  contentContainer.before(locationDetailsEl);
  residents.forEach((resident) => {
    const flexItem = document.createElement("div");
    flexItem.classList = "flex-item animated";
    flexItem.innerHTML = `
    <a href='character-detail.html?id=${resident.id}'>    
      <img src='${resident.image}'/>
      <div class='info'>
        <p>Name: ${resident.name}</p>
        <p>Status: ${resident.status}</p>
        <p>Species: ${resident.species}</p>
        <p>Location: ${resident.location.name}</p>
      </div>
    </a>
    `;
    contentContainer.appendChild(flexItem);
  });
}

// TODO: Initialize the page
// 1. Get location ID from URL parameters
// 2. Validate the ID
// 3. Load location details if ID is valid
// 4. Show error if ID is invalid or missing

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const locationId = params.get("id");
  loadLocationDetails(locationId);
});
