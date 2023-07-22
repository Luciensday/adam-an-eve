// Fruit and Snake constructor 
class Fruit {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = blocksize / 4;
    this.roundedX = Math.round(this.x / blocksize) * blocksize + blocksize / 2;
    this.roundedY = Math.round(this.y / blocksize) * blocksize + blocksize / 2
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(this.roundedX, this.roundedY, this.radius, 0, Math.PI * 2 );
    ctx.lineTo(this.roundedX, this.roundedY);
    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }
}


class Snake2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "right";
    this.radius = blocksize / 2; 
    this.radians = 0.75
    this.openRate = 0.13;
    this.rotation = 0 
   
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
  }
  
  // Set-up mouth opening oscilating  
  updateMouth() {
    if (this.radians < 0 || this.radians > .75) {
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.translate(-this.x, -this.y)
    this.updateMouth();
   
    ctx.fillStyle = "#E84DB4";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, this.radians, Math.PI * 2 -0.25 );
    ctx.lineTo(this.x, this.y);
    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }

  move(direction, steps) {
    const moveAmount = steps * blocksize;

    switch (direction) {
      case "left":
        if (this.x - moveAmount >= 0) {
          this.x -= moveAmount;
        } else {
          this.x = 0 + blocksize/2; //left boundary setting 
        }
        break;
      case "right":
        if (this.x + moveAmount <= canvas.width) {
          this.x += moveAmount;
        } else {
          this.x = canvas.width - blocksize/2 ; // left boundary setting
        }
        break;
      case "up":
        if (this.y - moveAmount >= 0) {
          this.y -= moveAmount;
        } else {
          this.y = 0 + blocksize/2; // top boundary setting
        }
        break;
      case "down":
        if (this.y + moveAmount <= canvas.height) {
          this.y += moveAmount;
        } else {
          this.y = canvas.height - blocksize/2 ; // bottom boundary setting
        }
        break;
    }
  
  }
}


class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "right";
    this.radius = blocksize / 2; 
    this.radians = 0.75
    this.openRate = 0.13;
    this.rotation = 0 
   
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
  }

  updateMouth() {
    if (this.radians < 0 || this.radians > .75) {
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.translate(-this.x, -this.y)
    this.updateMouth();
   
    ctx.fillStyle = "#5FA0F5";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, this.radians, Math.PI * 2 -0.25 );
    ctx.lineTo(this.x, this.y);
    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }

  move(direction, steps) {
    const moveAmount = steps * blocksize;

    switch (direction) {
      case "left":
        if (this.x - moveAmount >= 0) {
          this.x -= moveAmount;
        } else {
          this.x = 0 + blocksize/2; 
        }
        break;
      case "right":
        if (this.x + moveAmount <= canvas.width) {
          this.x += moveAmount;
        } else {
          this.x = canvas.width - blocksize/2 ; 
        }
        break;
      case "up":
        if (this.y - moveAmount >= 0) {
          this.y -= moveAmount;
        } else {
          this.y = 0 + blocksize/2; 
        }
        break;
      case "down":
        if (this.y + moveAmount <= canvas.height) {
          this.y += moveAmount;
        } else {
          this.y = canvas.height - blocksize/2 ; 
        }
        break;
    }
  
  }
}

let blocksize = 20;
let rows = 10;
let cols = 10;
let canvas;
let ctx;

let snake;
let snake2; 
let evilFruit = []; 

function placeEvilFruit() {
  for (let i = 0; i < 15; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * cols) * blocksize;
      y = Math.floor(Math.random() * rows) * blocksize;
      // Adjust fruit position if snake is on the opposite side of the grid
      if (snake.x >= cols * blocksize && x < cols * blocksize / 2) {
        x += cols * blocksize;
      }
      if (snake.y >= rows * blocksize && y < rows * blocksize / 2) {
        y += rows * blocksize;
      }

    } while (
    
    (x === snake.x && y === snake.y) || (x === snake2.x && y === snake2.y)
    );
    evilFruit.push(new Fruit(x, y, "#F6F31A"));
  }
}

