// toggles active class of selected button for wayfinding
const toggleActive = function(button, otherButtons = null) {
    button.addEventListener("click", () => {
        if (otherButtons != null) {
            otherButtons.forEach(button => {
                button.classList.remove("active");
            });
        }
        button.classList.toggle("active");
    });
}

// navbar buttons
const navHome = document.querySelector("#home");
const navCustom = document.querySelector("#custom");
const navSedan = document.querySelector("#sedan");
const navSuv = document.querySelector("#suv");
const navTruck = document.querySelector("#truck");
const navButtons = [navHome, navCustom, navSedan, navSuv, navTruck]; // navbar button list

toggleActive(navHome, navButtons);
toggleActive(navCustom, navButtons);
toggleActive(navSedan, navButtons);
toggleActive(navSuv, navButtons);
toggleActive(navTruck, navButtons);