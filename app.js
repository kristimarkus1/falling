let fallingObjects = [];
let basket;
let score = 0;
let missedCount = 0;
let gameStarted = false;
let isGameOver = false;
let fruitFallInterval;
let maxFruits = 5; // Limit how many fruits can fall at once
let winScore = 50; // Win score

const startButton = document.getElementById("start-btn");
const startMessage = document.getElementById("start-message");
const restartButton = document.getElementById("restart-btn");
const scoreElement = document.getElementById("score");
const gameContainer = document.getElementById("game-container");
const gameOverMessage = document.getElementById("game-over-message");
const gameWinMessage = document.getElementById("game-win-message");

// Object images
const fruitImages = [
    "apple.png",
    "banana.png",
    "orange.png",
    "pear.png",
    "watermelon.png",
];

function startGame() {
    score = 0;
    missedCount = 0;
    scoreElement.textContent = `Score: ${score}`;
    fallingObjects = [];
    gameStarted = true;
    isGameOver = false; // Reset game over flag
    restartButton.style.display = "none"; // Hide restart button at start
    startButton.style.display = "none";
    startMessage.style.display = "none";
    gameOverMessage.style.display = "none"; // Hide the game over message
    gameWinMessage.style.display = "none"; // Hide the win message
    gameLoop();

    clearInterval(fruitFallInterval);
    // Create 2 fruits every 3 seconds
    fruitFallInterval = setInterval(() => {
        if (fallingObjects.length < maxFruits) {
            createFallingObject(); // Create 1st fruit
            createFallingObject(); // Create 2nd fruit
        }
    }, 3000); // Every 3 seconds
}

function restartGame() {
    missedCount = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    fallingObjects = [];
    gameStarted = false;
    isGameOver = false; // Reset game over flag
    clearInterval(fruitFallInterval);
    // Clear all existing falling objects
    document.querySelectorAll(".falling-object").forEach(object => object.remove());
    gameOverMessage.style.display = "none";
    gameWinMessage.style.display = "none";
    startGame();
}

function createFallingObject() {
    if (isGameOver) return;

    const objectType = fruitImages[Math.floor(Math.random() * fruitImages.length)];
    const object = {
        element: document.createElement("div"),
        x: Math.random() * (gameContainer.clientWidth - 50), // Random X position
        y: -50, // Start just above the screen
        image: objectType,
    };
    object.element.classList.add("falling-object");
    object.element.style.backgroundImage = `url('${object.image}')`;
    object.element.style.left = object.x + "px";
    gameContainer.appendChild(object.element);
    fallingObjects.push(object);
}

function moveFallingObjects() {
    fallingObjects.forEach((object, index) => {
        object.y += 2; // Adjust fall speed
        object.element.style.top = object.y + "px";
        if (object.y > gameContainer.clientHeight) {
            missedCount++;
            object.element.remove();
            fallingObjects.splice(index, 1);
            if (missedCount >= 3) {
                gameOver("You missed too many fruits.");
            }
        }
        checkCollision(object, index);
    });
}

function checkCollision(object, index) {
    const basket = document.getElementById("basket");
    const basketLeft = basket.offsetLeft;
    const basketRight = basket.offsetLeft + basket.offsetWidth;
    const basketTop = basket.offsetTop;
    const basketBottom = basket.offsetTop + basket.offsetHeight;

    const objectLeft = object.element.offsetLeft;
    const objectRight = objectLeft + object.element.offsetWidth;
    const objectTop = object.element.offsetTop;
    const objectBottom = objectTop + object.element.offsetHeight;

    if (
        objectRight > basketLeft &&
        objectLeft < basketRight &&
        objectBottom > basketTop &&
        objectTop < basketBottom
    ) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        object.element.remove();
        fallingObjects.splice(index, 1); // Remove the object from the array
        createFallingObject(); // Create a new falling object
    }

    // Check if the player has won
    if (score >= winScore && !isGameOver) {
        gameWin("You Win! You reached 50 fruits!");
    }
}

function gameOver(message) {
    gameStarted = false;
    
    // Hide the game win message if it's visible
    const gameWinMessage = document.getElementById("game-win-message");
    gameWinMessage.style.display = "none";
    
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.innerHTML = `
        <p>You lost! Missed too many fruits.</p>
        <button onclick="restartGame()">Play Again</button>
    `;
    gameOverMessage.style.display = "block"; // Show the game over message
}

function gameWin() {
    gameStarted = false;
    // Hide the game over message if it's visible
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.style.display = "none";

    // Show the win message
    const gameWinMessage = document.getElementById("game-win-message");
    gameWinMessage.innerHTML = `
        <p>You Win! You reached 50 fruits!</p>
        <button onclick="restartGame()">Play Again</button>
    `;
    gameWinMessage.style.display = "block"; // Show the win message
}


function gameLoop() {
    if (!gameStarted) return;

    moveFallingObjects();

    requestAnimationFrame(gameLoop);
}

function moveBasket(e) {
    const basket = document.getElementById("basket");
    const basketWidth = basket.offsetWidth;
    const gameWidth = gameContainer.offsetWidth;

    if (e.key === "ArrowLeft" && basket.offsetLeft > 0) {
        basket.style.left = basket.offsetLeft - 20 + "px";
    } else if (e.key === "ArrowRight" && basket.offsetLeft < gameWidth - basketWidth) {
        basket.style.left = basket.offsetLeft + 20 + "px";
    }
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
document.addEventListener("keydown", moveBasket);
