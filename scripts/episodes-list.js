const episodeData = {
  info: null,
  episodesData: null,
  page: 1,
};

function updateUI() {
  const grid = document.querySelector(".grid-2x3");
  grid.innerHTML = "";
  if (!episodeData.episodesData) return;
  episodeData.episodesData.forEach((episode) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.innerHTML = `
      <div class='char-info'>
        <p><strong>${episode.name}</strong></p>
        <p>Episode: ${episode.episode}</p>
        <p>Air Date: ${episode.air_date}</p>
        <p>Characters: ${episode.characters.length}</p>
      </div>
    `;
    grid.appendChild(gridItem);
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
      const grid = document.querySelector(".grid-2x3");
      grid.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

document.addEventListener("DOMContentLoaded", loadEpisodes);

document.getElementById("next").addEventListener("click", () => {
  if (episodeData.info?.next) {
    episodeData.page++;
    loadEpisodes();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (episodeData.page > 1) {
    episodeData.page--;
    loadEpisodes();
  }
});
