// ===========================
// Switching Sliders
// ===========================
const CURRENT_ATTRIBUTE = "data-current";

function switchSlide(direction) {
  const sliderContent = document.getElementById("js-sliderContent");
  const currentNumber = parseInt(sliderContent.getAttribute(CURRENT_ATTRIBUTE));

  sliderContent.setAttribute(
    CURRENT_ATTRIBUTE,
    direction === "next" ? currentNumber + 1 : currentNumber - 1
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const nextButtons = document.querySelectorAll(".js-nextSlide");
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchSlide("next");
    });
  });

  const prevButtons = document.querySelectorAll(".js-prevSlide");
  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchSlide("prev");
    });
  });
});

// Clean up
const removeEventListeners = () => {
  nextButtons.forEach((button) => {
    button.removeEventListener("click", () => {
      scrollSlide("next");
    });
  });

  prevButtons.forEach((button) => {
    button.removeEventListener("click", () => {
      scrollSlide("prev");
    });
  });

  window.removeEventListener("unload", removeEventListeners);
};
window.addEventListener("unload", removeEventListeners);

// ==================================
// Get Location with Geolocation API
// ==================================
const LOCAL_STORAGE_KEYS = {
  lat: "latitude",
  long: "longitude",
  city: "city",
  timezone: "timezone",
};

function setLocationLoadingClass(className) {
  const locationMenu = document.getElementById("js-locationLoading");
  locationMenu.classList.add(className);
}

function removeLocationLoadingClass(className) {
  const locationMenu = document.getElementById("js-locationLoading");
  locationMenu.classList.remove(className);
}

function setLocationMenuStatus(isSelected) {
  const locationMenu = document.getElementById("js-locationMenu");
  if (isSelected) {
    locationMenu.classList.add("selected");
  } else {
    locationMenu.classList.remove("selected");
  }
}

function setCurrentTimezone() {
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  localStorage.setItem(LOCAL_STORAGE_KEYS.timezone, timezoneName);
}

function setLocationWithGeolocation() {
  if (navigator.geolocation) {
    removeLocationLoadingClass("done");
    removeLocationLoadingClass("visible");
    setLocationLoadingClass("visible");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(LOCAL_STORAGE_KEYS.lat, latitude);
        localStorage.setItem(LOCAL_STORAGE_KEYS.long, longitude);
        setLocationLoadingClass("done");
        setCityNameFromLatLang(latitude, longitude);
        setLocationMenuStatus(true);
      },
      () => {
        alert(
          "Failed to get your location. Please try again or set the location by selecting the city."
        );
        removeLocationLoadingClass("visible");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function setCityNameFromLatLang(latitude, longitude) {
  const geocoder = new google.maps.Geocoder();
  const latlng = new google.maps.LatLng(latitude, longitude);

  geocoder.geocode({ latLng: latlng }, function (results, status) {
    if (status !== google.maps.GeocoderStatus.OK) {
      console.log("Geocoder failed due to: " + status);
      return;
    }

    if (!results.length) {
      console.log("City name not found.");
      return;
    }

    let cityName = "";
    for (let i = 0; i < results[0].address_components.length; i++) {
      const addressComponent = results[0].address_components[i];
      if (addressComponent.types.includes("locality")) {
        cityName = addressComponent.long_name;
      }
      if (addressComponent.types.includes("administrative_area_level_1")) {
        cityName += ", " + addressComponent.long_name;
      }
      if (addressComponent.types.includes("country")) {
        cityName += ", " + addressComponent.short_name;
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.city, cityName);
    const cityNameElement = document.getElementById("js-selectedCityName");
    cityNameElement.innerHTML = cityName;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const getLocationButton = document.getElementById("js-getLocation");
  getLocationButton.addEventListener("click", () => {
    setCurrentTimezone();
    setLocationWithGeolocation();
  });
});

// ============================================================
// Get Location Manually by Selecting Country, State, and City
// ============================================================
async function fetchData(source) {
  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    window.alert(
      "There was a problem with retrieving data. Please refresh the page.",
      error
    );
  }
}

let provinceCityList = [];

async function displayProvinceList() {
  const provinceSelect = document.getElementById("js-provinceList");
  provinceCityList = await fetchData("../data/canada-province-city.json");

  provinceCityList.innerHTML = "";
  provinceCityList.forEach((listItem, index) => {
    const option = document.createElement("option");
    option.value = listItem.province.replace(/\s+/g, "-");
    option.text = listItem.province;
    provinceSelect.appendChild(option);

    //Select the first province by default
    if (index === 0) {
      displayCityList(listItem.province);
    }
  });

  provinceSelect.addEventListener("change", (e) =>
    displayCityList(e.target.value.replace(/-/g, " "))
  );
}

function displayCityList(selectedProvince) {
  const citySelect = document.getElementById("js-cityList");
  const cities = provinceCityList.find(
    (listItem) => listItem.province === selectedProvince
  ).city_or_town;

  citySelect.innerHTML = "";
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.replace(/\s+/g, "-");
    option.text = city;
    citySelect.appendChild(option);
  });
}

const GOOGLE_MAP_API_KEY = "AIzaSyBrkeYzcyAiLO6vdS56EXGsTa25O77xtoo";

async function setTimezone(location, utcTimestampInSeconds) {
  const data = await fetchData(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${encodeURIComponent(
      location
    )}&timestamp=${utcTimestampInSeconds}&key=${GOOGLE_MAP_API_KEY}`
  );
  const timezoneName = data.timeZoneId;
  localStorage.setItem(LOCAL_STORAGE_KEYS.timezone, timezoneName);
}

function setLatLongAndTimezoneFromCity(cityName) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: cityName }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();

      localStorage.setItem(LOCAL_STORAGE_KEYS.lat, lat);
      localStorage.setItem(LOCAL_STORAGE_KEYS.long, lng);

      // Set timezone
      const location = `${lat},${lng}`;
      const utcTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
      setTimezone(location, utcTimestampInSeconds);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function submitCity() {
  const provinceSelect = document.getElementById("js-provinceList");
  const citySelect = document.getElementById("js-cityList");

  const selectedProvince =
    provinceSelect.options[provinceSelect.selectedIndex].value;
  const selectedCity = citySelect.options[citySelect.selectedIndex].value;

  const cityName = `${selectedCity}, ${selectedProvince}, Canada`;

  setLatLongAndTimezoneFromCity(cityName);
  localStorage.setItem(LOCAL_STORAGE_KEYS.city, selectedCity);
  const cityNameElement = document.getElementById("js-selectedCityName");
  cityNameElement.innerHTML = cityName;
  setLocationMenuStatus(true);
}

document.addEventListener("DOMContentLoaded", function () {
  const openCitySelectModalButton = document.getElementById(
    "js-openCitySelectModal"
  );
  const citySelectModal = document.getElementById("js-citySelectModal");
  const closeCitySelectModalButton = document.getElementById(
    "js-closeCitySelectModal"
  );

  openCitySelectModalButton.addEventListener("click", () => {
    citySelectModal.classList.add("visible");
  });

  closeCitySelectModalButton.addEventListener("click", () => {
    citySelectModal.classList.remove("visible");
  });

  displayProvinceList();

  const submitCityButton = document.getElementById("js-submitCity");
  submitCityButton.addEventListener("click", () => {
    submitCity();
    citySelectModal.classList.remove("visible");
  });
});
