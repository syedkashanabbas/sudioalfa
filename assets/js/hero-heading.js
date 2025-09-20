document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("hero-heading");
  const sub = document.getElementById("hero-sub");
  const subSub = document.getElementById("hero-sub-sub");

  // Heading cinematic zoom
  setTimeout(() => {
    heading.classList.add("animate-cine-zoom");
  }, 300);
  // Heading cinematic zoom

  // Subheading cinematic rise
  setTimeout(() => {
    sub.classList.add("animate-cine-rise");
  }, 1200);
  //sub-sub heading cinematic rise
    setTimeout(() => {
    subSub.classList.add("animate-cine-rise");
  }, 1600);
});