function update() {
  ctx.fillStyle = "#380700";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;

  // Draw vertical gridlines
  for (let i = 0; i <= cols; i++) {
    const x = i * blocksize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal gridlines
  for (let i = 0; i <= rows; i++) {
    const y = i * blocksize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  // Draw vertical gridlines for the thicker grid
  for (let i = 0; i <= cols / 5; i++) {
    const x = i * blocksize * 5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal gridlines for the thicker grid
  for (let i = 0; i <= rows / 5; i++) {
    const y = i * blocksize * 5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }


  for (const fruit of evilFruit) {
    fruit.draw(ctx);
 
  }
  snake.draw(ctx);
  snake2.draw(ctx);


  // player's name display in scoring board
  const player1NameSpan = document.getElementById("player1name");
  const player2NameSpan = document.getElementById("player2name");
  player1NameSpan.textContent = player1Name;
  player2NameSpan.textContent = player2Name;
}

// DOM Content loaded 
let currentPlayer = 1;
let player1Name;
let player2Name;


document.addEventListener("DOMContentLoaded", function () {
 
  const overlay = document.getElementById("overlay");
  const dialogBox = document.getElementById("dialog-box");
  const player1Input = document.getElementById("player1-input");
  const player2Input = document.getElementById("player2-input");
  const playButton = document.getElementById("play-button");

  playButton.addEventListener("click", function () {
    player1Name = player1Input.value;
    player2Name = player2Input.value;

    if (player1Name && player2Name) {
        // Redirect to game page
        console.log("Player 1 Name:", player1Name);
        console.log("Player 2 Name:", player2Name);
        overlay.style.display = "none"; 

        const playerTurnSpan = document.getElementById("playersturn");
        playerTurnSpan.textContent = player1Name + "'s"; 

    } else {
        alert("Please enter both player names.");
    }
});



  // player's name display in player's turn board
  const playerTurnSpan = document.getElementById("playersturn");
  playerTurnSpan.textContent = player1Name + "'s";

  canvas = document.getElementById("canvas");
  canvas.height = rows * blocksize;
  canvas.width = cols * blocksize;
  ctx = canvas.getContext("2d");
  

  snake = new Snake(
    blocksize * 0 + blocksize / 2,
    blocksize * 0 + blocksize / 2
  );

  snake2 = new Snake2(
    blocksize * 0 + blocksize / 2, 
    blocksize * 1 + blocksize / 2
  );

  
  placeEvilFruit();
  setInterval(update, 100); 

  
});


// default direction is right
let direction = "right";

// Direction Button setting to have color shown when cliick and disapear when click other direction 
const directionButtons = document.querySelectorAll(".direction-btns");
directionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    directionButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
    direction = this.innerText.toLowerCase();

     // Rotate the snake based on the clicked direction
     if (currentPlayer === 1) {
      snake.rotation = getRotationAngle(direction);
    } else if (currentPlayer === 2) {
      snake2.rotation = getRotationAngle(direction);
    }

  });
});


function getRotationAngle(direction) {
  switch (direction) {
    case "up":
      return -Math.PI / 2;
    case "down":
      return Math.PI / 2;
    case "left":
      return Math.PI;
    case "right":
      return 0;
    default:
      return 0;
  }
}

