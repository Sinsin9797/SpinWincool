// CONFIG
const segments = [
  { text: "100", color: "#FF6384", value: 100 },
  { text: "200", color: "#36A2EB", value: 200 },
  { text: "50", color: "#FFCE56", value: 50 },
  { text: "300", color: "#4BC0C0", value: 300 },
  { text: "150", color: "#9966FF", value: 150 },
  { text: "400", color: "#FF9F40", value: 400 }
];

// INIT
const wheel = document.getElementById('wheel');
const ctx = wheel.getContext('2d');
let isSpinning = false;

// SOUNDS (NEW WORKING LINKS)
const spinSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');

// DRAW WHEEL
function drawWheel() {
  const center = wheel.width / 2;
  const arc = Math.PI * 2 / segments.length;
  
  segments.forEach((segment, i) => {
    ctx.beginPath();
    ctx.fillStyle = segment.color;
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 10, i * arc, (i + 1) * arc);
    ctx.lineTo(center, center);
    ctx.fill();
    
    // Text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(i * arc + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(segment.text, center - 10, 10);
    ctx.restore();
  });
}

// SPIN FUNCTION (FIXED)
function spinWheel() {
  if (isSpinning) return;
  
  isSpinning = true;
  spinSound.play();
  
  const spinAngle = 3600 + Math.floor(Math.random() * 360);
  wheel.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
  wheel.style.transform = `rotate(${spinAngle}deg)`;
  
  setTimeout(() => {
    const winnerIndex = Math.floor(((spinAngle % 360) / 360) * segments.length);
    showResult(segments[winnerIndex]);
  }, 4000);
}

// RESULT DISPLAY (NEW)
function showResult(prize) {
  isSpinning = false;
  winSound.play();
  confetti({
    particleCount: 150,
    spread: 70
  });
  
  alert(`🎉 You won ${prize.value} coins!`);
}

// INITIALIZE
drawWheel();
document.getElementById('spinBtn').addEventListener('click', spinWheel);
