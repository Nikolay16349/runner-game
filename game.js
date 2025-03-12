const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Растягиваем холст на весь экран
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const groundLevel = canvas.height - 50;

// Персонаж
let player = { 
    x: 50, 
    y: groundLevel - 15, 
    radius: 15, 
    dy: 0, 
    jumping: false 
};

// Настройки
let obstacles = [];
let gameSpeed = 4;
let gravity = 0.5;
let jumpPower = -12;
let obstacleTimer = 0;
let obstacleInterval = 100;
let score = 0;

// Обновление счёта
function updateScore() {
    document.getElementById("score").textContent = Очки: ${score};
}

// Обработчик прыжка (ПК)
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

// Обработчик прыжка (Телефон)
document.getElementById("jumpButton").addEventListener("click", () => {
    if (!player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

function update() {
    player.y += player.dy;
    player.dy += gravity;

    // Ограничение, чтобы не проваливался под землю
    if (player.y + player.radius >= groundLevel) {
        player.y = groundLevel - player.radius;
        player.dy = 0;
        player.jumping = false;
    }

    // Двигаем препятствия
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        // Проверка столкновения
        if (
            player.x + player.radius > obstacles[i].x &&
            player.x - player.radius < obstacles[i].x + obstacles[i].width &&
            player.y + player.radius > obstacles[i].y - obstacles[i].height
        ) {
            alert(`Game Over! Ваши очки: ${score}`);
            document.location.reload();
        }

        // Прибавляем очки
        if (obstacles[i].x + obstacles[i].width < player.x && !obstacles[i].scored) {
            score++;
            updateScore();
            obstacles[i].scored = true;

            // Каждые 10 очков игра ускоряется
            if (score % 10 === 0) {
                gameSpeed += 0.5;
            }
        }
    }

    // Удаляем старые препятствия
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Генерация препятствий
    if (obstacleTimer <= 0) {
        let minGap = 250; 
        let maxGap = 450; 
        let randomGap = minGap + Math.random() * (maxGap - minGap);
        
        obstacles.push({ 
            x: canvas.width + randomGap, 
            y: groundLevel, 
            width: 40, 
            height: 40, 
            scored: false 
        });

        obstacleTimer = obstacleInterval;
    } else {
        obstacleTimer--;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Земля (чёрная полоса)
    ctx.fillStyle = "black";
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    // Персонаж (синий круг)
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Препятствия (чёрные треугольники)
    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y - obstacle.height);
        ctx.fill();
    }
}

// Запуск анимации
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
