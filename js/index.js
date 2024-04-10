import { LOCAL_STORAGE_KEYS } from "./common/constants.js";
import {
  setLocationWithGeolocation,
  displayProvinceList,
  submitCity,
} from "./common/location.js";

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
// Select Gender
// ==================================

document.addEventListener("DOMContentLoaded", function () {
  //Set the default to "M" if there is no data in the local storage
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.gender)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.gender, "M");
  }

  const toggleGenderSwitch = document.getElementById("js-toggleGender");
  toggleGenderSwitch.addEventListener("change", (e) => {
    const next = e.target.checked ? "F" : "M";
    localStorage.setItem(LOCAL_STORAGE_KEYS.gender, next);
  });
});

// ==================================
// Get Location with Geolocation API
// ==================================

function setLocationMenuStatus(isSelected) {
  const locationMenu = document.getElementById("js-locationMenu");
  if (isSelected) {
    locationMenu.classList.add("selected");
  } else {
    locationMenu.classList.remove("selected");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const getLocationButton = document.getElementById("js-getLocation");
  getLocationButton.addEventListener("click", () => {
    setLocationWithGeolocation();
  });
});

// ============================================================
// Get Location Manually by Selecting Country, State, and City
// ============================================================

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

  const reselectCityButton = document.getElementById("js-reselectCity");
  reselectCityButton.addEventListener("click", () => {
    setLocationMenuStatus(false);
  });
});


//Go to current.html page
document.addEventListener("DOMContentLoaded", function () {
  const goToCurrentButton = document.getElementById("js-goToCurrent");
  goToCurrentButton.addEventListener("click", () => {
    const missingSetting = checkForMissingSetting();
    console.log(missingSetting)
    if(!missingSetting) {
      window.location.href = "current.html";
    } else {
      alert("Setting is missing: " + missingSetting);
    }
  });

  //Go to current page if the user has already configured settings
  setTimeout(() => {
    const missingSetting = checkForMissingSetting();
    if(!missingSetting) {
      window.location.href = "current.html";
    }
  }, 2400)
});

function checkForMissingSetting(){
  const location = localStorage.getItem(LOCAL_STORAGE_KEYS.city);
  const lat = localStorage.getItem(LOCAL_STORAGE_KEYS.lat);
  const long = localStorage.getItem(LOCAL_STORAGE_KEYS.long);
  const timezone = localStorage.getItem(LOCAL_STORAGE_KEYS.timezone);
  const gender = localStorage.getItem(LOCAL_STORAGE_KEYS.gender);

  let missingSettings = "";
  if(location && lat && long && timezone && gender) {
    missingSettings = undefined;
  }

  if(!location) {
    missingSettings += "Location ";
  }

  if(!lat) {
    missingSettings += "Latitude ";
  }

  if(!long) {
    missingSettings += "Longitude ";
  }

  if(!timezone) {
    missingSettings += "Timezone ";
  }

  if(!gender) {
    missingSettings += "Gender";
  }

  return missingSettings;
}