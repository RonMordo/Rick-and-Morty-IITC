const baseUrl = `https://rickandmortyapi.com/api/character`;

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
  const charContainer = document.querySelector(".char-container");
  charContainer.innerHTML = "";
  pageData.charactersData.forEach((character) => {
    const flexItem = document.createElement("div");
    flexItem.className = "flex-item";
    flexItem.innerHTML = `    
      <img src='${character.image}'/>
      <div class='char-info'>
        <p>${character.name}</p>
        <p>${character.status}</p>
        <p>${character.species}</p>
        <p>${character.location.name}</p>
        <a href='character-detail.html?id=${character.id}'>Info</a>
      </div>
    `;
    charContainer.appendChild(flexItem);
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
      const charContainer = document.getElementsByClassName("char-container");
      charContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
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
