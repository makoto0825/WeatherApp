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
