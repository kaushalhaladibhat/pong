const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12, PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;

// Game variables
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
let playerScore = 0, aiScore = 0;

// Mouse controls player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, 2 * Math.PI, false);
  ctx.fill();

  // Draw scores
  ctx.font = "32px Arial";
  ctx.fillText(playerScore, canvas.width / 2 - 50, 50);
  ctx.fillText(aiScore, canvas.width / 2 + 30, 50);
}

// Move the ball, handle collisions
function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Player paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_RADIUS > playerY &&
    ballY - BALL_RADIUS < playerY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    // Add some "spin" based on where the ball hits the paddle
    let hitPoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY += hitPoint * 2;
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS; // prevent sticking
  }

  // AI paddle collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY + BALL_RADIUS > aiY &&
    ballY - BALL_RADIUS < aiY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    // Add some "spin"
    let hitPoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY += hitPoint * 2;
    ballX = AI_X - BALL_RADIUS; // prevent sticking
  }

  // Score for AI
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    resetBall();
  }
  // Score for player
  if (ballX + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI paddle movement (basic AI)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 10) {
    aiY += 5;
  } else if (aiCenter > ballY + 10) {
    aiY -= 5;
  }
  // Clamp AI paddle within bounds
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  // Start ball towards whoever scored last
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();