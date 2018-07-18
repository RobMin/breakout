function Breakout(){
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let myEnemies = {}, lines = 4, enemiesAlive = [], level = 1, speed = -1.2, win = false;
  let lives = 5, score = 0;
  let playerMoveInter, playerProps = {
    x: 245,
    haveBall: true
  };
  let ballMoveInter, ballProps = {
    x: canvas.width/2,
    degreesX: 0,
    directionY: speed,
    y: 322,
    move: false
  };

  function enemiesCreat(){;
    for (let i = 0; i < lines; i++){
      for (let j = 0; j < 7; j++){
        myEnemies["enemy" + (i * 7 + j)] = {};
        myEnemies["enemy" + (i * 7 + j)].x = (j * 85) + 5;
        myEnemies["enemy" + (i * 7 + j)].y = (i * 20) + 5;
      }
    }
    enemiesAlive = Object.keys(myEnemies);
  }

  function propsReset(){
    GG();
    playerMoveInter = null;
    playerProps = {
      x: 245,
      haveBall: true
    };
    ballMoveInter = undefined;
    ballProps = {
      x: canvas.width/2,
      y: 322,
      degreesX: 0,
      directionY: speed,
      move: false
    };
    document.getElementsByClassName("props")[0].innerHTML = "Lives: " + lives;
    start();
  }

  function restart(){
    win = false;
    enemiesCreat();
    lives = 3;
    score = 0;
    level = 1;
    document.getElementsByClassName("props")[1].innerHTML = "Score: " + score;
    propsReset();
  }

  function die(){
    if (lives > 0){
      lives--;
    }
    else {
      GG();
      return;
    }
    propsReset();
  }

  function GG() {
    clearInterval(playerMoveInter);
    clearInterval(ballMoveInter);
  }

  function background(){
    ctx.fillStyle = "#bababa";
    ctx.fillRect(0, 0, 600, 350);
  }

  function bounce(){
    if (ballProps.x < 12){
      ballProps.degreesX *= -1;
      ballProps.x = 12;
    }
    else if(ballProps.x > 588){
      ballProps.degreesX *= -1;
      ballProps.x = 588;
    }

    if (ballProps.y <= 12){
      ballProps.directionY = Math.abs(speed);
    }
    else if (ballProps.y > 325 && ballProps.y < 338){
      if (ballProps.x > playerProps.x-12 && ballProps.x <= playerProps.x + 55){
        ballProps.degreesX = (55 - (ballProps.x - playerProps.x)) / 55 * (-1);
        ballProps.directionY = Math.abs(speed) * (-1);
      }
      else if (ballProps.x > playerProps.x + 55 && ballProps.x < playerProps.x + 122){
        ballProps.degreesX = (ballProps.x - (playerProps.x + 55)) / 55;
        ballProps.directionY = Math.abs(speed) * (-1);
      }
    }
  }

  function player(){
    ctx.fillStyle = "#59aafa"
    ctx.fillRect(playerProps.x, 335, 110, 11);
  }

  document.onkeydown = function(event){
    if (win === true)return;
    if ((event.keyCode === 37 || event.keyCode === 39) && ballProps.y < 338){
      clearInterval(playerMoveInter);
      playerMoveInter = setInterval(() => {

        if (event.keyCode === 37 && playerProps.x > 8)playerProps.x -= 1;
        else if (event.keyCode === 39 && playerProps.x < 482)playerProps.x += 1;

        if (playerProps.haveBall)ballProps.x = playerProps.x + 56;
        start();
      }, 2);
    }
    else if (event.keyCode === 38 && playerProps.haveBall){
      playerProps.haveBall = false;
      ballMoveInter = setInterval(() => {
        ballProps.y = Math.abs(ballProps.y) + ballProps.directionY;
        ballProps.x = Math.abs(ballProps.x) + ballProps.degreesX;
        start();
      }, 1);
    }
    if (event.keyCode === 82){
      restart();
    }
  }

  document.onkeyup = function(event){
    if(event.keyCode === 39 || event.keyCode === 37){
      clearInterval(playerMoveInter);
    }
  }

  function enemyKill(){
    for (let i = 0; i < enemiesAlive.length; i++){
      if (hitboxTouch(i, -11, 26, -12.5, 0)){
          ballProps.degreesX *= -1;
      }
      else if (hitboxTouch(i, -11, 26, 80, 92.5)){
          ballProps.degreesX *= -1;
      }
      else if (hitboxTouch(i, 24, 27, -12.5, 92.5)){
          ballProps.directionY = Math.abs(speed);
      }
      else if (hitboxTouch(i, -12, -9, -12, 92)){
          ballProps.directionY = Math.abs(speed) * (-1);
      }
      else{
        continue;
      }
      score += 100;
      document.getElementsByClassName("props")[1].innerHTML = "Score: " + score;
      delete myEnemies[enemiesAlive[i]];
      enemiesAlive = Object.keys(myEnemies);
      break;
    }
    if (enemiesAlive.length === 0)nextLevel();
  }

  function hitboxTouch(i, a, b, c, d){
    if(ballProps.y > myEnemies[enemiesAlive[i]].y + a
      && ballProps.y < myEnemies[enemiesAlive[i]].y + b
      && ballProps.x > myEnemies[enemiesAlive[i]].x + c
      && ballProps.x < myEnemies[enemiesAlive[i]].x + d){
        return true;
    }
    return false;
  }

  function nextLevel(){
    if (level === 1)speed = -1.4;
    else if (level === 2)speed = -1.6;
    else if(level === 3){
      winFunc();
      return;
    }
    lines += level;
    level++;
    enemiesCreat();
    propsReset();
  }

  function winFunc(){
    win = true;
    GG();
    ctx.clearRect(0, 0, 600, 350);
    background();
    ball();
    player();
    ctx.font = "90px Arial";
    ctx.fillStyle = "#59aafa"
    ctx.fillText("YOU WIN", 100, 200);
  }

  function enemiesDraw(){
    for (let i = 0; i < lines * 7; i++){
      if (myEnemies["enemy" + i]){
        ctx.fillStyle = "#59aafa"
        ctx.fillRect(myEnemies["enemy" + i].x, myEnemies["enemy" + i].y, 80, 15);
      }
    }
  }

  function ball(){
    if (ballProps.y > 338){die();}
    ctx.fillStyle = "#59aafa";
    ctx.beginPath();
    ctx.arc(ballProps.x, ballProps.y, 12, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.strokeStyle = "#59aafa"
    ctx.stroke();
  }

  function start(){
    ctx.clearRect(0, 0, 600, 350);
    background();
    ctx.font = "35px Arial";
    ctx.fillStyle = "#e8e8e8"
    ctx.fillText("Level " + level, 244, 195);
    bounce();
    player();
    if (ballProps.y < lines * 25 + 15){
      enemyKill();
    }
    enemiesDraw();
    ball();
  }

  enemiesCreat();
  start();
}
