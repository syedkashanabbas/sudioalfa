const questions = [
  {
    text: "What type of property are you ready to sell us?",
    options: ["Apartment", "House", "Plot / Land", "Other"]
  },
  {
    text: "How big is your property?",
    options: ["Less than 1000 sq ft", "1000 – 2000 sq ft", "2000 – 5000 sq ft", "More than 5000 sq ft"]
  },
  {
    text: "Where is your property located?",
    options: ["Prime City Area", "Suburbs", "Highway Side", "Other"]
  },
  {
    text: "When do you want to close the deal?",
    options: ["Right Now", "Within 1–3 Months", "3–6 Months", "Still Deciding"]
  },
  {
    text: "Do you want our experts to give you an instant valuation?",
    options: ["Yes, I want the best price", "Maybe later", "Not needed"]
  }
];


let currentQuestion = 0;
let answers = [];

const modal = document.getElementById("quizModal");
const box = document.getElementById("quizBox");
const closeBtn = document.getElementById("closeQuiz");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");

// Load Question
function loadQuestion(index) {
  if (index < questions.length) {
    questionText.textContent = questions[index].text;
    optionsContainer.innerHTML = "";

    questions[index].options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-105";
      btn.setAttribute("data-aos", "fade-up");
      btn.setAttribute("data-aos-duration", "600");
      btn.onclick = () => {
        answers.push({ question: questions[index].text, answer: option });
        currentQuestion++;
        loadQuestion(currentQuestion);
      };
      optionsContainer.appendChild(btn);
    });

    AOS.refresh(); // reapply AOS
  } else {
    showThankYou();
  }
}

function showThankYou() {
  document.getElementById("questionTitle").innerHTML = "🔥 Deal Locked!";
  questionText.textContent = "Thanks for trusting Studio Alfa. Your property details are with us — our team is already on it!";
  optionsContainer.innerHTML = "";

  console.log("User Answers:", answers);

  setTimeout(() => closeModal(), 2000); // auto-close after 4s
}


function openModal() {
  modal.classList.remove("opacity-0", "pointer-events-none");
}

function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
}

closeBtn.addEventListener("click", closeModal);

// Auto open
loadQuestion(currentQuestion);
openModal();
