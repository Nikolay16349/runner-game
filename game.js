const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.5;

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
let gameSpeed = 3;
let gravity = 0.5;
let jumpPower = -10;
let obstacleTimer = 0;
let obstacleInterval = 100;
let score = 0;

// Обновляем счетчик очков
function updateScore() {
    document.getElementById("score").textContent = Очки: ${score};
}

// Обработчик для ПК (Пробел)
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

// Обработчик для телефона (Кнопка)
document.getElementById("jumpButton").addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

function update() {
    // Применяем гравитацию
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

        // Проверяем столкновение (корректный расчет)
        let dx = player.x - obstacles[i].x;
        let dy = player.y - (obstacles[i].y - 15);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + 15) {
            alert(`Game Over! Ваши очки: ${score}`);
            document.location.reload();
        }

        // Если игрок прошел препятствие, прибавляем очки (правильная проверка)
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

    // Удаляем препятствия, которые вышли за экран
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Создаём препятствия (правильная генерация)
    if (obstacleTimer <= 0) {
        obstacles.push({ 
            x: canvas.width, 
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

    // Черная "земля"
    ctx.fillStyle = "black";
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    // Персонаж (синий круг)
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Препятствия (черные треугольники)
    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y - obstacle.height);
        ctx.fill();
    }
}

// Ограничение FPS для плавности
let lastTime = 0;
const fps = 60;
const frameDuration = 1000 / fps;

function gameLoop(timestamp) {
    if (timestamp - lastTime >= frameDuration) {
        update();
        draw();
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
