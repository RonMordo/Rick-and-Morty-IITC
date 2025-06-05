const locationData = {
  info: null,
  locationsData: null,
};

function updateUI() {
  const grid = document.querySelector(".grid-2x3");
  grid.innerHTML = "";
  if (!locationData.locationsData) return;
  locationData.locationsData.forEach((location) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.innerHTML = `
      <div class='char-info'>
        <p><strong>${location.name}</strong></p>
        <p>Type: ${location.type}</p>
        <p>Dimension: ${location.dimension}</p>
        <p>Residents: ${location.residents.length}</p>
      </div>
    `;
    grid.appendChild(gridItem);
  });
}

function loadLocations() {
  const url = `https://rickandmortyapi.com/api/location`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No Locations found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      locationData.locationsData = data.results;
      locationData.info = data.info;
      updateUI();
    })
    .catch((error) => {
      const grid = document.querySelector(".grid-2x3");
      grid.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

document.addEventListener("DOMContentLoaded", loadLocations);
