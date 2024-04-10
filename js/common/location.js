import { LOCAL_STORAGE_KEYS } from "./constants.js";

const GOOGLE_MAP_API_KEY = "AIzaSyBrkeYzcyAiLO6vdS56EXGsTa25O77xtoo";

// ==================================
// Get Location with Geolocation API
// ==================================

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

function getCurrentTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getCityNameFromLatLng(latitude, longitude) {
  return new Promise((resolve, reject) => {
    if (!latitude || !longitude) {
      reject("Latitude and longitude are required.");
    }

    // Get the name from latitude and longitude using Google Maps Geocoding API
    // https://developers.google.com/maps/documentation/geocoding
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode({ latLng: latlng }, function (results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        reject("Geocoder failed due to: " + status);
      }

      if (!results.length) {
        reject("City name not found.");
      }

      let cityName = ""; //FORMAT: City, Province, Country(Short Name) (e.g. Toronto, ON, Canada)

      for (let i = 0; i < results[0].address_components.length; i++) {
        const addressComponent = results[0].address_components[i];

        //Get the city name
        if (addressComponent.types.includes("locality")) {
          cityName = addressComponent.long_name;
        }

        //Get the province name
        if (addressComponent.types.includes("administrative_area_level_1")) {
          cityName += ", " + addressComponent.long_name;
        }

        //Get the country name
        if (addressComponent.types.includes("country")) {
          cityName += ", " + addressComponent.short_name;
        }
      }
      resolve(cityName);
    });
  });
}

function getLatLng() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        () => {
          reject(
            "Failed to get your location. Please try again or set the location by selecting the city."
          );
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

export function setLocationWithGeolocation() {
  const cityNameElement = document.getElementById("js-selectedCityName");
  //Reset class first, then add the class to show the loading
  removeLocationLoadingClass("done");
  removeLocationLoadingClass("visible");
  setLocationLoadingClass("visible");

  const timezone = getCurrentTimezone();
  localStorage.setItem(LOCAL_STORAGE_KEYS.timezone, timezone);

  getLatLng()
    .then(({ latitude, longitude }) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.lat, latitude);
      localStorage.setItem(LOCAL_STORAGE_KEYS.long, longitude);

      getCityNameFromLatLng(latitude, longitude).then((cityName) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.city, cityName);
        cityNameElement.innerHTML = cityName;
      });

      setLocationLoadingClass("done");
      setLocationMenuStatus(true);
    })
    .catch((e) => {
      alert(e);
      removeLocationLoadingClass("visible");
    });
}

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

export async function displayProvinceList() {
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

async function getTimezone(location, utcTimestampInSeconds) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the timezone from the location using Google Maps Timezone API
      // https://developers.google.com/maps/documentation/timezone/overview
      const data = await fetchData(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${encodeURIComponent(
          location
        )}&timestamp=${utcTimestampInSeconds}&key=${GOOGLE_MAP_API_KEY}`
      );
      resolve(data.timeZoneId); //e.g. America/Toronto
    } catch (error) {
      reject(error);
    }
  });
}

function getLatLongFromCityName(cityName) {
  return new Promise((resolve, reject) => {
    // Get the latitude and longitude from the city name using Google Maps Geocoding API
    // https://developers.google.com/maps/documentation/geocoding
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        resolve({ latitude, longitude });
      } else {
        reject(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  });
}

export function submitCity() {
  const provinceSelect = document.getElementById("js-provinceList");
  const citySelect = document.getElementById("js-cityList");

  const selectedProvince =
    provinceSelect.options[provinceSelect.selectedIndex].value;
  const selectedCity = citySelect.options[citySelect.selectedIndex].value;

  const cityName = `${selectedCity}, ${selectedProvince}, Canada`; //NOTE: Selection is limited to Canada only

  localStorage.setItem(LOCAL_STORAGE_KEYS.city, cityName);
  const cityNameElement = document.getElementById("js-selectedCityName");
  cityNameElement.innerHTML = cityName;

  getLatLongFromCityName(cityName).then(({ latitude, longitude }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.lat, latitude);
    localStorage.setItem(LOCAL_STORAGE_KEYS.long, longitude);

    const location = `${latitude},${longitude}`;
    const utcTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
    getTimezone(location, utcTimestampInSeconds).then((tz) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.timezone, tz);
    });

    setLocationMenuStatus(true);
  });
}
