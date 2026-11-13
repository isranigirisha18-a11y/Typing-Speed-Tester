const passages = [
  "Colourful ideas often begin with a curious question and a little courage to try something new.",
  "A keyboard is more than a set of keys; it is a doorway to stories, designs, discoveries and bright ideas.",
  "Small steps taken with patience can turn a difficult challenge into a skill you are proud to share.",
  "Creative minds notice possibilities everywhere, from the pattern of a leaf to the rhythm of a sentence."
];

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const mistakesDisplay = document.getElementById("mistakes");
const statusDisplay = document.getElementById("status");
const resultCard = document.getElementById("result");
const resultText = document.getElementById("resultText");

let passage = "";
let timeLeft = 60;
let timerId = null;
let hasStarted = false;
let isFinished = false;

function drawPassage() {
  quoteDisplay.replaceChildren();
  passage.split("").forEach((character, index) => {
    const letter = document.createElement("span");
    letter.textContent = character;
    if (index === 0) letter.classList.add("active");
    quoteDisplay.appendChild(letter);
  });
}

function updateScore() {
  const typedText = quoteInput.value;
  const letters = quoteDisplay.querySelectorAll("span");
  let errors = 0;
  let correctLetters = 0;

  letters.forEach((letter, index) => {
    letter.classList.remove("correct", "incorrect", "active");
    if (index < typedText.length) {
      if (typedText[index] === passage[index]) {
        letter.classList.add("correct");
        correctLetters++;
      } else {
        letter.classList.add("incorrect");
        errors++;
      }
    } else if (index === typedText.length) {
      letter.classList.add("active");
    }
  });

  const elapsedMinutes = Math.max((60 - timeLeft) / 60, 1 / 60);
  const wordsPerMinute = Math.max(0, Math.round(((typedText.length - errors) / 5) / elapsedMinutes));
  const accuracy = typedText.length ? Math.round((correctLetters / typedText.length) * 100) : 100;

  wpmDisplay.textContent = wordsPerMinute;
  accuracyDisplay.textContent = `${accuracy}%`;
  mistakesDisplay.textContent = errors;

  if (typedText.length >= passage.length) finishRound();
}

function beginClock() {
  if (hasStarted || isFinished) return;
  hasStarted = true;
  statusDisplay.textContent = "You're in the flow. Keep it going!";
  timerId = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    updateScore();
    if (timeLeft <= 0) finishRound();
  }, 1000);
}

function finishRound() {
  if (isFinished) return;
  isFinished = true;
  clearInterval(timerId);
  quoteInput.disabled = true;
  statusDisplay.textContent = "Round complete — your score is ready.";
  resultText.textContent = `You typed at ${wpmDisplay.textContent} WPM with ${accuracyDisplay.textContent} accuracy and ${mistakesDisplay.textContent} mistake(s).`;
  resultCard.hidden = false;
}

function startNewRound() {
  clearInterval(timerId);
  timerId = null;
  passage = passages[Math.floor(Math.random() * passages.length)];
  timeLeft = 60;
  hasStarted = false;
  isFinished = false;
  timeDisplay.textContent = "60";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  mistakesDisplay.textContent = "0";
  quoteInput.value = "";
  quoteInput.disabled = false;
  resultCard.hidden = true;
  statusDisplay.textContent = "The clock begins with your first keystroke.";
  drawPassage();
}

quoteInput.addEventListener("input", () => {
  if (isFinished) return;
  beginClock();
  updateScore();
});
document.getElementById("restartBtn").addEventListener("click", startNewRound);
document.getElementById("tryAgainBtn").addEventListener("click", startNewRound);
startNewRound();
