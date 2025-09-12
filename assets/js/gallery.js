// gallery-swiper.js

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("galleryWrapper");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  // how much to move = width of one card + gap
  const item = wrapper.querySelector("img");
  const scrollAmount = item ? item.offsetWidth + 24 : 400; // 24px = Tailwind gap-6

  // Scroll to next
  nextBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    checkButtons();
  });

  // Scroll to prev
  prevBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    checkButtons();
  });

  // Disable buttons when needed
  function checkButtons() {
    setTimeout(() => {
      prevBtn.disabled = wrapper.scrollLeft <= 0;
      nextBtn.disabled =
        wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 5;
      prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
      nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";
    }, 400); // wait until scroll animation finishes
  }

  checkButtons(); // run on load

  // Drag/swipe support
  let isDown = false;
  let startX, scrollLeft;

  wrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });

  wrapper.addEventListener("mouseleave", () => (isDown = false));
  wrapper.addEventListener("mouseup", () => (isDown = false));
  wrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // Mobile swipe
  let touchStartX = 0;
  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].pageX;
    scrollLeft = wrapper.scrollLeft;
  });

  wrapper.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].pageX;
    const walk = (touchX - touchStartX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });
});
