
// ALL CLASSES
class Ghoust {
	constructor(name, startPosition, speed) {
		this.name = name;
		this.startPosition = startPosition;
		this.currentPosition = startPosition;
		this.speed = speed;
		this.scared = false;
		this.intervalId = NaN;
	}
}

// SET CHARECTERS GAME

	// PAC-MAN
	let pacman = {
		startPosition: 190,
		currentPosition: 190,
		speed: 100,
		frame:1,
		frames:["view/pacman-full", "view/pacman-up", "view/pacman-left", "view/pacman-right", "view/pacman-down"],
		direction: {
			current:3,
			up:1,
			left:2,
			right:3,
			down:4,
		} ,
		intervalId: NaN,
	}


	// GHOUSTS[BLINKY, PINKY, INKYE, CLYE]
	let ghoustNames = ['blinky', 'pinky', 'inky', 'clye'];
	let ghousts = [
		new Ghoust('blinky', 198, 100),
		new Ghoust('pinky', 199, 100),
		new Ghoust('inky', 200, 100),
		new Ghoust('clye', 180, 100),
	];



// SELECTING ELEMENTS
let game = document.querySelector('.game');
let scoreElm = document.querySelector('#score');
let soundEatFood = document.querySelector('#eatFood');
let soundEatPower = document.querySelector('#eatPower');
let getReadyElm = document.querySelector('.get-ready');

// CREATE ELEMENTS MAIN-GAME
const width = 19;
const height = 21;
let score;

let layouts = [ // 19 * 21
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
	1,2,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,2,1,
	1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1,
	1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,
	1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,
	1,4,4,1,0,1,0,0,0,0,0,0,0,1,0,1,4,4,1,
	1,1,1,1,0,1,0,1,1,3,1,1,0,1,0,1,1,1,1,
	0,0,0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,
	1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,
	1,4,4,1,0,1,0,0,0,0,0,0,0,1,0,1,4,4,1,
	1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,
	1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
	1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,
	1,2,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,1,
	1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,
	1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,
	1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,

];

let divContainer = [];

function createNewGame() {
	getReadyElm.style.display = 'flex';
	score = 0;
	scoreElm.innerHTML = score;

	game.innerHTML = '';
 	divContainer = []

	for(let i=0; i<layouts.length; i++) {
		// 0-> Pacman-Food
		// 1-> wall
		// 2-> Pacman-Power
		// 3-> Goust-layer
		// 4-> Empty

		let newDivElement = document.createElement('div');
		divContainer.push(newDivElement);


		switch(layouts[i]) {
			case 0:
				divContainer[i].classList.add('pacman-food');
			break;
			case 1:
				divContainer[i].classList.add('wall');
			break;
			case 2:
				divContainer[i].classList.add('pacman-power');
			break;
			case 3:
				divContainer[i].classList.add('ghoust-layer');
			break;
			case 4:
				divContainer[i].classList.add('empty');
			break;
		}

		game.append(divContainer[i]);
	}

	// SET CHARECTERS GAME
	ghousts.forEach(ghoust=> {
		ghoust.currentPosition = ghoust.startPosition;
		clearInterval(ghoust.intervalId);
		clearInterval(pacman.intervalId);
	})

	// PAC-MAN
	pacman = {
		startPosition: 190,
		currentPosition: 190,
		speed: 100,
		frame:1,
		frames:["view/pacman-full", "view/pacman-up", "view/pacman-left", "view/pacman-right", "view/pacman-down"],
		direction: {
			current:3,
			up:1,
			left:2,
			right:3,
			down:4,
		} ,
		intervalId: NaN,
	}

	divContainer[pacman.startPosition].classList.add('pacman');
	divContainer[pacman.startPosition].classList.remove('pacman-food');

	// SET GHOSTS ON GAME BOARD
	ghousts.forEach(ghoust => {
		divContainer[ghoust.startPosition].classList.add(ghoust.name);
		divContainer[ghoust.startPosition].classList.add('ghoust');


		moveGhoust(ghoust);
	});
}


createNewGame();

// STATE GAME
let state = {
	current: 0,
	getReady: 0,
	startGame: 1,
	gameOver: 2
}



