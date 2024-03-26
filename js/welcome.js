// ===========================
// Switching Sliders
// ===========================
function scrollSlide(direction) {
  const sliderContent = document.getElementById("sliderContent");
  const currentNumber = parseInt(sliderContent.getAttribute("current"));

  sliderContent.setAttribute(
    "current",
    direction === "next" ? currentNumber + 1 : currentNumber - 1
  );
}

const nextButtons = document.querySelectorAll(".slide_button_next");
nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scrollSlide("next");
  });
});

const prevButtons = document.querySelectorAll(".slide_button_prev");
prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scrollSlide("prev");
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
