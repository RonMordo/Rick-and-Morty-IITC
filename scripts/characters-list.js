const baseUrl = `https://rickandmortyapi.com/api/character`;

const pageData = {
  info: null,
  charactersData: null,
  page: 1,
};

let searchValue = "";
let searchPage = 1;
let isSearching = false;
let searchInfo = null;

function updateUI() {
  const charContainer = document.querySelector(".content-container");
  charContainer.innerHTML = "";
  (pageData.charactersData || []).forEach((character) => {
    const flexItem = document.createElement("div");
    flexItem.className = "flex-item";
    flexItem.innerHTML = `
      <a href='character-detail.html?id=${character.id}' style="text-decoration:none; color:inherit; display:block; height:100%; width:100%;">
        <img src='${character.image}'/>
        <div class='info'>
          <p>${character.name}</p>
          <p>${character.status}</p>
          <p>${character.species}</p>
          <p>${character.location.name}</p>
        </div>
      </a>
    `;
    charContainer.appendChild(flexItem);
  });
  document.getElementById("prev").disabled = pageData.page <= 1;
  document.getElementById("next").disabled = !pageData.info?.next;
}

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
      const charContainer = document.querySelector(".content-container");
      charContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function filterCharactersByName(page = 1) {
  searchValue = document.getElementById("character-search").value.trim();
  const charContainer = document.querySelector(".content-container");
  charContainer.innerHTML = "<p>Loading...</p>";

  if (!searchValue) {
    isSearching = false;
    searchPage = 1;
    document.getElementById("prev").disabled = pageData.page <= 1;
    document.getElementById("next").disabled = !pageData.info?.next;
    updateUI();
    return;
  }

  isSearching = true;
  searchPage = page;

  fetch(
    `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
      searchValue
    )}&page=${searchPage}`
  )
    .then((response) => {
      if (!response.ok) {
        charContainer.innerHTML = `<p style="color:red;">No characters found.</p>`;
        searchInfo = null;
        document.getElementById("prev").disabled = true;
        document.getElementById("next").disabled = true;
        return { results: [] };
      }
      return response.json();
    })
    .then((data) => {
      searchInfo = data.info;
      document.getElementById("prev").disabled = searchPage <= 1;
      document.getElementById("next").disabled = !searchInfo?.next;
      charContainer.innerHTML = "";
      (data.results || []).forEach((character) => {
        const flexItem = document.createElement("div");
        flexItem.className = "flex-item";
        flexItem.innerHTML = `
          <a href='character-detail.html?id=${character.id}' style="text-decoration:none; color:inherit; display:block; height:100%; width:100%;">
            <img src='${character.image}'/>
            <div class='info'>
              <p>${character.name}</p>
              <p>${character.status}</p>
              <p>${character.species}</p>
              <p>${character.location.name}</p>
            </div>
          </a>
        `;
        charContainer.appendChild(flexItem);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCharacters();

  const searchBtn = document.querySelector(".portal-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterCharactersByName(1);
    });
  }

  document.getElementById("next").addEventListener("click", () => {
    if (isSearching) {
      if (searchInfo?.next) {
        filterCharactersByName(searchPage + 1);
      }
    } else {
      if (pageData.info?.next) {
        pageData.page++;
        loadCharacters();
      }
    }
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (isSearching) {
      if (searchPage > 1) {
        filterCharactersByName(searchPage - 1);
      }
    } else {
      if (pageData.page > 1) {
        pageData.page--;
        loadCharacters();
      }
    }
  });
});
