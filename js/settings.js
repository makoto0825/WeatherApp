import { LOCAL_STORAGE_KEYS } from "./common/constants.js";
import {
  setLocationWithGeolocation,
  displayProvinceList,
  submitCity,
} from "./common/location.js";

document.addEventListener("DOMContentLoaded", function () {
  // Display current settings
  const location = localStorage.getItem(LOCAL_STORAGE_KEYS.city);
  const locationElement = document.getElementById("js-selectedCityName");
  locationElement.textContent = location;

  const gender = localStorage.getItem(LOCAL_STORAGE_KEYS.gender);
  const genderSwitchElement = document.getElementById("js-genderSwitch");
  genderSwitchElement.checked = gender === "F";

  // Update gender setting
  genderSwitchElement.addEventListener("change", (e) => {
    const next = e.target.checked ? "F" : "M";
    localStorage.setItem(LOCAL_STORAGE_KEYS.gender, next);
  });

  // Update location setting
  const locationMenu = document.getElementById("js-locationMenu");
  const reselectCityButton = document.getElementById("js-reselectCity");
  reselectCityButton.addEventListener("click", () => {
    locationMenu.classList.remove("selected");
  });

  // Get Location with Geolocation API
  const getLocationButton = document.getElementById("js-getLocation");
  getLocationButton.addEventListener("click", () => {
    setLocationWithGeolocation();
  });

  // Get Location Manually by Selecting Country, State, and City
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
