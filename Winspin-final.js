
const canvas = document.getElementById("wheelcanvas");
const ctx = canvas.getContext("2d");
let coins = 0;
let spinsLeft = 3;
let username = "";

const segments = ["10", "20", "0", "50", "30", "0", "100", "0"];
const spinSound = new Audio("assets/spin.mp3");
const winSound = new Audio("assets/win.mp3");

function drawWheel() {
  const angleStep = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    const angle = i * angleStep;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, angle, angle + angleStep);
    ctx.fillStyle = i % 2 === 0 ? "#f00" : "#0f0";
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(segments[i], 150 + 100 * Math.cos(angle + angleStep / 2) - 10, 150 + 100 * Math.sin(angle + angleStep / 2));
  }
}

function spin() {
  if (spinsLeft <= 0) {
    alert("No spins left!");
    return;
  }
  spinSound.play();
  const prizeIndex = Math.floor(Math.random() * segments.length);
  const prize = parseInt(segments[prizeIndex]);
  setTimeout(() => {
    winSound.play();
    alert("You won: " + prize + " coins!");
    coins += prize;
    spinsLeft--;
    document.getElementById("coins").textContent = coins;
    document.getElementById("spinsLeft").textContent = spinsLeft;
  }, 2000);
}

function saveUsername() {
  username = document.getElementById("username").value;
  alert("Username saved: " + username);
}

drawWheel();