// PACMAN MOVES CONTROLLS
function pacmanMove(e) {

	switch(e.keyCode) {

		// LEFT-ARROW Keycode
		case 37:
			if(state.current == state.startGame) {
				clearInterval(pacman.intervalId);

				pacman.intervalId = setInterval(()=> {
					if(pacman.currentPosition % width !== 0 && !divContainer[pacman.currentPosition - 1].classList.contains('wall') && !divContainer[pacman.currentPosition - 1].classList.contains('ghoust-layer')) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'left', 'down', 'up', 'right');
						pacman.currentPosition -= pacman.frame;
						divContainer[pacman.currentPosition].classList.add('pacman', 'left');
					}

					if(pacman.currentPosition-1 == 189) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'right', 'left', 'up', 'down');
						pacman.currentPosition = 208;
					}

					eatFood();
					eatPower();

					anyGhoust();
					// if(score % 100 == 0 && score !== 0) {
					// 	createNewGhoust();
					// }

				}, pacman.speed);
			}
		break;


		// UP-ARROW Keycode
		case 38:
			if(state.current == state.startGame) {
				clearInterval(pacman.intervalId);

				pacman.intervalId = setInterval(()=> {
					if(pacman.currentPosition - width > 0 && !divContainer[pacman.currentPosition - width].classList.contains('wall') && !divContainer[pacman.currentPosition - width].classList.contains('ghoust-layer')) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'left', 'down', 'up', 'right');
						pacman.currentPosition -= width * pacman.frame;
						divContainer[pacman.currentPosition].classList.add('pacman', 'up');
					}
					eatFood();
					eatPower();

					anyGhoust();
					// if(score % 100 == 0 && score !== 0) {
					// 	createNewGhoust();
					// }

				}, pacman.speed);
			}
		break;


		// RIGHT-ARROW Keycode
		case 39:
			if(state.current == state.startGame) {
				clearInterval(pacman.intervalId);

				pacman.intervalId = setInterval(()=> {
					if(pacman.currentPosition % (width*height)-1 !== 1 && !divContainer[pacman.currentPosition + 1].classList.contains('wall') && !divContainer[pacman.currentPosition + 1].classList.contains('ghoust-layer')) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'left', 'down', 'up', 'right');
						pacman.currentPosition += pacman.frame;
						divContainer[pacman.currentPosition].classList.add('pacman', 'right');
					}

					if(pacman.currentPosition+1 == 209) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'right', 'left', 'up', 'down');
						pacman.currentPosition = 190;
					}

					eatFood();
					eatPower();

					anyGhoust();
					// if(score % 100 == 0 && score !== 0) {
					// 	createNewGhoust();
					// }

				}, pacman.speed);
			}
		break;


		// DOWN-ARROW Keycode
		case 40:
			if(state.current == state.startGame) {

				clearInterval(pacman.intervalId);

				pacman.intervalId = setInterval(()=> {
					if(pacman.currentPosition + width < (width * height) && !divContainer[pacman.currentPosition + width].classList.contains('wall') && !divContainer[pacman.currentPosition + width].classList.contains('ghoust-layer')) {
						divContainer[pacman.currentPosition].classList.remove('pacman', 'left', 'down', 'up', 'right');
						pacman.currentPosition += width * pacman.frame;
						divContainer[pacman.currentPosition].classList.add('pacman', 'down');
					}
					eatFood();
					eatPower();
					anyGhoust();
					// if(score % 100 == 0 && score !== 0) {
					// 	createNewGhoust();
					// }

				}, pacman.speed);
			}
		break;

		// N KeyCode
		case 78:
			getReadyElm.style.display = 'none';

			if(!state.current == state.startGame) {
				changeState();
			}
		break;
	}
}


// WHENE PACMAN EAT FOOD
function eatFood() {
	if(divContainer[pacman.currentPosition].classList.contains('pacman-food')) {

		divContainer[pacman.currentPosition].classList.remove('pacman-food');
		score += 10;
		scoreElm.innerHTML = score;
		reviveFood(pacman.currentPosition);
		soundEatFood.play();
	}
}


// WHENE PACMAN EAT POWER FOOD
function eatPower() {
	if(divContainer[pacman.currentPosition].classList.contains('pacman-power')) {
		divContainer[pacman.currentPosition].classList.remove('pacman-power');

		score += 50;
		scoreElm.innerHTML = score;

		ghousts.forEach(ghoust=> {
			ghoust.scared = true;

			setTimeout(()=> {
				ghoust.scared = false;
			}, 5000);
		})
		revivePower(pacman.currentPosition);

		soundEatPower.play();
	}
}

// REVIEV FOODS
function reviveFood(pos) {
	setTimeout(()=> {
		divContainer[pos].classList.add('pacman-food');
	},3000);
}

