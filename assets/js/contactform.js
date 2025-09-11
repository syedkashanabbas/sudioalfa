document.getElementById("sellForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const loader = document.getElementById("loader");
  const result = document.getElementById("result");
  
  loader.classList.remove("hidden");
  result.classList.add("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");
    result.classList.remove("hidden");
  }, 2500); // 2.5 sec smooth wait
});
