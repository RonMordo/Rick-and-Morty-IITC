const pageData = {
  info: null,
  charactersData: null,
};

/**
 * Updates the UI with character data
 * @param {Object} data - The character data from the API
 * @param {Array} data.results - Array of character objects
 * @param {Object} data.info - Pagination information
 */
function updateUI() {
  const grid = document.querySelector(".grid-2x3");
  pageData.charactersData.forEach((character) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.innerHTML = `    
      <img src='${character.image}'/>
      <div class='char-info'>
        <p>${character.name}</p>
        <p>${character.status}</p>
        <p>${character.species}</p>
        <p>${character.location.name}</p>
      </div>
    `;
    grid.appendChild(gridItem);
  });
  // TODO: Implement the UI update
  // 1. Get the grid element
  // 2. Clear existing content
  // 3. For each character in data.results:
  //    - Create a card element
  //    - Add character image, name, status, species, location
  //    - Make the card clickable (link to character-detail.html)
  // 4. Update pagination UI
  throw new Error("updateUI not implemented");
}

/**
 * Loads character data from the API
 */

function loadCharacters() {
  const url = `https://rickandmortyapi.com/api/character`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No characters found");
      }
      return response.json();
    })
    .then((data) => {
      pageData.charactersData = data.results;
      pageData.info = data.info;
      console.log(pageData);
      updateUI();
    })
    .catch((error) => {
      const grid = document.getElementsByClassName("grid");
      grid.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadCharacters() on page load
document.addEventListener("DOMContentLoaded", loadCharacters);
