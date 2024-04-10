import { LOCAL_STORAGE_KEYS } from "./common/constants.js";

document.addEventListener("DOMContentLoaded", function () {
  // Display current settings
  const location = localStorage.getItem(LOCAL_STORAGE_KEYS.city);
  const locationElement = document.getElementById("js-location");
  locationElement.textContent = location;

  const gender = localStorage.getItem(LOCAL_STORAGE_KEYS.gender);
  const genderSwitchElement = document.getElementById("js-genderSwitch");
  genderSwitchElement.checked = gender === "F";
});
