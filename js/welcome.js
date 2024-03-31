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
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(LOCAL_STORAGE_KEYS.lat, latitude);
        localStorage.setItem(LOCAL_STORAGE_KEYS.long, longitude);
      },
      () => {
        alert(
          "Failed to get your location. Please try again or set the location by selecting the city."
        );
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const getLocationButton = document.getElementById("js-getLocation");
  getLocationButton.addEventListener("click", getLocation);
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
});
