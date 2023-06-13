class Fruit {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, blocksize, blocksize);
    }
  }
  
  class Snake {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.direction = "right";
      this.radius = 12.5; 
      this.radians = 0.75
      this.openRate = 0.13;
      this.rotation = 0 
      this.score = 0;
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
     
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, this.radians, Math.PI * 2 - 0.75);
      ctx.lineTo(this.x, this.y);
      ctx.fill();
      ctx.closePath();
      ctx.restore()
    }
  
    move(direction, steps) {
      const moveAmount = steps * blocksize;
  
      switch (direction) {
        case "left":
          this.x -= moveAmount;
          while (this.x < 0) {
            this.x += cols * blocksize;
          }
          break;
        case "right":
          this.x += moveAmount;
          while (this.x >= cols * blocksize) {
            this.x -= cols * blocksize;
          }
          break;
        case "up":
          this.y -= moveAmount;
          while (this.y < 0) {
            this.y += rows * blocksize;
          }
          break;
        case "down":
          this.y += moveAmount;
          while (this.y >= rows * blocksize) {
            this.y -= rows * blocksize;
          }
          break;
      }
  
      if (this.radians < 0 || this.radians > 0.75) {
        this.openRate = -this.openRate;
      }
      this.radians += this.openRate;
    }
  }
  
  let blocksize = 25;
  let rows = 20;
  let cols = 20;
  let canvas;
  let ctx;
  
  let snake;
  let evilFruit = [];
  let goodFruit;
  
  function placeGoodFruit() {
    const x = Math.floor(Math.random() * cols) * blocksize;
    const y = Math.floor(Math.random() * rows) * blocksize;
    goodFruit = new Fruit(x, y, "green");
  }
  
  function placeEvilFruit() {
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * cols) * blocksize;
        y = Math.floor(Math.random() * rows) * blocksize;
      } while (
        (x === goodFruit.x && y === goodFruit.y) ||
        (x === snake.x && y === snake.y)
      );
      evilFruit.push(new Fruit(x, y, "red"));
    }
  }
  
  let gameStarted = false;
  function update() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
  
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
    // Draw vertical gridlines for the new grid
    for (let i = 0; i <= cols / 5; i++) {
      const x = i * blocksize * 5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  
    // Draw horizontal gridlines for the new grid
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
    goodFruit.draw(ctx);
    snake.draw(ctx);
  }
  
  let currentPlayer = 1;
  let player1Name;
  let player2Name;
  document.addEventListener("DOMContentLoaded", function () {
    player1Name = prompt("Enter the name of Player 1:");
    player2Name = prompt("Enter the name of Player 2:");
  
    const playerTurnSpan = document.getElementById("playersturn");
    playerTurnSpan.textContent = player1Name + "'s";
  
    canvas = document.getElementById("canvas");
    canvas.height = rows * blocksize;
    canvas.width = cols * blocksize;
    ctx = canvas.getContext("2d");
  
    snake = new Snake(
      blocksize * 5 + blocksize / 2,
      blocksize * 5 + blocksize / 2
    );
  
    placeGoodFruit();
    placeEvilFruit();
    setInterval(update, 100); // Update the canvas every 100 milliseconds
  });
  
  let previousDirection = "right";
  let direction = previousDirection;
  
  const directionButtons = document.querySelectorAll(".direction-btns");
  directionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      directionButtons.forEach((btn) => {
        btn.style.backgroundColor = "";
      });
      this.style.backgroundColor = "yellow";
      direction = this.innerText.toLowerCase();
    });
  });
  
  function handleDiceRoll() {
    const diceContainer = document.querySelector(".dice-container");
    const diceElements = diceContainer.querySelectorAll(".dice");
    let diceResult = 0;
  
    diceElements.forEach((diceElement) => {
      const dotCount = diceElement.querySelectorAll(".dice-dot").length;
      diceResult += dotCount;
    });
  
    const stepsInput = document.getElementById("steps");
    stepsInput.value = diceResult;
  
    const previousX = snake.x;
    const previousY = snake.y;
  
    snake.move(previousDirection, diceResult);
  
    const newX = snake.x;
    const newY = snake.y;
  
    previousDirection = direction;
  
    if (direction === "left") {
      snake.rotation = Math.PI;
    } else if (direction === "right") {
      snake.rotation = Math.PI * 0;
    } else if (direction === "up") {
      snake.rotation = Math.PI * 1.5;
    } else if (direction === "down") {
      snake.rotation = Math.PI * 0.5;
    }
  
    update();
  
    let fruitEaten = false;
  
    for (let i = 0; i < evilFruit.length; i++) {
      const fruit = evilFruit[i];
    
      const snakeCenterX = snake.x;
      const snakeCenterY = snake.y;
      const fruitCenterX = fruit.x + blocksize / 2;
      const fruitCenterY = fruit.y + blocksize / 2;
    
      const distanceX = snakeCenterX - fruitCenterX;
      const distanceY = snakeCenterY - fruitCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
      if (distance <= snake.radius + blocksize / 2) {
        // Snake passed over an evil fruit, decrease score and remove the fruit
        if (currentPlayer === 1) {
          snake.score--;
        } else if (currentPlayer === 2) {
          snake.score--;
          fruitEaten = true;
        }
        evilFruit.splice(i, 1); // Remove the collided fruit from the array
        i--; // Decrement the index to correctly process the next fruit
      }
    }
    
    
    if (fruitEaten) {
      evilFruit = evilFruit.filter(
        (fruit) => !(fruit.x === newX && fruit.y === newY)
      );
    }
    
    const scoreElement = document.getElementById("player1score");
    scoreElement.textContent = snake.score.toString();
    
  
    if (currentPlayer === 1) {
      currentPlayer = 2;
      const playerTurnSpan = document.getElementById("playersturn");
      playerTurnSpan.textContent = player2Name + "'s";
    } else {
      currentPlayer = 1;
      const playerTurnSpan = document.getElementById("playersturn");
      playerTurnSpan.textContent = player1Name + "'s";
    }
  }
  
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
  
  const NUMBER_OF_DICE = 2;
  const diceContainer = document.querySelector(".dice-container");
  const btnRollDice = document.querySelector(".btn-roll-dice");
  
  randomizeDice(diceContainer, NUMBER_OF_DICE);
  
  btnRollDice.addEventListener("click", () => {
    randomizeDice(diceContainer, NUMBER_OF_DICE);
    handleDiceRoll();
  });
  