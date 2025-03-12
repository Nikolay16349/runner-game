const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

const groundLevel = canvas.height - 50;

let player = { 
    x: 50, 
    y: groundLevel - 15, 
    radius: 15, 
    dy: 0, 
    jumping: false 
};

let obstacles = [];
let gameSpeed = 3;
let gravity = 0.4;
let jumpPower = -10;
let obstacleTimer = 0;
let obstacleInterval = 120;
let score = 0;

function updateScore() {
    document.getElementById("score").textContent = Очки: ${score};
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

document.getElementById("jumpButton").addEventListener("click", () => {
    if (!player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

function update() {
    player.y += player.dy;
    player.dy += gravity;

    if (player.y + player.radius >= groundLevel) {
        player.y = groundLevel - player.radius;
        player.dy = 0;
        player.jumping = false;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        if (
            player.x + player.radius > obstacles[i].x &&
            player.x - player.radius < obstacles[i].x + obstacles[i].width &&
            player.y + player.radius > obstacles[i].y - obstacles[i].height
        ) {
            alert(`Game Over! Ваши очки: ${score}`);
            document.location.reload();
        }

        if (obstacles[i].x + obstacles[i].width < player.x && !obstacles[i].scored) {
            score++;
            updateScore();
            obstacles[i].scored = true;

            if (score % 10 === 0) {
                gameSpeed += 0.5;
            }
        }
    }

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    if (obstacleTimer <= 0) {
        let minGap = 150;
        let maxGap = 300;
        let randomGap = minGap + Math.random() * (maxGap - minGap);
        
        obstacles.push({ 
            x: canvas.width + randomGap, 
            y: groundLevel, 
            width: 30, 
            height: 30, 
            scored: false 
        });

        obstacleTimer = obstacleInterval;
    } else {
        obstacleTimer--;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y - obstacle.height);
        ctx.fill();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

