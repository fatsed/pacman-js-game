const canvas = document.createElement("canvas");
const gameContainer = document.getElementById("pacman");

canvas.width = gameContainer.offsetWidth;
canvas.height = gameContainer.offsetHeight;
gameContainer.appendChild(canvas);

const context = canvas.getContext("2d");

const statusDiv = document.createElement("div");
gameContainer.appendChild(statusDiv);

statusDiv.style = `
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: yellow;
  display: flex;
  align-items: center;
  justify-content: center;
`;

statusDiv.innerText = "Press N to Start";

const scoreText = document.createElement("p");
scoreText.style = `
  position: relative;
  color: yellow;
  bottom: 48px;
  left: 100px;
  display: none;
`;

gameContainer.appendChild(scoreText);

let startCount = 0;
let isPlaying = false;

let direction = "down";
let lastkey = "ArrowDown";

const speed = 3;
const ghostSpeed = 2;

let score = 10;
scoreText.innerText = score;

const images = {
  pacmanUp: new Image(),
  pacmanDown: new Image(),
  pacmanLeft: new Image(),
  pacmanRight: new Image(),
  pacmanFull: new Image(),

  blueGhost: new Image(),
  redGhost: new Image(),
  pinkGhost: new Image(),
  orangeGhost: new Image(),
};

images.pacmanUp.src = "view/pacman-up.png";
images.pacmanDown.src = "view/pacman-down.png";
images.pacmanLeft.src = "view/pacman-left.png";
images.pacmanRight.src = "view/pacman-right.png";
images.pacmanFull.src = "view/pacman-full.png";

images.blueGhost.src = "view/blue.png";
images.redGhost.src = "view/red.png";
images.pinkGhost.src = "view/pink.png";
images.orangeGhost.src = "view/orange.png";

// 1 = wall, 2 = dot, 3 = empty space
// Map size: 22 rows × 19 columns
let gameMap=[
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,2,2,2,2,2,2,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
  [3,3,3,3,2,2,2,1,1,1,1,1,2,2,2,3,3,3,3],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,2,2,2,2,2,2,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

class Dot {
  constructor({ position }) {
    this.x = position.x;
    this.y = position.y;
    this.radius = 2;
    this.endAngle = Math.PI * 2;
  }

  draw() {
    context.fillStyle = "white";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, this.endAngle);
    context.fill();
    context.closePath();
  }
}

