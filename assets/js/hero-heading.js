document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("hero-heading");
  const sub = document.getElementById("hero-sub");

  // Heading cinematic zoom
  setTimeout(() => {
    heading.classList.add("animate-cine-zoom");
  }, 300);

  // Subheading cinematic rise
  setTimeout(() => {
    sub.classList.add("animate-cine-rise");
  }, 1200);
});
