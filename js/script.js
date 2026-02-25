const gomb = document.getElementById("menuBtn");
const oldal = document.getElementById("fullMenu");

oldal.style.display = "none";

gomb.addEventListener("click", () => {
  oldal.style.display = oldal.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("keydown", () => {
  if (oldal.style.display === "flex") {
    oldal.style.display = "none";
  }
});
