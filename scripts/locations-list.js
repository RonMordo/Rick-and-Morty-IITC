const locationData = {
  info: null,
  locationsData: null,
  page: 1,
};

function updateUI() {
  const locationsContainer = document.querySelector(".content-container");
  locationsContainer.innerHTML = "";
  if (!locationData.locationsData) return;
  locationData.locationsData.forEach((location) => {
    const flexItem = document.createElement("div");
    flexItem.className = "flex-item";
    flexItem.innerHTML = `
      <div class='info'>
        <p><strong>${location.name}</strong></p>
        <p>Type: ${location.type}</p>
        <p>Dimension: ${location.dimension}</p>
        <p>Residents: ${location.residents.length}</p>
      </div>
    `;
    locationsContainer.appendChild(flexItem);
  });
}

function loadLocations() {
  const url = `https://rickandmortyapi.com/api/location?page=${locationData.page}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No Locations found");
      }
      return response.json();
    })
    .then((data) => {
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

document.getElementById("next").addEventListener("click", () => {
  if (locationData.info?.next) {
    locationData.page++;
    loadLocations();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (locationData.page > 1) {
    locationData.page--;
    loadLocations();
  }
});
