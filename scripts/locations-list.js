const locationData = {
  info: null,
  locationsData: null,
  page: 1,
};

let locationSearchValue = "";
let locationSearchPage = 1;
let isLocationSearching = false;
let locationSearchInfo = null;

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
      const locationsContainer = document.querySelector(".content-container");
      locationsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function filterLocationsByName(page = 1) {
  locationSearchValue = document.getElementById("location-search").value.trim();
  const locationsContainer = document.querySelector(".content-container");
  locationsContainer.innerHTML = "<p>Loading...</p>";

  if (!locationSearchValue) {
    isLocationSearching = false;
    locationSearchPage = 1;
    document.getElementById("prev").disabled = locationData.page <= 1;
    document.getElementById("next").disabled = !locationData.info?.next;
    updateUI();
    return;
  }

  isLocationSearching = true;
  locationSearchPage = page;

  fetch(
    `https://rickandmortyapi.com/api/location/?name=${encodeURIComponent(locationSearchValue)}&page=${locationSearchPage}`
  )
    .then((response) => {
      if (!response.ok) {
        locationsContainer.innerHTML = `<p style="color:red;">No locations found.</p>`;
        locationSearchInfo = null;
        document.getElementById("prev").disabled = true;
        document.getElementById("next").disabled = true;
        return { results: [] };
      }
      return response.json();
    })
    .then((data) => {
      locationSearchInfo = data.info;
      document.getElementById("prev").disabled = locationSearchPage <= 1;
      document.getElementById("next").disabled = !locationSearchInfo?.next;
      locationsContainer.innerHTML = "";
      (data.results || []).forEach((location) => {
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
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadLocations();

  const searchBtn = document.querySelector(".portal-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterLocationsByName(1);
    });
  }

  document.getElementById("next").addEventListener("click", () => {
    if (isLocationSearching) {
      if (locationSearchInfo?.next) {
        filterLocationsByName(locationSearchPage + 1);
      }
    } else {
      if (locationData.info?.next) {
        locationData.page++;
        loadLocations();
      }
    }
  });

  document.getElementById("prev").addEventListener("click", () => {
    if (isLocationSearching) {
      if (locationSearchPage > 1) {
        filterLocationsByName(locationSearchPage - 1);
      }
    } else {
      if (locationData.page > 1) {
        locationData.page--;
        loadLocations();
      }
    }
  });
});
