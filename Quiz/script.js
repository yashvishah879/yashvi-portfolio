
const questions = [
  {
    text: "What does a large language model actually predict?",
    options: [
      "The next token",
      "The entire paragraph",
      "The final answer",
      "The user's intention"
    ],
    correct: "The next token"
  },
  {
    text: "In the commit-message format used in this course, what comes before the colon?",
    options: [
      "The type, such as feat or fix",
      "The filename",
      "The programmer name",
      "The date"
    ],
    correct: "The type, such as feat or fix"
  },
  {
    text: "What must a unit test do before the bug is fixed?",
    options: ["Fail", "Pass", "Stop running", "Delete the code"],
    correct: "Fail"
  },
  {
    text: "Where should the styling for a webpage live?",
    options: [
      "In a separate CSS file",
      "Inside Python",
      "Inside the browser console",
      "Inside a text file"
    ],
    correct: "In a separate CSS file"
  },
  {
    text: "What does a loop inside another loop usually mean for time complexity?",
    options: [
      "It is quadratic",
      "It is constant",
      "It is logarithmic",
      "It has no complexity"
    ],
    correct: "It is quadratic"
  }
];

const questionTextEl = document.getElementById("question-text");
const optionsListEl = document.getElementById("options-list");
const progressEl = document.getElementById("progress");
const quizScreenEl = document.getElementById("quiz-screen");
const resultsScreenEl = document.getElementById("results-screen");
const scoreTextEl = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");

let currentIndex = 0;
let score = 0;
let answering = false;

function renderQuestion() {
  const q = questions[currentIndex];

  questionTextEl.textContent = q.text;
  progressEl.textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;

  optionsListEl.innerHTML = "";

  q.options.forEach((option) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = option;

    btn.addEventListener("click", () => {
      handleAnswer(option);
    });

    li.appendChild(btn);
    optionsListEl.appendChild(li);
  });

  answering = false;
}

function handleAnswer(selected) {
  if (answering) return;

  answering = true;

  const q = questions[currentIndex];

  if (selected === q.correct) {
    score++;
  }

  const buttons = optionsListEl.querySelectorAll(".option-btn");

  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  currentIndex++;

  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreenEl.classList.add("hidden");
  resultsScreenEl.classList.remove("hidden");

  progressEl.textContent = "Quiz completed!";
  scoreTextEl.textContent =
    `Your score: ${score} out of ${questions.length}`;
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  answering = false;

  resultsScreenEl.classList.add("hidden");
  quizScreenEl.classList.remove("hidden");

  renderQuestion();
}

restartBtn.addEventListener("click", restartQuiz);

renderQuestion();
