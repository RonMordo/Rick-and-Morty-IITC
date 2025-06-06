const episodeData = {
  info: null,
  episodesData: null,
  page: 1,
};

function updateUI() {
  const episodesContainer = document.querySelector(".content-container");
  episodesContainer.innerHTML = "";
  if (!episodeData.episodesData) return;
  episodeData.episodesData.forEach((episode) => {
    const flexItem = document.createElement("div");
    flexItem.className = "flex-item";
    flexItem.innerHTML = `
    <a href='episode-detail.html?id=${episode.id}'>  
      <div class='info'>
        <p><strong>${episode.name}</strong></p>
        <p>Episode: ${episode.episode}</p>
        <p>Air Date: ${episode.air_date}</p>
        <p>Characters: ${episode.characters.length}</p>
      </div>
    </a>
    `;
    episodesContainer.appendChild(flexItem);
  });
}

function loadEpisodes() {
  const url = `https://rickandmortyapi.com/api/episode?page=${episodeData.page}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No episodes found");
      }
      return response.json();
    })
    .then((data) => {
      episodeData.episodesData = data.results;
      episodeData.info = data.info;
      updateUI();
    })
    .catch((error) => {
      const episodesContainer = document.querySelector(".content-container");
      episodesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

let episodeSearchValue = "";
let episodeSearchPage = 1;
let isEpisodeSearching = false;
let episodeSearchInfo = null;

function filterEpisodesByName(page = 1) {
  episodeSearchValue = document.getElementById("episode-search").value.trim();
  const episodesContainer = document.querySelector(".content-container");
  episodesContainer.innerHTML = "<p>Loading...</p>";

  if (!episodeSearchValue) {
    isEpisodeSearching = false;
    episodeSearchPage = 1;
    document.getElementById("prev").disabled = episodeData.page <= 1;
    document.getElementById("next").disabled = !episodeData.info?.next;
    updateUI();
    return;
  }

  isEpisodeSearching = true;
  episodeSearchPage = page;

  fetch(
    `https://rickandmortyapi.com/api/episode/?name=${encodeURIComponent(episodeSearchValue)}&page=${episodeSearchPage}`
  )
    .then((response) => {
      if (!response.ok) {
        episodesContainer.innerHTML = `<p style="color:red;">No episodes found.</p>`;
        episodeSearchInfo = null;
        document.getElementById("prev").disabled = true;
        document.getElementById("next").disabled = true;
        return { results: [] };
      }
      return response.json();
    })
    .then((data) => {
      episodeSearchInfo = data.info;
      document.getElementById("prev").disabled = episodeSearchPage <= 1;
      document.getElementById("next").disabled = !episodeSearchInfo?.next;
      episodesContainer.innerHTML = "";
      (data.results || []).forEach((episode) => {
        const flexItem = document.createElement("div");
        flexItem.className = "flex-item";
        flexItem.innerHTML = `
          <a href='episode-detail.html?id=${episode.id}'>  
            <div class='info'>
              <p><strong>${episode.name}</strong></p>
              <p>Episode: ${episode.episode}</p>
              <p>Air Date: ${episode.air_date}</p>
              <p>Characters: ${episode.characters.length}</p>
            </div>
          </a>
        `;
        episodesContainer.appendChild(flexItem);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadEpisodes();

  const searchBtn = document.querySelector(".portal-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterEpisodesByName(1);
    });
  }

  document.getElementById("next").addEventListener("click", () => {
    if (isEpisodeSearching) {
      if (episodeSearchInfo?.next) {
        filterEpisodesByName(episodeSearchPage + 1);
      }
    } else {
      if (episodeData.info?.next) {
        episodeData.page++;
        loadEpisodes();
      }
    }
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (isEpisodeSearching) {
      if (episodeSearchPage > 1) {
        filterEpisodesByName(episodeSearchPage - 1);
      }
    } else {
      if (episodeData.page > 1) {
        episodeData.page--;
        loadEpisodes();
      }
    }
  });
});
