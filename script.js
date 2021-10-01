// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, collideRectRect, colorMode, createCanvas, fill, frameRate, keyCode, height,
 *    loop, noFill, noLoop, noStroke, random, rect, round, stroke, sqrt, text, width
 *    UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
 */

let gameIsOver, backgroundColor, playerSnake, currentApple, score,fRate, timer;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  fRate=10;
  timer=50;
  gameIsOver = false;
  //Creating the snake and apple objects
  playerSnake = new Snake();
  currentApple = new Apple();
  
  //Initialize score to zero
  score = 0;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
  frameRate(fRate);
  if(timer!==0){
    timer--;
  }
  
  if(timer===0){
    currentApple=new Apple();
    timer=50;
  }
}

function displayScore() {
  fill(0);
  text(`Score: ${score}`, 20, 20);
  
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 12;
    this.tail=[new TailSegment(this.x, this.y)];
  }

  moveSelf() {
    if(!gameIsOver){
      if (this.direction === "N") {
        this.y -= this.speed;
      } else if (this.direction === "S") {
        this.y += this.speed;
      } else if (this.direction === "E") {
        this.x += this.speed;
      } else if (this.direction === "W") {
        this.x -= this.speed;
      } else {
        console.log("Error: invalid direction");
      }

      //Add a new segment to the beginning of the arr
      this.tail.unshift(new TailSegment(this.x, this. y));

      //Remove a segment from the end
      this.tail.pop();
    }
    
  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size);
    noStroke();
    for(let i=0; i<this.tail.length; i++){
      this.tail[i].showSelf();
    }
  }

  //Check if there was a collision between the snake and the apple
  checkApples() {
    let collision=collideRectRect(this.x, this.y, this.size, this.size, currentApple.x, currentApple.y, currentApple.size, currentApple.size);
    if(collision){
      score+=currentApple.value;
      fRate+=2;
      currentApple = new Apple();
      timer = 50;
      this.extendTail();
    }
  }

  checkCollisions() {
    //check if head collides with tail segments
      for(let i = 1; i<this.tail.length; i++){
        let collision = collideRectRect(this.x, this.y, this.size, this.size,
                                       this.tail[i].x, this.tail[i].y, this.tail[i].size, this.tail[i].size);
        if(collision){
          gameOver();
        }
      }
    //check if head collides with wall
     if(this.x < 0 || this.y < 0 || this.x+this.size > width || this.y+this.size > height){
       gameOver();
     }
  }

  extendTail() {
    let lastTailSegment=this.tail[this.tail.length-1];
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment{
  constructor(x, y){
    console.log(x,y)
    this.x=x;
    this.y=y;
    this.size=10;
  }
  
  showSelf(){
    fill(random(360), 80, 80);
    rect(this.x, this.y, this.size);
  }
}

class Apple {
  constructor() {
    this.x=random(width-10);
      this.y=random(height-10);
      this.size=10;
    this.value = Math.floor(random(1,5))
  }
  colorOnValue(){
    switch(this.value){
      case 1: 
        fill(255,204,0);
        break;
      case 2: 
        fill(50,168,82)
        break;
      case 3: 
        fill(168,50,166)
        break;
      case 4: 
        fill(168,50,50)
        break;
      case 5: 
        fill(168,137,50)
        break;
      
    }
  }

  showSelf() {
    this.colorOnValue();
    rect(this.x, this.y, this.size, this.size);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode)
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else {
    console.log("wrong key");
  }
}

function restartGame() {}

function gameOver() {
  gameIsOver = true;
  textSize(30);
  text("Game Over!", 120, 80);
  textSize(12);
}