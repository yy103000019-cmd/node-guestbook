// snake2.js — 修正後範例
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttonStart = document.getElementById("buttonStart");
const BLOCK_SIZE = 20; // 放大畫素，20點為一格
const MAP_SIZE = canvas.width / BLOCK_SIZE; // 假設 canvas.width 可整除 BLOCK_SIZE

let timer = null;

let score1 = 0;
let score2 = 0;

const playerKey1 = [38, 40, 37, 39]; // ↑ ↓ ← →
const playerKey2 = [87, 83, 65, 68]; // W S A D

class Snake {
    constructor(startX, startY, snakeColor, playerKey) {
        this.body = [{ x: startX, y: startY }];
        this.size = 5;
        this.score = 0;
        this.color = snakeColor;
        this.direction = { x: 0, y: -1 }; // 初始向上
        this.playerKey = playerKey;
    }

    eatApple(apple) {
        for (let i = 0; i < apple.apples.length; i++) {
            if (this.body[0].x === apple.apples[i].x && this.body[0].y === apple.apples[i].y) {
                apple.apples.splice(i, 1);
                this.size++;
                this.score++;
                apple.putApple(); // 補一顆新的
                break;
            }
        }
    }

    drawSnake(apple) {
        this.moveSnake();
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x * BLOCK_SIZE, this.body[i].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        this.eatApple(apple);
    }

    moveSnake() {
        const newBlock = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
        this.body.unshift(newBlock);
        while (this.body.length > this.size) {
            this.body.pop();
        }
        this.checkDeath();
    }

    checkDeath() {
        // 出界
        if (this.body[0].x < 0 || this.body[0].x >= MAP_SIZE || this.body[0].y < 0 || this.body[0].y >= MAP_SIZE) {
            this.score = Math.max(0, this.score - 10);
            gameOver();
        }
        // 撞到自己
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.score = Math.max(0, this.score - 10);
                gameOver();
            }
        }
    }

    move(event) {
        // up
        if (event.keyCode === this.playerKey[0] && this.direction.y !== 1) {
            this.direction = { x: 0, y: -1 };
        }
        // down
        else if (event.keyCode === this.playerKey[1] && this.direction.y !== -1) {
            this.direction = { x: 0, y: 1 };
        }
        // left
        else if (event.keyCode === this.playerKey[2] && this.direction.x !== 1) {
            this.direction = { x: -1, y: 0 };
        }
        // right
        else if (event.keyCode === this.playerKey[3] && this.direction.x !== -1) {
            this.direction = { x: 1, y: 0 };
        }
    }
}

class Apple {
    constructor() {
        this.apples = [];
        // 預設放 3 顆
        for (let i = 0; i < 3; i++) this.putApple();
    }

    putApple() {
        // 隨機放一顆，不檢查與蛇碰撞（可擴充）
        const x = Math.floor(Math.random() * MAP_SIZE);
        const y = Math.floor(Math.random() * MAP_SIZE);
        this.apples.push({ x, y });
    }

    drawApple() {
        ctx.fillStyle = "red";
        for (let i = 0; i < this.apples.length; i++) {
            ctx.fillRect(this.apples[i].x * BLOCK_SIZE, this.apples[i].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

// 全局遊戲物件
let apple = new Apple();
let snake1 = new Snake(5, 10, "green", playerKey1);
let snake2 = new Snake(15, 10, "blue", playerKey2);

document.addEventListener("keydown", (e) => {
    snake1.move(e);
    snake2.move(e);
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScores() {
    // 以 canvas 上方或外部更新分數，這裡簡單在 canvas 左上顯示
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("P1: " + snake1.score, 5, 14);
    ctx.fillText("P2: " + snake2.score, 80, 14);
}

function draw() {
    clearCanvas();
    apple.drawApple();
    snake1.drawSnake(apple);
    snake2.drawSnake(apple);
    drawScores();
}

function startGame() {
    // 重設
    apple = new Apple();
    snake1 = new Snake(5, 10, "green", playerKey1);
    snake2 = new Snake(15, 10, "blue", playerKey2);
    if (timer) clearInterval(timer);
    timer = setInterval(draw, 120); // 遊戲速度
    buttonStart.disabled = true;
}

function gameOver() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    buttonStart.disabled = false;
    alert("Game Over\nP1 score: " + snake1.score + "\nP2 score: " + snake2.score);
}

// 綁定開始按鈕
buttonStart.addEventListener("click", startGame);

// 若想自動啟動，可解除下一行註解
// startGame();