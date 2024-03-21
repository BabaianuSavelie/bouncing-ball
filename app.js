var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var initialDx = 2;
var initialDy = -2;
var dx = initialDx;
var dy = initialDy;
var ballMaxRadius = 20;
var ballMinRadius = 5;
var ballRadius = ballMaxRadius;

var barHeight = 10;
var barWidth = 200;
var barX = (canvas.width - barWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var initialBarSpeed = 7;
var barSpeed = initialBarSpeed;

var score = 0;

var gameRunning = true;

document.addEventListener("keydown", handleKeyDownUp, false);
document.addEventListener("keyup", handleKeyDownUp, false);

function handleKeyDownUp(event) {
    if (event.key === "ArrowRight" || event.key === "Right") {
        rightPressed = (event.type === "keydown");
    } else if (event.key === "ArrowLeft" || event.key === "Left") {
        leftPressed = (event.type === "keydown");
    } else if (!gameRunning && event.key === " ") { 
        resetGame();
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBar() {
    ctx.beginPath();
    ctx.rect(barX, canvas.height - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function updateBarPosition() {
    if (rightPressed && barX < canvas.width - barWidth) {
        barX += barSpeed;
    } else if (leftPressed && barX > 0) {
        barX -= barSpeed;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
    gameRunning = true;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = initialDx;
    dy = initialDy;
    barX = (canvas.width - barWidth) / 2;
    score = 0;
    ballRadius = ballMaxRadius;
    barSpeed = initialBarSpeed;
    draw();
}

function updateSpeedWithScore() {
    if (dx > 0) {
        dx += 0.01 * score;
    } else {
        dx -= 0.01 * score;
    }
    
    if (dy > 0) {
        dy += 0.01 * score;
    } else {
        dy -= 0.01 * score;
    }

    ballRadius -= 0.01 * score;
    barSpeed += 0.01 * score;
}

function draw() {
    clearCanvas();
    drawBall();
    drawBar();

    if (gameRunning) {
        if (x + dx > barX && x + dx < barX + barWidth && y + dy > canvas.height - barHeight - ballRadius) {
            dy = -dy;
            score++;
        }

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            gameRunning = false;
        }

        updateBarPosition();
        updateBallPosition();
        updateSpeedWithScore();
        drawScore();
    } else {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText("Press space to restart", canvas.width / 2 - 150, canvas.height / 2 + 40);
    }

    requestAnimationFrame(draw);
}

function updateBallPosition() {
    x += dx;
    y += dy;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

draw();
