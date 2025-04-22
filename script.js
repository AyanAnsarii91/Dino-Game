let score = 0;
let cross = true;
let gameRunning = true;

const audio = new Audio("Assets/music.mp3");
const audiogo = new Audio("Assets/gameover.mp3");
const scoreCont = document.querySelector(".scoreCont");
const dino = document.querySelector(".dino");
const obstacle = document.querySelector(".obstacle");
const gameOver = document.querySelector(".gameOver");

// Create Play Again button
const playAgainBtn = document.createElement("button");
playAgainBtn.innerHTML = "Play Again";
playAgainBtn.style.cssText =
  "display: none; position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); margin: 20px auto; padding: 10px 20px; font-size: 18px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 5px;";

document.body.appendChild(playAgainBtn);

// Play Again button functionality
playAgainBtn.addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  score = 0;
  gameRunning = true;
  cross = true;

  // Reset positions and animations
  dino.style.left = "50px";
  obstacle.style.left = "1100px";
  obstacle.classList.add("obstacleAni");
  obstacle.style.animationDuration = "2s";

  // Hide game over message and button
  gameOver.innerHTML = "";
  playAgainBtn.style.display = "none"; // Hide the Play Again button again

  // Reset score
  updateScore(0);

  // Restart music
  audio.currentTime = 0;
  audio.play().catch((e) => console.log("Audio play error:", e));
}

// Start game music
setTimeout(() => {
  audio.loop = true;
  audio.play().catch((e) => console.log("Audio play error:", e));
}, 1000);

// Keyboard controls
document.onkeydown = function (e) {
  if (!gameRunning) return;

  console.log("Key code is: ", e.keyCode);
  if (e.keyCode == 38) {
    // Up arrow - jump
    if (dino.classList.contains("animateDino")) return;

    dino.classList.add("animateDino");
    setTimeout(() => {
      dino.classList.remove("animateDino");
    }, 700);
  }
  if (e.keyCode == 39) {
    // Right arrow - move right
    const dinoX = parseInt(
      window.getComputedStyle(dino, null).getPropertyValue("left")
    );
    const newX = Math.min(dinoX + 112, window.innerWidth - 50);
    dino.style.left = newX + "px";
  }
  if (e.keyCode == 37) {
    // Left arrow - move left
    const dinoX = parseInt(
      window.getComputedStyle(dino, null).getPropertyValue("left")
    );
    const newX = Math.max(dinoX - 112, 0);
    dino.style.left = newX + "px";
  }
};

// Touch controls
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  if (!gameRunning) return;

  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  if (!gameRunning) return;

  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  // Detect swipe gestures
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffY) > Math.abs(diffX) && diffY < 0) {
    // Swipe up - jump
    if (!dino.classList.contains("animateDino")) {
      dino.classList.add("animateDino");
      setTimeout(() => {
        dino.classList.remove("animateDino");
      }, 700);
    }
  } else if (Math.abs(diffX) > Math.abs(diffY)) {
    // Swipe left or right
    if (diffX > 0) {
      // Swipe right
      const dinoX = parseInt(
        window.getComputedStyle(dino, null).getPropertyValue("left")
      );
      const newX = Math.min(dinoX + 112, window.innerWidth - 50);
      dino.style.left = newX + "px";
    } else {
      // Swipe left
      const dinoX = parseInt(
        window.getComputedStyle(dino, null).getPropertyValue("left")
      );
      const newX = Math.max(dinoX - 112, 0);
      dino.style.left = newX + "px";
    }
  }
});

// Game loop
const gameInterval = setInterval(() => {
  if (!gameRunning) return;

  const dx = parseInt(
    window.getComputedStyle(dino, null).getPropertyValue("left")
  );
  const dy = parseInt(
    window.getComputedStyle(dino, null).getPropertyValue("top")
  );
  const ox = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("left")
  );
  const oy = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("top")
  );

  const offsetX = Math.abs(dx - ox);
  const offsetY = Math.abs(dy - oy);

  // Collision detection
  if (offsetX < 73 && offsetY < 52) {
    gameOver.innerHTML = "Game Over!";
    obstacle.classList.remove("obstacleAni");
    gameRunning = false;
    audio.pause();
    audiogo.play();
    setTimeout(() => {
      audiogo.pause();
    }, 1000);

    // Show Play Again button
    playAgainBtn.style.display = "block"; // Make the Play Again button visible
  } else if (offsetX < 145 && cross) {
    score += 1;
    updateScore(score);
    cross = false;

    setTimeout(() => {
      cross = true;
      const aniDur = parseFloat(
        window
          .getComputedStyle(obstacle, null)
          .getPropertyValue("animation-duration")
      );
      const newDur = Math.max(aniDur - 0.1, 1);
      obstacle.style.animationDuration = newDur + "s";
    }, 500);
  }
}, 10);

function updateScore(score) {
  if (scoreCont) {
    scoreCont.innerHTML = "Your Score: " + score;
  }
}
