const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

let player = { 
    x: 50, 
    y: 200, 
    width: 30, 
    height: 30, 
    dy: 0, 
    jumping: false 
};

let obstacles = [];
let gameSpeed = 3;
let gravity = 0.5;
let jumpPower = -10;
let groundLevel = canvas.height - 50;
let obstacleSpawnCooldown = 100; 

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.dy = jumpPower;
        player.jumping = true;
    }
});

function update() {
    player.y += player.dy;
    player.dy += gravity;

    if (player.y + player.height >= groundLevel) {
        player.y = groundLevel - player.height;
        player.dy = 0;
        player.jumping = false;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }

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

    if (obstacleSpawnCooldown <= 0) {
        obstacles.push({ x: canvas.width, y: groundLevel - 30, width: 20, height: 30 });
        obstacleSpawnCooldown = 150;
    } else {
        obstacleSpawnCooldown--;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    ctx.fillRect(0, groundLevel, canvas.width, 50);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "black";
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