function handleDiceRoll() {
  const diceContainer = document.querySelector(".dice-container");
  const diceElements = diceContainer.querySelectorAll(".dice");
  let diceResult = 0;

  diceElements.forEach((diceElement) => {
    const dotCount = diceElement.querySelectorAll(".dice-dot").length;
    diceResult += dotCount;
  });

  const stepsInput = document.getElementById("steps");
  stepsInput.textContent = diceResult.toString();

  const previousX = currentPlayer === 1 ? snake.x : snake2.x;
  const previousY = currentPlayer === 1 ? snake.y : snake2.y;


  if (currentPlayer === 1) {
    snake.move(direction, diceResult);
  } else if (currentPlayer === 2) {
    snake2.move(direction, diceResult);
  }

  const newX = currentPlayer === 1 ? snake.x : snake2.x;
  const newY = currentPlayer === 1 ? snake.y : snake2.y;


  
  // Collision detection for Snake 1
  if (currentPlayer === 1) {
    const snake1CenterX = newX;
    const snake1CenterY = newY;

    for (const fruit of evilFruit) {
      const fruit1CenterX = fruit.roundedX;
      const fruit1CenterY = fruit.roundedY;

      if (
        snake1CenterY === fruit1CenterY &&
        (
          (previousX > fruit1CenterX && newX <= fruit1CenterX) ||
          (previousX < fruit1CenterX && newX >= fruit1CenterX)
        ) || 
        snake1CenterX === fruit1CenterX &&
        (
          (previousY > fruit1CenterY && newY <= fruit1CenterY) ||
          (previousY < fruit1CenterY && newY >= fruit1CenterY)
        )
      ) 
        
      {
        snake.scorePlayer1++;
        evilFruit.splice(evilFruit.indexOf(fruit), 1);
      }
    }
  }

  // Collision detection for Snake 2
  if (currentPlayer === 2) {
    const snake2CenterX = newX;
    const snake2CenterY = newY;

    for (const fruit of evilFruit) {
      const fruit2CenterX = fruit.roundedX;
      const fruit2CenterY = fruit.roundedY;

      if (
        (snake2CenterY === fruit2CenterY &&
        (
          (previousX > fruit2CenterX && newX <= fruit2CenterX) ||
          (previousX < fruit2CenterX && newX >= fruit2CenterX)
        ) )|| 
        (snake2CenterX === fruit2CenterX &&
        (
          (previousY > fruit2CenterY && newY <= fruit2CenterY) ||
          (previousY < fruit2CenterY && newY >= fruit2CenterY)
        )
        )
      ) {
        snake.scorePlayer2++;
        evilFruit.splice(evilFruit.indexOf(fruit), 1);
      }
    }
  }

 
  update();

// Variables to store references to the overlay and dialog box elements
const overlay = document.getElementById("end-dialog-overlay");
const dialogBox = document.getElementById("end-dialog-box");
const winnerScore = document.getElementById("winner-score");
const playAgainButton = document.getElementById("play-again-button");

// Function to show the dialog box overlay
function showDialogueBox(winner, highestScore) {
  // Set the winner and score text
  winnerScore.textContent = `${winner} wins with a score of ${highestScore}.`;

  // Show the overlay
  overlay.style.display = "flex";
}

// Function to hide the dialog box overlay
function hideDialogueBox() {
  // Hide the overlay
  overlay.style.display = "none";
}

// Function to check if the game has ended
function checkGameEnd() {
const totalFruits = evilFruit.length;

  // Check if all fruits have disappeared
  if (totalFruits === 0) {
    let winner = "";
    let highestScore = -1;

    // Determine the winner based on the highest score
    if (snake.scorePlayer1 > highestScore) {
      winner = player1Name;
      highestScore = snake.scorePlayer1;
    }
    if (snake2.scorePlayer2 > highestScore) {
      winner = player2Name;
      highestScore = snake2.scorePlayer2;
    }

    // Show the dialog box overlay
    showDialogueBox(winner, highestScore);
  }
}


// Event listener for the play again button
playAgainButton.addEventListener("click", () => {
  // Hide the dialog box overlay
  hideDialogueBox();

  // Reset the game or perform any necessary actions
});

checkGameEnd();


  
  
  const scoreElementPlayer1 = document.getElementById("player1score");
  const scoreElementPlayer2 = document.getElementById("player2score");
  if (currentPlayer === 1) {
    scoreElementPlayer1.textContent = snake.scorePlayer1.toString();
  } else if (currentPlayer === 2) {
    scoreElementPlayer2.textContent = snake.scorePlayer2.toString();
  }
  

  if (currentPlayer === 1) {
    currentPlayer = 2;
    const playerTurnSpan = document.getElementById("playersturn");
    const playerTurnContainer = document.getElementById("playersturn-container")
    playerTurnSpan.textContent = player2Name + "'s";
    playerTurnContainer.style.backgroundColor = "#E84DB4"; 


  } else {
    currentPlayer = 1;
    const playerTurnSpan = document.getElementById("playersturn");
    const playerTurnContainer = document.getElementById("playersturn-container")
    playerTurnSpan.textContent = player1Name + "'s";
    playerTurnContainer.style.backgroundColor = "#5FA0F5"; 
  }
  directionButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
}

// dice dot placement by number 1-6
function createDice(number) {
  const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[20, 20], [80, 80]],
    3: [[20, 20], [50, 50], [80, 80]],
    4: [[20, 20], [20, 80], [80, 20], [80, 80]],
    5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
    6: [[20, 20], [20, 80], [50, 20], [50, 80], [80, 20], [80, 80]],
  };

  const dice = document.createElement("div");
  dice.classList.add("dice");

  for (const dotPosition of dotPositionMatrix[number]) {
    const dot = document.createElement("div");
    dot.classList.add("dice-dot");
    dot.style.setProperty("--top", dotPosition[0] + "%");
    dot.style.setProperty("--left", dotPosition[1] + "%");
    dice.appendChild(dot);
  }

  return dice;
}

function randomizeDice(diceContainer, numberOfDice) {
  diceContainer.innerHTML = "";

  for (let i = 0; i < numberOfDice; i++) {
    const random = Math.floor(Math.random() * 6 + 1);
    const dice = createDice(random);
    diceContainer.appendChild(dice);
  }
}
// dice number is 1, so one dice. we can change to two for two dices 
const NUMBER_OF_DICE = 1;
const diceContainer = document.querySelector(".dice-container");
const btnRollDice = document.querySelector(".btn-roll-dice");

randomizeDice(diceContainer, NUMBER_OF_DICE);

btnRollDice.addEventListener("click", () => {
  randomizeDice(diceContainer, NUMBER_OF_DICE);
  handleDiceRoll();
  
});
