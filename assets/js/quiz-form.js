const questions = [
  { 
    text: "Nome e Cognome*", 
    type: "input", 
    fields: [
      { name: "nome", type: "text", placeholder: "Es. Mario Rossi" }
    ]
  },
  { 
    text: "Telefono*", 
    type: "input", 
    fields: [
      { name: "telefono", type: "tel", placeholder: "Es. +39 333 1234567" }
    ],
    microcopy: "Ti chiamiamo solo per inviarti la valutazione, mai per spam."
  },
  { 
    text: "Email*", 
    type: "input", 
    fields: [
      { name: "email", type: "email", placeholder: "Es. mario.rossi@email.com" }
    ],
    microcopy: "Riceverai qui la valutazione gratuita."
  },
  { 
    text: "Tipologia di immobile*", 
    type: "select", 
    options: ["Appartamento", "Casa indipendente", "Villa", "Terreno", "Altro"]
  },
  { 
    text: "Indirizzo / Zona*", 
    type: "input", 
    fields: [
      { name: "indirizzo", type: "text", placeholder: "Es. Via Garibaldi 10, Milano" }
    ],
    microcopy: "Non serve l’indirizzo preciso, basta la zona."
  },
  { 
    text: "Confermare", 
    type: "submit", 
    trust: "🔒 I tuoi dati sono al sicuro. In meno di 24 ore riceverai la valutazione gratuita del tuo immobile."
  }
];

let currentQuestion = 0;
let answers = [];

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");

function loadQuestion(index) {
  if (index < questions.length) {
    const q = questions[index];
    questionText.textContent = q.text;
    optionsContainer.innerHTML = "";

    if (q.type === "input") {
      let inputs = [];
      q.fields.forEach(field => {
        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.required = true;
        input.className =
          "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none mb-2";
        optionsContainer.appendChild(input);
        inputs.push(input);
      });

      if (q.microcopy) {
        const mc = document.createElement("p");
        mc.className = "mt-1 text-sm text-gray-500";
        mc.textContent = q.microcopy;
        optionsContainer.appendChild(mc);
      }

      const errorMsg = document.createElement("p");
      errorMsg.className = "mt-2 text-sm text-red-600 hidden";
      errorMsg.textContent = "Per favore compila questo campo.";
      optionsContainer.appendChild(errorMsg);

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Avanti";
      nextBtn.className =
        "mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
      nextBtn.onclick = (e) => {
        e.preventDefault();
        let valid = true;
        inputs.forEach(inp => {
          if (!inp.value.trim()) valid = false;
        });
        if (!valid) {
          errorMsg.classList.remove("hidden");
          return;
        }
        errorMsg.classList.add("hidden");
        q.fields.forEach(field => {
          const val = document.querySelector(`[name="${field.name}"]`).value;
          answers.push({ question: q.text, answer: val });
        });
        currentQuestion++;
        loadQuestion(currentQuestion);
      };
      optionsContainer.appendChild(nextBtn);
    }

    else if (q.type === "select") {
      const select = document.createElement("select");
      select.className =
        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none";
      select.required = true;

      const def = document.createElement("option");
      def.value = "";
      def.textContent = "Seleziona";
      select.appendChild(def);

      q.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      optionsContainer.appendChild(select);

      const errorMsg = document.createElement("p");
      errorMsg.className = "mt-2 text-sm text-red-600 hidden";
      errorMsg.textContent = "Seleziona un'opzione.";
      optionsContainer.appendChild(errorMsg);

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Avanti";
      nextBtn.className =
        "mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
      nextBtn.onclick = (e) => {
        e.preventDefault();
        if (!select.value) {
          errorMsg.classList.remove("hidden");
          return;
        }
        errorMsg.classList.add("hidden");
        answers.push({ question: q.text, answer: select.value });
        currentQuestion++;
        loadQuestion(currentQuestion);
      };
      optionsContainer.appendChild(nextBtn);
    }

    else if (q.type === "submit") {
      if (q.trust) {
        const trustP = document.createElement("p");
        trustP.className = "text-sm text-gray-600 mb-4";
        trustP.textContent = q.trust;
        optionsContainer.appendChild(trustP);
      }

      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Ottieni la tua valutazione gratuita";
      submitBtn.className =
        "mt-4 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
      submitBtn.onclick = (e) => {
        e.preventDefault();
        showThankYou();
      };
      optionsContainer.appendChild(submitBtn);
    }

    AOS.refresh();
  } else {
    showThankYou();
  }
}

function showThankYou() {
  document.getElementById("questionTitle").innerHTML = "🔥 Deal Locked!";
  questionText.textContent = "Grazie! I tuoi dati sono stati inviati. Ti contatteremo entro 24 ore.";
  optionsContainer.innerHTML = "";

  console.log("User Answers:", answers);
}

loadQuestion(currentQuestion);
