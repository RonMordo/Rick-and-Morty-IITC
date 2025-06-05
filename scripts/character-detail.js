function getCharacterIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadCharacterDetails(id) {
  const detailContainer = document.getElementById("character-detail");
  detailContainer.innerHTML = "<p>Loading...</p>";

  fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Character not found");
      return res.json();
    })
    .then((character) => {
      const episodeIds = character.episode
        .map((url) => url.split("/").pop())
        .join(",");
      return fetch(
        `https://rickandmortyapi.com/api/episode/${episodeIds}`
      )
        .then((episodesRes) => episodesRes.json())
        .then((episodes) => {
          if (!Array.isArray(episodes)) episodes = [episodes];
          updateUI(character, episodes);
        });
    })
    .catch((err) => {
      detailContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}

function updateUI(character, episodes) {
  const detailContainer = document.getElementById("character-detail");
  detailContainer.innerHTML = `
    <div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">
      <div class="flex-item" style="min-width:260px;max-width:320px;">
        <img src="${character.image}" alt="${
    character.name
  }" style="width:100%;border-radius:8px;" />
        <div class="char-info">
          <h2>${character.name}</h2>
          <p>Status: ${character.status}</p>
          <p>Species: ${character.species}</p>
          <p>Gender: ${character.gender}</p>
          <p>Origin: ${character.origin.name}</p>
          <p>Location: ${character.location.name}</p>
        </div>
      </div>
      <div class="flex-item" style="flex:1;min-width:220px;">
        <h3>Episodes</h3>
        <ul style="list-style:none;padding:0;">
          ${episodes
            .map(
              (ep) => `
            <li style="margin-bottom:8px;">
              <strong>${ep.episode}</strong>: ${ep.name} <span style="color:#aaa;">(${ep.air_date})</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getCharacterIdFromUrl();
  if (!id) {
    document.getElementById("character-detail").innerHTML =
      "<p style='color:red;'>No character ID provided.</p>";
    return;
  }
  loadCharacterDetails(id);
});
