const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Адаптация под размер экрана
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.5;

const groundLevel = canvas.height - 50;

// Персонаж
let player = { 
    x: 50, 
    y: groundLevel - 30, 
    width: 30, 
    height: 30, 
    dy: 0, 
    jumping: false 
};

// Настройки
let obstacles = [];
let gameSpeed = 3;
let gravity = 0.5;
let jumpPower = -10;
let obstacleTimer = 0;
let obstacleInterval = 100; // Увеличенное расстояние между препятствиями

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
    if (player.y + player.height >= groundLevel) {
        player.y = groundLevel - player.height;
        player.dy = 0;
        player.jumping = false;
    }

    // Двигаем препятствия
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        // Проверяем столкновение
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            alert("Game Over!");
            document.location.reload();
        }
    }

    // Удаляем препятствия, которые вышли за экран
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Создаём препятствия с нормальным интервалом
    if (obstacleTimer <= 0) {
        obstacles.push({ x: canvas.width, y: groundLevel - 30, width: 20, height: 30 });
        obstacleTimer = obstacleInterval; // Сброс таймера
    } else {
        obstacleTimer--; // Уменьшаем таймер
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем землю
    ctx.fillStyle = "green";
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    // Рисуем персонажа
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Рисуем препятствия
    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
