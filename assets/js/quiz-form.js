// /js/quiz.js
(() => {
  // TODO: apni key daalo
  const WEB3FORMS_ACCESS_KEY = "7c83cf22-1fb8-4d41-9d6e-dbfbbf4998af";
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  // Aapke existing questions/quiz state
  const questions = [
    { text: "Nome e Cognome*", type: "input", fields: [{ name: "nome", type: "text", placeholder: "Es. Mario Rossi" }] },
    { text: "Telefono*", type: "input", fields: [{ name: "telefono", type: "tel", placeholder: "Es. +39 333 1234567" }], microcopy: "Ti chiamiamo solo per inviarti la valutazione, mai per spam." },
    { text: "Email*", type: "input", fields: [{ name: "email", type: "email", placeholder: "Es. mario.rossi@email.com" }], microcopy: "Riceverai qui la valutazione gratuita." },
    { text: "Tipologia di immobile*", type: "select", options: ["Appartamento", "Casa indipendente", "Villa", "Terreno", "Altro"] },
    { text: "Indirizzo / Zona*", type: "input", fields: [{ name: "indirizzo", type: "text", placeholder: "Es. Via Garibaldi 10, Milano" }], microcopy: "Non serve l’indirizzo preciso, basta la zona." },
    { text: "Confermare", type: "submit", trust: "🔒 I tuoi dati sono al sicuro. In meno di 24 ore riceverai la valutazione gratuita del tuo immobile." }
  ];

  let currentQuestion = 0;
  let answers = [];

  const questionTitle = document.getElementById("questionTitle");
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("options");
  const resultEl = document.getElementById("result") || (() => {
    const d = document.createElement("div"); d.id = "result"; optionsContainer.after(d); return d;
  })();

  function setResult(msg, ok = true) {
    resultEl.textContent = msg;
    resultEl.className = `mt-4 text-sm ${ok ? "text-green-700" : "text-red-700"}`;
    resultEl.style.display = "block";
  }

  function clearResult() {
    resultEl.textContent = "";
    resultEl.style.display = "none";
  }

  function safeKey(label) {
    return label.replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  }

  async function sendToWeb3Forms() {
    // Flatten + pretty message
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Nuova richiesta valutazione immobiliare",
      from_name: "Landing Quiz",
      botcheck: "" // honeypot (khali hi bhejo)
    };

    // Field-wise mapping for easy reading in email
    answers.forEach(({ question, answer }) => {
      const key = safeKey(question);
      payload[key] = Array.isArray(answer) ? answer.join(", ") : answer;
    });

    // Full transcript in one message field as well (nice for humans)
    payload.message = answers.map(a => `${a.question}: ${a.answer}`).join("\n");

    setResult("Invio in corso…");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.status === 200) {
        setResult("", true);
        return { ok: true };
      } else {
        setResult(json?.message || "Errore durante l'invio.", false);
        return { ok: false, error: json };
      }
    } catch (err) {
      setResult("Qualcosa è andato storto. Riprova.", false);
      return { ok: false, error: err };
    }
  }

  function loadQuestion(index) {
    clearResult();
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
          input.className = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none mb-2";
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
        nextBtn.className = "mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
        nextBtn.onclick = (e) => {
          e.preventDefault();
          let valid = inputs.every(inp => inp.value.trim());
          if (!valid) { errorMsg.classList.remove("hidden"); return; }
          errorMsg.classList.add("hidden");
          q.fields.forEach(field => {
            const val = optionsContainer.querySelector(`[name="${field.name}"]`).value.trim();
            answers.push({ question: q.text, answer: val });
          });
          currentQuestion++;
          loadQuestion(currentQuestion);
        };
        optionsContainer.appendChild(nextBtn);
      }

      else if (q.type === "select") {
        const select = document.createElement("select");
        select.className = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none";
        select.required = true;

        const def = document.createElement("option");
        def.value = ""; def.textContent = "Seleziona";
        select.appendChild(def);

        q.options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt; option.textContent = opt;
          select.appendChild(option);
        });
        optionsContainer.appendChild(select);

        const errorMsg = document.createElement("p");
        errorMsg.className = "mt-2 text-sm text-red-600 hidden";
        errorMsg.textContent = "Seleziona un'opzione.";
        optionsContainer.appendChild(errorMsg);

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Avanti";
        nextBtn.className = "mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
        nextBtn.onclick = (e) => {
          e.preventDefault();
          if (!select.value) { errorMsg.classList.remove("hidden"); return; }
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
        submitBtn.className = "mt-4 w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:opacity-90 transition";
        submitBtn.onclick = async (e) => {
          e.preventDefault();
          submitBtn.disabled = true;
          submitBtn.classList.add("opacity-70", "cursor-not-allowed");
          setResult("Invio in corso…");

          const { ok } = await sendToWeb3Forms();
          if (ok) {
            questionTitle.innerHTML = "🔥 Deal Locked!";
            questionText.textContent = "Grazie! I tuoi dati sono stati inviati. Ti contatteremo entro 24 ore.";
            optionsContainer.innerHTML = "";
            answers = []; // optional: reset after success
          } else {
            // keep the form visible so user can retry or edit
          }

          setTimeout(() => { submitBtn.disabled = false; submitBtn.classList.remove("opacity-70","cursor-not-allowed"); }, 1500);
        };
        optionsContainer.appendChild(submitBtn);
      }

      try { AOS && AOS.refresh && AOS.refresh(); } catch {}
    } else {
      // fallback, should not hit because we handle submit step
      questionTitle.innerHTML = "🔥 Deal Locked!";
      questionText.textContent = "Grazie! I tuoi dati sono stati inviati. Ti contatteremo entro 24 ore.";
      optionsContainer.innerHTML = "";
    }
  }

  // boot
  document.addEventListener("DOMContentLoaded", () => {
    loadQuestion(currentQuestion);
  });
})();
