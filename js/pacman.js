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
class Dot{
 constructor({position}) {
   this.x=position.x;
   this.y=position.y;
   this.radius=2;
   this.ea=Math.PI*2;


 }
 draw()
 {
   context.fillStyle='white';
   context.beginPath();
   context.arc(this.x,this.y,this.radius,0,this.ea);
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
  draw()
  {
    let image=new Image();
    if (direction==='up')
    {
      image.src='view/pacman-up.png';
    }
   else if (direction==='down')
    {
      image.src='view/pacman-down.png';
    }
   else if (direction==='right')
  {
    image.src='view/pacman-right.png';
  }
   else if (direction==='left')
  {
    image.src='view/pacman-left.png';
  }
   else
    {
      image.src='view/pacman-full.png';
    }

   context.beginPath();
   context.drawImage(image,this.x,this.y,22,22);
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
          blueGhost=new Ghost({position:{x:14*18,y:14*18},velocity:{x:0,y:0},gridPosition:{row:14,column:14},src:'view/blue.png',direction:'up'});
          redGhost=new Ghost({position:{x:10*18,y:7*18},velocity:{x:0,y:0},gridPosition:{row:7,column:10},src:'view/red.png',direction:'up'});
          pinkGhost=new Ghost({position:{x:17*18,y:20*18},velocity:{x:0,y:0},gridPosition:{row:20,column:17},src:'view/pink.png',direction:'left'});
          orangeGhost=new Ghost({position:{x:5*18,y:10*18},velocity:{x:0,y:0},gridPosition:{row:10,column:5},src:'view/orange.png',direction:'left'});
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
    this.src=src;
    this.direction=direction;
    this.isOut=false;
  }
  draw()
  {
    let image=new Image();
      image.src=this.src;
    context.beginPath();
    context.drawImage(image,this.x,this.y,22,22);
    context.closePath();
  }
  goUp()
  {
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
  goDown()
  {
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
  goRight()
  {
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
  goLeft()
  {
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
  checkMove()
  {
      if (this.x>0 && this.x<342)
      {
          if (this.x%18===0&&this.y%18===0)
          {
              let counter=0;
              if (gameMap[this.row+1][this.column]!==1)
              {
                  counter++;
              }
              if (gameMap[this.row-1][this.column]!==1)
              {
                  counter++;
              }
              if (gameMap[this.row][this.column+1]!==1)
              {
                  counter++;
              }
              if (gameMap[this.row][this.column-1]!==1)
              {
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
let blueGhost=new Ghost({position:{x:14*18,y:14*18},velocity:{x:0,y:0},gridPosition:{row:14,column:14},src:'view/blue.png',direction:'up'});
let redGhost=new Ghost({position:{x:10*18,y:7*18},velocity:{x:0,y:0},gridPosition:{row:7,column:10},src:'view/red.png',direction:'up'});
let pinkGhost=new Ghost({position:{x:17*18,y:20*18},velocity:{x:0,y:0},gridPosition:{row:20,column:17},src:'view/pink.png',direction:'left'});
let orangeGhost=new Ghost({position:{x:5*18,y:10*18},velocity:{x:0,y:0},gridPosition:{row:10,column:5},src:'view/orange.png',direction:'left'});
function  randomNumber(min,max)
{
  return Math.floor(Math.random() * (max-min+1))+min;
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
  if ((pacman.x + 22 > redGhost.x && pacman.x <redGhost.x+22) &&(pacman.y+22 > redGhost.y && pacman.y< redGhost.y+22))
  {
    statusDiv.style.display="flex";

    statusDiv.innerHTML='you lose'+'<br>'+'press N to start';
    return;
  }
  if ((pacman.x + 22 > pinkGhost.x && pacman.x <pinkGhost.x+22) &&(pacman.y+22 > pinkGhost.y && pacman.y< pinkGhost.y+22))
  {
    statusDiv.style.display="flex";

    statusDiv.innerHTML='you lose'+'<br>'+'press N to start';
    return;
  }
  if ((pacman.x + 22 > orangeGhost.x && pacman.x <orangeGhost.x+22) &&(pacman.y+22 > orangeGhost.y && pacman.y< orangeGhost.y+22))
  {
    statusDiv.style.display="flex";
    statusDiv.innerHTML='you lose'+'<br>'+'press N to start';
    return;
  }
  if ((pacman.x + 22 > blueGhost.x && pacman.x <blueGhost.x+22) &&(pacman.y+22 > blueGhost.y && pacman.y< blueGhost.y+22))
  {
    statusDiv.style.display="flex";

    statusDiv.innerHTML='you lose'+'<br>'+'press N to start';
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

  ////////////////////////////////////////// ghost momement

   if (blueGhost.direction==="up")
  {
    if (gameMap[blueGhost.row-1][blueGhost.column]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          blueGhost.direction="up";
          break;
        }
        case 2:
        {
          blueGhost.direction="right";
          break;
        }
        case 3:
        {
          blueGhost.direction="down";
          break;
        }
        case 4:
        {
          blueGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      blueGhost.goUp();
    }

  }
   else    if (blueGhost.direction==="down")
   {
     if (gameMap[blueGhost.row+1][blueGhost.column]===1)
     {
       let random=randomNumber(1,4);
       switch (random)
       {
         case 1:
         {
           blueGhost.direction="up";
           break;
         }
         case 2:
         {
           blueGhost.direction="right";
           break;
         }
         case 3:
         {
           blueGhost.direction="down";
           break;
         }
         case 4:
         {
           blueGhost.direction="left";
           break;
         }
       }
     }
     else
     {
       blueGhost.goDown();
     }

   }
   else   if (blueGhost.direction==="left")
   {
     if (gameMap[blueGhost.row][blueGhost.column-1]===1)
     {
      let random=randomNumber(1,4);
       switch (random)
       {
         case 1:
         {
           blueGhost.direction="up";
           break;
         }
         case 2:
         {
           blueGhost.direction="right";
           break;
         }
         case 3:
         {
           blueGhost.direction="down";
           break;
         }
         case 4:
         {
           blueGhost.direction="left";
           break;
         }
       }
     }
     else
     {
       blueGhost.goLeft();
     }

   }
   else   if (blueGhost.direction==="right")
   {
     if (gameMap[blueGhost.row][blueGhost.column+1]===1)
     {
       let random=randomNumber(1,4);
       switch (random)
       {
         case 1:
         {
           blueGhost.direction="up";
           break;
         }
         case 2:
         {
           blueGhost.direction="right";
           break;
         }
         case 3:
         {
           blueGhost.direction="down";
           break;
         }
         case 4:
         {
           blueGhost.direction="left";
           break;
         }
       }
     }
     else
     {
       blueGhost.goRight();
     }

   }




  // blue ghost test do not come to this aria
  if (redGhost.direction==="up")
  {
    if (gameMap[redGhost.row-1][redGhost.column]===1)
    {
      let random=randomNumber(1,4);

      switch (random)
      {
        case 1:
        {
          redGhost.direction="up";
          break;
        }
        case 2:
        {
          redGhost.direction="right";
          break;
        }
        case 3:
        {
          redGhost.direction="down";
          break;
        }
        case 4:
        {
          redGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      redGhost.goUp();
    }

  }


  else  if (redGhost.direction==="down")
  {
    if (gameMap[redGhost.row+1][redGhost.column]===1)
    {
      let random=randomNumber(1,4);

      switch (random)
      {
        case 1:
        {
          redGhost.direction="up";
          break;
        }
        case 2:
        {
          redGhost.direction="right";
          break;
        }
        case 3:
        {
          redGhost.direction="down";
          break;
        }
        case 4:
        {
          redGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      redGhost.goDown();
    }

  }
  else  if (redGhost.direction==="right")
  {
    if (gameMap[redGhost.row][redGhost.column+1]===1)
    {
      let random=randomNumber(1,4);

      switch (random)
      {
        case 1:
        {
          redGhost.direction="up";
          break;
        }
        case 2:
        {
          redGhost.direction="right";
          break;
        }
        case 3:
        {
          redGhost.direction="down";
          break;
        }
        case 4:
        {
          redGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      redGhost.goRight();
    }

  }

  else  if (redGhost.direction==="left")
  {
    if (gameMap[redGhost.row][redGhost.column-1]===1)
    {
      let random=randomNumber(1,4);

      switch (random)
      {
        case 1:
        {
          redGhost.direction="up";
          break;
        }
        case 2:
        {
          redGhost.direction="right";
          break;
        }
        case 3:
        {
          redGhost.direction="down";
          break;
        }
        case 4:
        {
          redGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      redGhost.goLeft();
    }

  }



  if (pinkGhost.direction==="left")
  {
    if (gameMap[pinkGhost.row][pinkGhost.column-1]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          pinkGhost.direction="up";
          break;
        }
        case 2:
        {
          pinkGhost.direction="right";
          break;
        }
        case 3:
        {
          pinkGhost.direction="down";
          break;
        }
        case 4:
        {
          pinkGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      pinkGhost.goLeft();
    }

  }
  else  if (pinkGhost.direction==="right")
  {
    if (gameMap[pinkGhost.row][pinkGhost.column+1]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          pinkGhost.direction="up";
          break;
        }
        case 2:
        {
          pinkGhost.direction="right";
          break;
        }
        case 3:
        {
          pinkGhost.direction="down";
          break;
        }
        case 4:
        {
          pinkGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      pinkGhost.goRight();
    }

  }

 else if (pinkGhost.direction==="up")
  {
    if (gameMap[pinkGhost.row-1][pinkGhost.column]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          pinkGhost.direction="up";
          break;
        }
        case 2:
        {
          pinkGhost.direction="right";
          break;
        }
        case 3:
        {
          pinkGhost.direction="down";
          break;
        }
        case 4:
        {
          pinkGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      pinkGhost.goUp();
    }

  }

else  if (pinkGhost.direction==="down")
  {
    if (gameMap[pinkGhost.row+1][pinkGhost.column]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          pinkGhost.direction="up";
          break;
        }
        case 2:
        {
          pinkGhost.direction="right";
          break;
        }
        case 3:
        {
          pinkGhost.direction="down";
          break;
        }
        case 4:
        {
          pinkGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      pinkGhost.goDown();
    }

  }




  if (orangeGhost.direction==="down")
  {
    if (gameMap[orangeGhost.row+1][orangeGhost.column]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          orangeGhost.direction="up";
          break;
        }
        case 2:
        {
          orangeGhost.direction="right";
          break;
        }
        case 3:
        {
          orangeGhost.direction="down";
          break;
        }
        case 4:
        {
          orangeGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      orangeGhost.goDown();
    }

  }
  else   if (orangeGhost.direction==="up")
  {
    if (gameMap[orangeGhost.row-1][orangeGhost.column]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          orangeGhost.direction="up";
          break;
        }
        case 2:
        {
          orangeGhost.direction="right";
          break;
        }
        case 3:
        {
          orangeGhost.direction="down";
          break;
        }
        case 4:
        {
          orangeGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      orangeGhost.goUp();
    }

  }
  else   if (orangeGhost.direction==="left")
  {
    if (gameMap[orangeGhost.row][orangeGhost.column-1]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          orangeGhost.direction="up";
          break;
        }
        case 2:
        {
          orangeGhost.direction="right";
          break;
        }
        case 3:
        {
          orangeGhost.direction="down";
          break;
        }
        case 4:
        {
          orangeGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      orangeGhost.goLeft();
    }

  }
  else   if (orangeGhost.direction==="right")
  {
    if (gameMap[orangeGhost.row][orangeGhost.column+1]===1)
    {
      let random=randomNumber(1,4);
      switch (random)
      {
        case 1:
        {
          orangeGhost.direction="up";
          break;
        }
        case 2:
        {
          orangeGhost.direction="right";
          break;
        }
        case 3:
        {
          orangeGhost.direction="down";
          break;
        }
        case 4:
        {
          orangeGhost.direction="left";
          break;
        }
      }
    }
    else
    {
      orangeGhost.goRight();
    }

  }


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