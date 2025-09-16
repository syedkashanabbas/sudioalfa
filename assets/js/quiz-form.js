const questions = [
  { text: "What type of property are you ready to sell us?", options: ["Apartment", "House", "Plot / Land", "Other"] },
  { text: "How big is your property?", options: ["Less than 1000 sq ft", "1000 – 2000 sq ft", "2000 – 5000 sq ft", "More than 5000 sq ft"] },
  { text: "Where is your property located?", options: ["Prime City Area", "Suburbs", "Highway Side", "Other"] },
  { text: "When do you want to close the deal?", options: ["Right Now", "Within 1–3 Months", "3–6 Months", "Still Deciding"] },
  { text: "How can we contact you?", type: "input" }
];

let currentQuestion = 0;
let answers = [];

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");

function loadQuestion(index) {
  if (index < questions.length) {
    questionText.textContent = questions[index].text;
    optionsContainer.innerHTML = "";

    // Input-type question
    if (questions[index].type === "input") {
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.placeholder = "Enter your email";
      emailInput.required = true;
      emailInput.className = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none";

      const phoneInput = document.createElement("input");
      phoneInput.type = "tel";
      phoneInput.placeholder = "Enter your phone number";
      phoneInput.required = true;
      phoneInput.className = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none mt-4";

      const errorMsg = document.createElement("p");
      errorMsg.className = "mt-2 text-sm text-red-600 hidden";
      errorMsg.textContent = "Please fill out both Email and Phone correctly.";

      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit";
      submitBtn.className = "mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";

      submitBtn.onclick = () => {
        if (!emailInput.value.trim() || !phoneInput.value.trim()) {
          errorMsg.classList.remove("hidden");
          return;
        }
        errorMsg.classList.add("hidden");
        answers.push({ question: "Email", answer: emailInput.value });
        answers.push({ question: "Phone", answer: phoneInput.value });
        showThankYou();
      };

      optionsContainer.appendChild(emailInput);
      optionsContainer.appendChild(phoneInput);
      optionsContainer.appendChild(errorMsg);
      optionsContainer.appendChild(submitBtn);

    } else {
      // Option-type question
      questions[index].options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = "w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-500 transform hover:scale-105";
        btn.setAttribute("data-aos", "fade-up");
        btn.onclick = () => {
          answers.push({ question: questions[index].text, answer: option });
          currentQuestion++;
          loadQuestion(currentQuestion);
        };
        optionsContainer.appendChild(btn);
      });
    }

    AOS.refresh();
  } else {
    showThankYou();
  }
}

function showThankYou() {
  document.getElementById("questionTitle").innerHTML = "🔥 Deal Locked!";
  questionText.textContent = "Thanks for trusting Studio Alfa. Your property details are with us — our team will contact you as soon as possible!";
  optionsContainer.innerHTML = "";

  console.log("User Answers:", answers);
}

loadQuestion(currentQuestion);
