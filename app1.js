// Get canvas element and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Ball properties
var x = canvas.width / 2;
var y = canvas.height - 30;
var initialDx = 2; // Initial speed of the ball
var initialDy = -2; // Initial speed of the ball
var dx = initialDx;
var dy = initialDy;
var ballMaxRadius = 20; // Maximum radius of the ball
var ballMinRadius = 5;  // Minimum radius of the ball
var ballRadius = ballMaxRadius; // Initial radius of the ball

// Bar properties
var barHeight = 10;
var barWidth = 200;
var barX = (canvas.width - barWidth) / 2;
var rightPressed = false; // Initialize to false
var leftPressed = false; // Initialize to false

// Bar speed properties
var initialBarSpeed = 7;
var barSpeed = initialBarSpeed;

// Score
var score = 0;

// Game state
var gameRunning = true;

// Event listener for keyboard input
document.addEventListener("keydown", handleKeyDownUp, false);
document.addEventListener("keyup", handleKeyDownUp, false);

// Keyboard input handler
function handleKeyDownUp(event) {
    if (event.key === "ArrowRight" || event.key === "Right") {
        rightPressed = (event.type === "keydown");
    } else if (event.key === "ArrowLeft" || event.key === "Left") {
        leftPressed = (event.type === "keydown");
    } else if (!gameRunning && event.key === " ") { 
        console.log('Space clicked')// Spacebar pressed after losing
        resetGame();
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the bar
function drawBar() {
    ctx.beginPath();
    ctx.rect(barX, canvas.height - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Update the bar's position
function updateBarPosition() {
    if (rightPressed && barX < canvas.width - barWidth) {
        barX += barSpeed;
    } else if (leftPressed && barX > 0) {
        barX -= barSpeed;
    }
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Reset the game
function resetGame() {
    gameRunning = true;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = initialDx;
    dy = initialDy;
    barX = (canvas.width - barWidth) / 2;
    score = 0;
    ballRadius = ballMaxRadius; // Reset ball size
    barSpeed = initialBarSpeed; // Reset bar speed
    draw(); // Redraw the game
}

// Update ball speed with score
function updateSpeedWithScore() {
    // Increase ball speed horizontally
    if (dx > 0) {
        dx += 0.01 * score;
    } else {
        dx -= 0.01 * score;
    }
    
    // Increase ball speed vertically
    if (dy > 0) {
        dy += 0.01 * score;
    } else {
        dy -= 0.01 * score;
    }

    // Decrease ball radius as acceleration increases
    ballRadius -= 0.01 * score;

    // Increase bar speed as acceleration increases
    barSpeed += 0.01 * score;
}

// Main game loop
function draw() {
    clearCanvas();
    drawBall();
    drawBar();

    if (gameRunning) {
        // Ball collision with the bar
        if (x + dx > barX && x + dx < barX + barWidth && y + dy > canvas.height - barHeight - ballRadius) {
            dy = -dy; // Reverse the vertical direction of the ball
            score++; // Increment score
        }

        // Ball collision with the canvas edges
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx; // Reverse the horizontal direction of the ball
        }
        if (y + dy < ballRadius) {
            dy = -dy; // Reverse the vertical direction of the ball
        } else if (y + dy > canvas.height - ballRadius) {
            // Game over
            gameRunning = false;
        }

        updateBarPosition();
        updateBallPosition();
        updateSpeedWithScore(); // Update ball speed with score
        drawScore();
    } else {
        // Game over message
        ctx.font = "30px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText("Press space to restart", canvas.width / 2 - 150, canvas.height / 2 + 40);
    }

    requestAnimationFrame(draw); // Recursive call for animation
}

// Update the ball's position
function updateBallPosition() {
    x += dx;
    y += dy;
}

// Draw score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

draw(); // Start the game
