const pageData = {
  info: null,
  charactersData: null,
  page: 1,
};

/**
 * Updates the UI with character data
 * @param {Object} data - The character data from the API
 * @param {Array} data.results - Array of character objects
 * @param {Object} data.info - Pagination information
 */
function updateUI() {
  const grid = document.querySelector(".grid-2x3");
  grid.innerHTML = "";
  if (!pageData.charactersData) return;
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
}

/**
 * Loads character data from the API
 */

function loadCharacters() {
  const url = `https://rickandmortyapi.com/api/character?page=${pageData.page}`;

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
      updateUI();
    })
    .catch((error) => {
      const grid = document.querySelector(".grid-2x3");
      grid.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadCharacters() on page load
document.addEventListener("DOMContentLoaded", loadCharacters);

document.getElementById("next").addEventListener("click", () => {
  if (pageData.info?.next) {
    pageData.page++;
    loadCharacters();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (pageData.page > 1) {
    pageData.page--;
    loadCharacters();
  }
});
