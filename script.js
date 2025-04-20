// Configuration
const segments = [
  { text: "10 Coins", color: "#FF6384", icon: "💰" },
  { text: "20 Coins", color: "#36A2EB", icon: "💎" },
  { text: "5 Coins", color: "#FFCE56", icon: "⭐" },
  { text: "50 Coins", color: "#4BC0C0", icon: "🏆" },
  { text: "Try Again", color: "#9966FF", icon: "🔄" },
  { text: "100 Coins", color: "#FF9F40", icon: "🎯" }
];

// Telegram Settings (replace with yours)
const BOT_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";

// App State
let coins = 100;
let spinsToday = 0;
let isSpinning = false;
let soundEnabled = true;

// DOM Elements
const wheelCanvas = document.getElementById('wheelCanvas');
const spinBtn = document.getElementById('spinBtn');
const coinCountEl = document.getElementById('coinCount');
const spinCountEl = document.getElementById('spinCount');
const darkModeToggle = document.getElementById('darkModeToggle');
const soundToggle = document.getElementById('soundToggle');
const usernameInput = document.getElementById('usernameInput');
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

// Initialize Wheel
drawWheel();

// Event Listeners
spinBtn.addEventListener('click', startSpin);
darkModeToggle.addEventListener('click', toggleDarkMode);
soundToggle.addEventListener('click', toggleSound);

// Main Functions
function drawWheel() {
  const ctx = wheelCanvas.getContext('2d');
  const center = wheelCanvas.width / 2;
  const segmentAngle = (2 * Math.PI) / segments.length;
  
  segments.forEach((segment, i) => {
    ctx.beginPath();
    ctx.fillStyle = segment.color;
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 10, i * segmentAngle, (i + 1) * segmentAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(i * segmentAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(segment.icon + " " + segment.text, center - 20, 10);
    ctx.restore();
  });
}

function startSpin() {
  if (isSpinning) return;
  if (coins < 10) return alert("Not enough coins!");
  if (spinsToday >= 5) return alert("Daily spin limit reached!");
  
  coins -= 10;
  spinsToday++;
  updateStats();
  
  if (soundEnabled) spinSound.play();
  
  isSpinning = true;
  spinBtn.disabled = true;
  
  const spinAngle = 3600 + Math.floor(Math.random() * 360);
  wheelCanvas.style.transform = `rotate(${spinAngle}deg)`;
  
  setTimeout(() => {
    const winnerIndex = Math.floor(((spinAngle % 360) / 360) * segments.length);
    declareWinner(winnerIndex);
  }, 4000);
}

function declareWinner(winnerIndex) {
  isSpinning = false;
  spinBtn.disabled = false;
  
  const winnerSegment = segments[winnerIndex];
  highlightSegment(winnerIndex);
  
  if (soundEnabled) winSound.play();
  triggerConfetti();
  
  // Process prize
  if (winnerSegment.text.includes("Coins")) {
    const coinsWon = parseInt(winnerSegment.text);
    coins += coinsWon;
    showAlert(`You won ${coinsWon} coins!`, "success");
  } else {
    showAlert(winnerSegment.text, "info");
  }
  
  updateStats();
  
  // Telegram alert (if username entered)
  if (usernameInput.value) {
    sendTelegramAlert(usernameInput.value, winnerSegment.text);
  }
}

// Helper Functions
function highlightSegment(index) {
  const ctx = wheelCanvas.getContext('2d');
  const center = wheelCanvas.width / 2;
  const segmentAngle = (2 * Math.PI) / segments.length;
  
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.moveTo(center, center);
  ctx.arc(center, center, center - 10, index * segmentAngle, (index + 1) * segmentAngle);
  ctx.closePath();
  ctx.fill();
  
  setTimeout(drawWheel, 1000);
}

function updateStats() {
  coinCountEl.textContent = coins;
  spinCountEl.textContent = spinsToday;
}

function toggleDarkMode() {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
}

function showAlert(message, type) {
  Swal.fire({
    title: message,
    icon: type,
    confirmButtonText: 'OK'
  });
}

function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function sendTelegramAlert(user, prize) {
  // Replace with actual fetch request to Telegram API
  console.log(`Alert sent: ${user} won ${prize}`);
  // fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=🎉 ${user} won ${prize}!`);
}

// Initialize
updateStats();
