document.addEventListener("scroll", () => {
  const logo = document.getElementById("logo");

  if (window.scrollY > 50) {
    // Small mode
    logo.classList.remove("h-48", "mt-32");
    logo.classList.add("h-20", "mt-6");
  } else {
    // Big mode
    logo.classList.remove("h-20", "mt-6");
    logo.classList.add("h-48", "mt-32");
  }
});
