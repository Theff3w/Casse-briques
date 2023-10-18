// Création de l'objet "ball" et "game"; déclarations des variables dans le scope global :

let ball = {
  positionX: 200,
  positionY: 100,
  couleur: "red",
  rayon: 8,
  direction: { x: 0, y: -1 },
};

let game = {
  speed: 3,
  largeur: 400,
  hauteur: 400,
  couleur: "lightgray",
  // Rajout pour la partie 3 : Game Over
  gameOver: false,
  // Rajout pour la partie 4 : Rejouabilité du jeu
  start: false,
  pause: false,
  // Ecran de Victoire !!
  victory : false
};
// P5 : Ajout des briques...
let brickPrototype = {
  largeur: 28,
  hauteur: 15,
  couleur: "#0095DD",
  visible: true,
  HP: 1
};
function createBrick(posX, posY) {
  let brick = Object.create(brickPrototype);
  brick.positionX = posX;
  brick.positionY = posY;
  return brick;
} 
let brick1 = createBrick(10, 10);
let brick2 = createBrick(48, 10);
let brick3 = createBrick(86, 10);
let brick4 = createBrick(124, 10);
let brick5 = createBrick(162, 10);
let brick6 = createBrick(200, 10);
let brick7 = createBrick(238, 10);
let brick8 = createBrick(276, 10);
let brick9 = createBrick(314, 10);
let brick10 = createBrick(352, 10);

// partie 2 : rajout de l'objet paddle :
let paddle = {
  positionX: 150,
  positionY: 380,
  vitesse: 5,
  couleur: "blue",
  largeur: 80,
  hauteur: 10,
  direction: 0,
};

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// Les fonctions utilisées par notre partie :
function drawBall() {
  if (game.victory) {
    return;
  }

  context.beginPath();
  context.arc(
    ball.positionX,
    ball.positionY,
    ball.rayon,
    0,
    Math.PI * 2
  );
  context.fillStyle = ball.couleur;
  context.fill();
  context.closePath();
}

function moveBall() {
  const length = Math.sqrt(ball.direction.x * ball.direction.x + ball.direction.y * ball.direction.y);
  ball.direction.x /= length;
  ball.direction.y /= length;

  ball.positionX += ball.direction.x * game.speed * (Math.abs(ball.direction.x) + Math.abs(ball.direction.y)); 
  ball.positionY += ball.direction.y * game.speed * (Math.abs(ball.direction.x) + Math.abs(ball.direction.y)); 
}

// Rajout du paddle :
function drawPaddle() {
  context.beginPath();
  context.rect(
    paddle.positionX,
    paddle.positionY,
    paddle.largeur,
    paddle.hauteur
  );
  context.fillStyle = paddle.couleur;
  context.fill();
  context.closePath();
}

function movePaddle() {
  paddle.positionX += paddle.direction * paddle.vitesse;

  if (paddle.positionX < 0) {
    paddle.positionX = 0;
  } else if (paddle.positionX + paddle.largeur > game.largeur) {
    paddle.positionX = game.largeur - paddle.largeur;
  }
}

// Rajout des briques :
function drawBricks() {
  [brick1, brick2, brick3, brick4, brick5, brick6, brick7, brick8, brick9, brick10].forEach(brick => {
    if (brick.visible) {
      context.beginPath();
      context.rect(
        brick.positionX,
        brick.positionY,
        brick.largeur,
        brick.hauteur
      );
      context.fillStyle = brick.couleur;
      context.fill();
      context.closePath();
    }
  });
}

function displayGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = game.couleur;
  context.fillRect(0, 0, game.largeur, game.hauteur);
  //Partie 5 : Ajout des briques !!
  drawBricks();

  drawBall();

  drawPaddle();

  // Besoin d'une condition ici pour le game over :
  if (game.gameOver) {
    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("Game Over", game.largeur / 2, game.hauteur / 2);
    return;
  }
  // Condition pour la victoire !!
  if (game.victory) {
    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "green";
    context.textAlign = "center";
    context.fillText("Victoire !", game.largeur / 2, game.hauteur / 2);
    ball.direction = { x: 0, y: 0 };
    return;
  }
}