// REVIEV POWER FOOD
function revivePower(pos) {
	setTimeout(()=> {
		divContainer[pos].classList.add('pacman-power');
	},3000);
}


// GHOUSTS MOVES
function moveGhoust(ghoust) {
	directions = [-1,1,-width, +width];
	direction = directions[Math.floor(Math.random() * directions.length)];

	ghoust.intervalId = setInterval(()=> {
		if(state.current == state.startGame) {
			if(!divContainer[ghoust.currentPosition + direction].classList.contains('wall') && !divContainer[ghoust.currentPosition + direction].classList.contains('ghoust')) {
				
				if(pacman.currentPosition > ghoust.currentPosition) {
					if(pacman.currentPosition / ghoust.currentPosition > pacman.currentPosition / (ghoust.currentPosition+direction) && !divContainer[ghoust.currentPosition + direction].classList.contains('ghoust-layer')) {
						divContainer[ghoust.currentPosition].classList.remove(ghoust.name, 'ghoust', 'scared');
						ghoust.currentPosition += direction;
							if(ghoust.scared) {
								divContainer[ghoust.currentPosition].classList.add('scared');
							} else {
								divContainer[ghoust.currentPosition].classList.remove('scared');
							}
						divContainer[ghoust.currentPosition].classList.add(ghoust.name, 'ghoust');
					} else {
						direction = directions[Math.floor(Math.random() * directions.length)];
						if(ghoust.scared) {
							divContainer[ghoust.currentPosition].classList.add('scared');
						} else {
							divContainer[ghoust.currentPosition].classList.remove('scared');
						}
					}
				} else if(pacman.currentPosition < ghoust.currentPosition) {
					if(pacman.currentPosition / ghoust.currentPosition < pacman.currentPosition / (ghoust.currentPosition+direction)) {
						divContainer[ghoust.currentPosition].classList.remove(ghoust.name, 'ghoust', 'scared');
						ghoust.currentPosition += direction;
							if(ghoust.scared) {
								divContainer[ghoust.currentPosition].classList.add('scared');
							} else {
								divContainer[ghoust.currentPosition].classList.remove('scared');
							}
						divContainer[ghoust.currentPosition].classList.add(ghoust.name, 'ghoust');
					}else {
						direction = directions[Math.floor(Math.random() * directions.length)];
						if(ghoust.scared) {
							divContainer[ghoust.currentPosition].classList.add('scared');
						} else {
							divContainer[ghoust.currentPosition].classList.remove('scared');
						}
					}
				}

			} else {
				direction = directions[Math.floor(Math.random() * directions.length)];
				if(ghoust.scared) {
					divContainer[ghoust.currentPosition].classList.add('scared');
				} else {
					divContainer[ghoust.currentPosition].classList.remove('scared');
				}
			}
		}
	}, ghoust.speed);
}

function anyGhoust() {
	ghousts.forEach(ghoust=> {
		if(divContainer[pacman.currentPosition].classList.contains(ghoust.name) && !ghoust.scared) {
			setTimeout(()=> {
				clearInterval(ghoust.intervalId);
				clearInterval(pacman.intervalId);
				console.log("gameOver");
				return gameOver();
			}, 1);
		} else if(divContainer[pacman.currentPosition].classList.contains(ghoust.name) && ghoust.scared) {
			setTimeout(()=> {
				divContainer[pacman.currentPosition].classList.remove("ghoust", "scared", "inky", "pinky", "blinky", "clye");
				ghoust.currentPosition = ghoust.startPosition;
				score += 100;
				scoreElm.innerHTML = score;
			}, 1);
		}
	});
}

// WHENE USER GAME OVER!
function gameOver() {
	state.current = state.getReady;
	alert("Game Over!");
	createNewGame();
}



// Whene Game Change State
function changeState() {
	switch(state.current) {
		case state.getReady:
			state.current = state.startGame;
		break;
		case state.startGame:
		break;
		case state.gameOver:
			state.current = state.getReady;
			createNewGame();
		break;
	}
}


function createNewGhoust() {

	let rand = Math.floor(Math.random() * ghoustNames.length);
	let newGhoust = new Ghoust(ghoustNames[rand], 180, 500);
	divContainer[newGhoust.startPosition].classList.add('ghoust', newGhoust.name);

	ghousts = [...ghousts, newGhoust];

	return moveGhoust(newGhoust);
}

document.addEventListener('keyup', pacmanMove);

function update() {
}

function animation() {
	update();
	return requestAnimationFrame(animation);
}

animation();