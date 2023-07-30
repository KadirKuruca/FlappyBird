const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

//we will need the game container to make it blurry when we display the end menu
const gameContainer = document.getElementById('game-container');

const flappyImage = new Image();
flappyImage.src = 'assets/bird.png';

//Game Constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird Variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe Variables
let pipeX = 400;
let pipeY = canvas.height - 250;

//Score and Highscore Variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let isScored = false;

//control bird with the space key
document.body.onkeyup = function(e) {
    if (e.code = 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

//restart the game with button click
document.getElementById('restart-button').addEventListener('click', function(){
    resetGame();
});

function increaseScore(){
    //increase score when the flappy bird passes the pipes
    if (birdX > pipeX + PIPE_WIDTH && !isScored) {
        score++;
        scoreDiv.innerHTML = score;
        isScored = true;

        //Play score sound
        playScoreSound();
    }

    //reset isScored value
    if (birdX < pipeX + PIPE_WIDTH) {
        isScored = false;
    }
}

function collisionCheck(){
    //Create bounding Boxes for the bird and the pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //check for collision with topPipeBox
    if (birdBox.x + birdBox.width > topPipeBox.x && 
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    //Check for collision with bottomPipeBox
    if(birdBox.x + birdBox.width > bottomPipeBox.x &&
       birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
       birdBox.y + birdBox.height > bottomPipeBox.y){
        return true;
    }

    //check if the bird hits boundaries
    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;
}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('high-score').innerHTML = highScore;
    document.getElementById('restart-button').focus();
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function resetGame(){
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;

    hideEndMenu();
    loop();
}

function endGame(){
    showEndMenu();
}

function playScoreSound(){
    var audio = new Audio("assets/score_sound.mp3")
    audio.play();
}

function playFailSound(){
    var audio = new Audio("assets/fail_sound.mp3")
    audio.play();
}

function loop(){
    //reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw flappy bird
    ctx.drawImage(flappyImage, birdX, birdY);

    //Draw pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //collision control
    if(collisionCheck()){
        playFailSound();
        endGame();
        return;
    }

    pipeX -= 1.5;

    if(pipeX < -50){
        pipeX = 400;
        var randomValue = Math.random(0.2, 0.7);
        pipeY = randomValue * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
        console.log(pipeY);
    }

    //Apply gravity to bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();