// Fonction principale du jeu qui initialise toutes nos fonctions :
function playGame() {
  detectCollisions();

  moveBall();

  movePaddle();

  displayGame();

  if (game.gameOver) {
    initPositions();
    game.start = false;
    return;
  }

  if (game.start && !game.pause) {
    requestAnimationFrame(playGame);
  }
}

function initGame() {
  document.addEventListener("keydown", keyboardEvent);
  document.addEventListener("keyup", keyboardUpEvent);
}

// Functions rajoutées pour les déplacements du paddle :
function keyboardEvent(event) {
  if (event.keyCode === 37) {
    paddle.direction = -1;
  } else if (event.keyCode === 39) {
    paddle.direction = 1;
  } else if (event.keyCode === 32) {
    if (game.gameOver) {
      game.gameOver = false;
      initPositions();
      game.start = true;
      playGame();
    } else {
      game.pause = !game.pause;
      if (game.start && !game.pause) {
        playGame();
      }
    }
  }
}

function keyboardUpEvent(event) {
  if (event.keyCode === 37 && paddle.direction === -1) {
    paddle.direction = 0;
  } else if (event.keyCode === 39 && paddle.direction === 1) {
    paddle.direction = 0;
  }
}

// Function rajoutée pour la détection des collisions et la gestion du game over :
function detectCollisions() {
  if (ball.positionY - ball.rayon <= 0) {
    ball.direction.y = 1;
  } else if (ball.positionY + ball.rayon >= game.hauteur) {
    game.gameOver = true;
  }

  if (
    ball.positionY + ball.rayon >= paddle.positionY &&
    ball.positionY - ball.rayon <= paddle.positionY + paddle.hauteur &&
    ball.positionX + ball.rayon >= paddle.positionX &&
    ball.positionX - ball.rayon <= paddle.positionX + paddle.largeur
  ) {
    let paddleCenterX = paddle.positionX + paddle.largeur / 2;
    let ballDistanceFromPaddleCenterX = ball.positionX - paddleCenterX;
    ball.direction.x = ballDistanceFromPaddleCenterX * 0.1;
    ball.direction.y = -1;
  }
  [brick1, brick2, brick3, brick4, brick5, brick6, brick7, brick8, brick9, brick10].forEach(brick => {
    if (brick.visible &&
      ball.positionY + ball.rayon >= brick.positionY &&
      ball.positionY - ball.rayon <= brick.positionY + brick.hauteur &&
      ball.positionX + ball.rayon >= brick.positionX &&
      ball.positionX - ball.rayon <= brick.positionX + brick.largeur
    ) {
      brick.visible = false;
      ball.direction.x *= -1;
      ball.direction.y *= -1;
    }
  });

  if (ball.positionX - ball.rayon <= 0 || ball.positionX + ball.rayon >= game.largeur) {
    ball.direction.x *= -1;
  }
  const allBricksInvisible = [brick1, brick2, brick3, brick4, brick5, brick6, brick7, brick8, brick9, brick10].every(brick => !brick.visible);
  if (allBricksInvisible) {
    game.victory = true;
    ball.direction = { x: 0, y: 0 };
  }
}

// Fonction pour réinitialiser les positions de la balle et du paddle :
function initPositions() {
  ball.positionX = game.largeur / 2;
  ball.positionY = game.hauteur / 2;
  paddle.positionX = (game.largeur - paddle.largeur) / 2;
  ball.direction = { x: 1, y: -1 };  
  game.victory = false;
  // Réinitialisation des briques :
  [brick1, brick2, brick3, brick4, brick5, brick6, brick7, brick8, brick9, brick10].forEach((brick, index) => {
    brick.positionX = 10 + index * 38;
    brick.positionY = 10;
    brick.visible = true;
  });
}

// Lancer le jeu
document.addEventListener("DOMContentLoaded", function () {
  initPositions();
  initGame();
  game.start = true;
  playGame();
});
