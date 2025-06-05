const state = {
  page: 1,
  data: null,
  search: "",
};

/**
 * Updates the UI with character data
 * @param {Object} data - The character data from the API
 * @param {Array} data.results - Array of character objects
 * @param {Object} data.info - Pagination information
 */
function updateUI(data) {
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
      state.data = data;
      console.log(data);

      updateUI(data);
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
document.addEventListener("DOMContetLoaded", loadCharacters);