class DotRespawn{
    constructor({position}) {
        this.row=position.row;
        this.col=position.col;
    }
    respawnDot()
    {
        const respawnInterval=setInterval(()=>
        {
        gameMap[this.row][this.col]=2;
            clearInterval(respawnInterval);
        },5000)
    }
}
class Pacman
{
  constructor({position,velocity,gridPosition}) {
    this.x=position.x;
    this.y=position.y;
    this.velX=velocity.x;
    this.velY=velocity.y;
    this.row=gridPosition.row;
    this.column=gridPosition.column;
  }
  draw() {
  let image = images.pacmanFull;

  if (direction === "up") {
    image = images.pacmanUp;
  } else if (direction === "down") {
    image = images.pacmanDown;
  } else if (direction === "right") {
    image = images.pacmanRight;
  } else if (direction === "left") {
    image = images.pacmanLeft;
  }

  context.beginPath();
  context.drawImage(image, this.x, this.y, 22, 22);
  context.closePath();
  }
  goUp()
  {
    if (gameMap[this.row-1][this.column]!==1)
    {
     direction='up';
      this.velY=-speed;
      this.update();
      if (this.y%18===0)
      {
        this.row--;
        if (gameMap[this.row][this.column]===2)
        {
          score+=10;
          scoreText.innerText=score;
          new DotRespawn({position:{row:this.row,col:this.column}}).respawnDot();
        }
        if (this.y!==this.row*18)
        {
          this.y=this.row*18;
          this.draw();
        }
        gameMap[this.row][this.column]=3;
      }
    }
  }
  goDown()
  {
    if (gameMap[this.row+1][this.column]!==1)
    {
      direction='down';
      this.velY=speed;
      this.update();
      if (this.y%18===0)
      {
        this.row++;
        if (gameMap[this.row][this.column]===2)
        {
          score+=10;
          scoreText.innerText=score;
            new DotRespawn({position:{row:this.row,col:this.column}}).respawnDot();
        }
        if (this.y!==this.row*18)
        {
          this.y=this.row*18;
          this.draw();
        }
        gameMap[this.row][this.column]=3;
      }
    }
  }
  goRight()
  {
    if (gameMap[this.row][this.column+1]!==1)
    {
      direction='right';
      this.velX=speed;
      this.update();
      if (this.x%18===0)
      {
        this.column++;
        if (gameMap[this.row][this.column]===2)
        {
          score+=10;
          scoreText.innerText=score;
            new DotRespawn({position:{row:this.row,col:this.column}}).respawnDot();
        }
        if (this.x!==this.column*18)
        {
          this.x=this.column*18;
          this.draw();
        }
        gameMap[this.row][this.column]=3;
      }
    }
  }
  goLeft()
  {
    if (gameMap[this.row][this.column-1]!==1)
    {
      direction='left';
      this.velX=-speed;
      this.update();
      if (this.x%18===0)
      {
        this.column--;
        if (gameMap[this.row][this.column]===2)
        {
          score+=10;
          scoreText.innerText=score;
            new DotRespawn({position:{row:this.row,col:this.column}}).respawnDot();
        }
        if (this.x!==this.column*18)
        {
          this.x=this.column*18;
          this.draw();
        }
        gameMap[this.row][this.column]=3;
      }
    }
  }
  update()
  {
    // if (this.x <=3*18 && this.y ===180 ) {
    //   direction = 'left';
    //   lastkey = 'ArrowLeft';
    // }
    if (this.x<-18)
    {
      direction='left';
      lastkey='ArrowLeft';
      this.x=342;
      this.y=180;
      this.column=19;

    }

    // if(this.x>18*16 && this.y ===180 ) {
    //   direction = 'right';
    //   lastkey = 'ArrowRight';
    // }
      if (this.x>360)
      {
        direction='right';
        lastkey='ArrowRight';
        this.x=0;
        this.y=180;
        this.column=0;
      }


    this.x+=this.velX;
    this.y+=this.velY;
    this.draw();
  }
  play()
  {
    isPlaying=false;
    let timer=3;
    if (startCount!==1)
    {
      let interval=setInterval(()=>
      {

        statusDiv.innerText=timer;
        timer--;
        if (timer<0)
        {
          startCount=0;
          direction='down';
          lastkey='ArrowDown';
          isPlaying=true;
          score=10;
          pacman=new Pacman({position:{x:18,y:18},velocity:{x:0,y:0},gridPosition:{row:1,column:1}});
          blueGhost=new Ghost({position:{x:14*18,y:14*18},velocity:{x:0,y:0},gridPosition:{row:14,column:14},src: "blueGhost",direction:'up'});
          redGhost=new Ghost({position:{x:10*18,y:7*18},velocity:{x:0,y:0},gridPosition:{row:7,column:10},src: "redGhost",direction:'up'});
          pinkGhost=new Ghost({position:{x:17*18,y:20*18},velocity:{x:0,y:0},gridPosition:{row:20,column:17},src: "pinkGhost",direction:'left'});
          orangeGhost=new Ghost({position:{x:5*18,y:10*18},velocity:{x:0,y:0},gridPosition:{row:10,column:5},src: "orangeGhost",direction:'left'});
          gameMap=[
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,1],
            [1,1,1,1,2,1,2,2,2,2,2,2,2,1,2,1,1,1,1],
            [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
            [3,3,3,3,2,2,2,1,1,1,1,1,2,2,2,3,3,3,3],
            [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
            [1,1,1,1,2,1,2,2,2,2,2,2,2,1,2,1,1,1,1],
            [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
            [1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1],
            [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
          ];
          statusDiv.style.display="none";
          clearInterval(interval);
        }
      },1000);
    }
  }
}
class Ghost
{
  constructor({position,velocity,gridPosition,src,direction}) {
    this.x=position.x;
    this.y=position.y;
    this.velX=velocity.x;
    this.velY=velocity.y;
    this.row=gridPosition.row;
    this.column=gridPosition.column;
    this.src = src;
    this.image = images[src];
    this.direction = direction;
    this.isOut = false;
  }
  draw() {
  context.beginPath();
  context.drawImage(this.image, this.x, this.y, 22, 22);
  context.closePath();
  }
  goUp(){
    if (gameMap[this.row-1][this.column]!==1)
    {
      this.direction='up';
      this.velY=-ghostSpeed;
      this.update();
      if (this.y%18===0)
      {
        this.row--;
        this.checkMove();
      }
    }
  }
  goDown(){
    if (gameMap[this.row+1][this.column]!==1)
    {
      this.direction='down';
      this.velY=ghostSpeed;
      this.update();
      if (this.y%18===0)
      {
        this.row++;
          this.checkMove();
      }

    }
  }
  goRight(){
    if (gameMap[this.row][this.column+1]!==1)
    {
      this.direction='right';
      this.velX=ghostSpeed;
      this.update();
      if (this.x%18===0)
      {
        this.column++;
          this.checkMove();
      }
    }
  }
  goLeft(){
    if (gameMap[this.row][this.column-1]!==1)
    {
      this.direction='left';
      this.velX=-ghostSpeed;
      this.update();
      if (this.x%18===0)
      {
        this.column--;
          this.checkMove();
      }
    }
  }
  checkMove(){
      if (this.x>0 && this.x<342){
          if (this.x%18===0&&this.y%18===0){
              let counter=0;
              if (gameMap[this.row+1][this.column]!==1){
                  counter++;
                }
              if (gameMap[this.row-1][this.column]!==1){
                  counter++;
                }
              if (gameMap[this.row][this.column+1]!==1){
                  counter++;
                }
              if (gameMap[this.row][this.column-1]!==1){
                  counter++;
              }
              if (counter>=3)
              {
                  let random=randomNumber(1,4);
                  switch (random)
                  {
                      case 1:
                      {
                          this.direction="up";
                          break;
                      }
                      case 2:
                      {
                          this.direction="right";
                          break;
                      }
                      case 3:
                      {
                          this.direction="down";
                          break;
                      }
                      case 4:
                      {
                          this.direction="left";
                          break;
                      }
                  }
              }
          }
      }

  }
  update()
  {
    if (this.x <-18)
    {
      this.x=342;
      this.column=19;
    }
    if(this.x>360)
    {
      this.x=0;
      this.column=0;
    }
    this.isOut=false;
    this.x+=this.velX;
    this.y+=this.velY;
    this.draw();
  }
}
let pacman=new Pacman({position:{x:18,y:18},velocity:{x:0,y:0},gridPosition:{row:1,column:1}});
let blueGhost=new Ghost({position:{x:14*18,y:14*18},velocity:{x:0,y:0},gridPosition:{row:14,column:14},src: "blueGhost",direction:'up'});
let redGhost=new Ghost({position:{x:10*18,y:7*18},velocity:{x:0,y:0},gridPosition:{row:7,column:10},src: "redGhost",direction:'up'});
let pinkGhost=new Ghost({position:{x:17*18,y:20*18},velocity:{x:0,y:0},gridPosition:{row:20,column:17},src: "pinkGhost",direction:'left'});
let orangeGhost=new Ghost({position:{x:5*18,y:10*18},velocity:{x:0,y:0},gridPosition:{row:10,column:5},src: "orangeGhost",direction:'left'});
function  randomNumber(min,max)
{
  return Math.floor(Math.random() * (max-min+1))+min;
}

function moveGhost(ghost) {
  if (ghost.direction === "up") {
    if (gameMap[ghost.row - 1][ghost.column] === 1) {
      ghost.direction = getRandomDirection();
    } else {
      ghost.goUp();
    }
  } else if (ghost.direction === "down") {
    if (gameMap[ghost.row + 1][ghost.column] === 1) {
      ghost.direction = getRandomDirection();
    } else {
      ghost.goDown();
    }
  } else if (ghost.direction === "left") {
    if (gameMap[ghost.row][ghost.column - 1] === 1) {
      ghost.direction = getRandomDirection();
    } else {
      ghost.goLeft();
    }
  } else if (ghost.direction === "right") {
    if (gameMap[ghost.row][ghost.column + 1] === 1) {
      ghost.direction = getRandomDirection();
    } else {
      ghost.goRight();
    }
  }
}

function getRandomDirection() {
  const random = randomNumber(1, 4);

  switch (random) {
    case 1:
      return "up";
    case 2:
      return "right";
    case 3:
      return "down";
    case 4:
      return "left";
  }
}

function showGameOver() {
  statusDiv.style.display = "flex";
  statusDiv.innerHTML = "You Lose<br>Press N to Restart";
}

function isColliding(character1, character2) {
  return (
    character1.x + 22 > character2.x &&
    character1.x < character2.x + 22 &&
    character1.y + 22 > character2.y &&
    character1.y < character2.y + 22
  );
}

function animate()
{
  requestAnimationFrame(animate);
  context.clearRect(0,0,canvas.width,canvas.height);
  pacman.velY=0;
  pacman.velX=0;
  redGhost.velY=0;
  redGhost.velX=0;
  blueGhost.velY=0;
  blueGhost.velX=0;
  pinkGhost.velY=0;
  pinkGhost.velX=0;
  orangeGhost.velY=0;
  orangeGhost.velX=0;

  if (!isPlaying)
  {
  scoreText.style.display='none';
    return;
  }
else
  {
    scoreText.style.display='flex';
  }
  // if (score===1830)
  // {
  //   statusDiv.style.display="flex";
  //
  //   statusDiv.innerHTML='you win'+'<br>'+'press N to start';
  //   return;
  // }
  if (
  isColliding(pacman, redGhost) ||
  isColliding(pacman, pinkGhost) ||
  isColliding(pacman, orangeGhost) ||
  isColliding(pacman, blueGhost)
) {
  showGameOver();
  return;
  }
  gameMap.forEach((row,i)=>
  {
    row.forEach((symbol,j)=>
    {
      switch (symbol)
      {
        case 2:
        {
          new Dot({position:{x:18*j+10,y:18*i+10}}).draw();
          break;
        }
      }
    })
  })
  if (lastkey==='ArrowDown')
  {
    if (pacman.x %18 !==0)
    {
      if (direction==='right')
      {
        pacman.goRight();
      }
      else if (direction==='left')
      {
        pacman.goLeft();
      }
    }
    else
    {

      if (gameMap[pacman.row+1][pacman.column]===1)
      {
        if (direction==='right')
        {
          pacman.goRight();
        }
        else if (direction==='left')
        {
          pacman.goLeft();
        }
      }
      else
      {
        pacman.goDown();
      }
    }
  }

  else if (lastkey==='ArrowUp')
  {
    if (pacman.x %18 !==0)
    {
      if (direction==='right')
      {
        pacman.goRight();
      }
      else if (direction==='left')
      {
        pacman.goLeft();
      }
    }
    else if (pacman.x %18 ===0)
    {
      if (gameMap[pacman.row-1][pacman.column]===1)
      {
        if (direction==='right')
        {
          pacman.goRight();
        }
        else if (direction==='left')
        {
          pacman.goLeft();
        }
      }
      else
      {
        pacman.goUp();
      }
    }
  }
 else if (lastkey==='ArrowRight')
  {
    if (pacman.y %18 !==0)
    {
      if (direction==='up')
      {
        pacman.goUp();
      }
      else if (direction==='down')
      {
        pacman.goDown();
      }
    }
    else if (pacman.y %18 ===0)
    {
      if (gameMap[pacman.row][pacman.column+1]===1)
      {
        if (direction==='up')
        {
          pacman.goUp();
        }
        else if (direction==='down')
        {
          pacman.goDown();
        }
      }
      else
      {
        pacman.goRight();
      }
    }
  }
  else if (lastkey==='ArrowLeft')
  {
    if (pacman.y %18 !==0)
    {
      if (direction==='up')
      {
        pacman.goUp();
      }
      else if (direction==='down')
      {
        pacman.goDown();
      }
    }
    else if (pacman.y %18 ===0)
    {
      if (gameMap[pacman.row][pacman.column-1]===1)
      {
        if (direction==='up')
        {
          pacman.goUp();
        }
        else if (direction==='down')
        {
          pacman.goDown();
        }
      }
      else
      {
        pacman.goLeft();
      }
    }
  }
    // Ghost movement
  moveGhost(blueGhost);
  moveGhost(redGhost);
  moveGhost(pinkGhost);
  moveGhost(orangeGhost);
  pacman.draw();
  blueGhost.draw();
  redGhost.draw();
  pinkGhost.draw();
  orangeGhost.draw();
}
animate();
addEventListener('keydown',(e)=>
{

  switch (e.key)
  {
    case "ArrowUp":
    {
      if((pacman.x<=72 || pacman.x>=270) && pacman.y===180)
      {

      }
      else
      {
        lastkey="ArrowUp";
      }
      break;
    }
    case "ArrowDown":
    {
      if((pacman.x<=72 || pacman.x>=270) && pacman.y===180)
      {

      }
      else
      {
        lastkey="ArrowDown";
      }
      break;
    }
    case "ArrowRight":
    {
     lastkey="ArrowRight";
      break;
    }
    case "ArrowLeft":
  {
    lastkey="ArrowLeft";
    break;
  }
    case 'n':
    case 'N':
  {
  pacman.play();
  startCount++;
  statusDiv.style.display = 'flex';
  break;
}
  }
});