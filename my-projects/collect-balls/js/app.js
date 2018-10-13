const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';

const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/glue.png">';

var gGamerPos;
var gBoard;
var gAddRandomBall;
var gNumBallsCollected = 0;
var gCurrBallsCount;
var gAddRandomGlue;
var gCurrGlueLocation;
var gIsGlueProcessing = false;
//var gGluePos;


function init() {
	//Board
	gGamerPos = { i: 2, j: 5 };
	gBoard = buildBoard();
	renderBoard(gBoard);

	//Balls
	gNumBallsCollected = 0;
	updateBallsCollected();
	gCurrBallsCount = 2;

	//Restart-display-none
	var elRestart = document.querySelector('.restart');
	elRestart.style.display = 'none';

	//Glue
	gAddRandomGlue = setInterval(addGlue, 3000);
}

function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;
	gAddRandomBall = setInterval(addBalls, 5000);

	//Place the Passes
	board[0][5].type = FLOOR;
	board[9][5].type = FLOOR;
	board[4][0].type = FLOOR;
	board[4][11].type = FLOOR;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += '\t' + GAMER_IMG + '\n';
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			} else if (currCell.gameElement === GLUE) {
				// 	strHTML += '\t<td class="cell ' + cellClass + '"  onclick="" >\n';
				strHTML += GLUE_IMG;
			}


			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	console.log('strHTML is:');
	console.log(strHTML);
	elBoard.innerHTML = strHTML;
	if (BALL === 0) gameOver();
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;
	if (gIsGlueProcessing === true) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			collectingBall();

		}

		if (gGamerPos.gameElement !== GLUE) {


			gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
			renderCell(gGamerPos, '');

			gGamerPos.i = i;
			gGamerPos.j = j;

			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
			renderCell(gGamerPos, GAMER_IMG);

		}

		if (gGamerPos.gameElement === GLUE) {
			gIsGlueProcessing = true;
			setTimeout(function () { gIsGlueProcessing = false; }, 3000);
		}

	}


} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);



// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	var currCell = gBoard[i][j];

	if (currCell === gBoard[0][5]) {
		if (event.key === 'ArrowUp') {
			moveToPass(9, 5);
			return;
		}
	}

	if (currCell === gBoard[9][5]) {
		if (event.key === 'ArrowDown') {
			moveToPass(0, 5);
			return;
		}
	}

	if (currCell === gBoard[4][0]) {
		if (event.key === 'ArrowLeft') {
			moveToPass(4, 11);
			return;
		}
	}

	if (currCell === gBoard[4][11]) {
		if (event.key === 'ArrowRight') {
			moveToPass(4, 0);
			return;
		}
		if (event.key === 'ArrowLeft') {
			moveTo(i, j - 1);
			return;
		}
	}

	// else if (currCell.gameElement === GLUE) {

	// 	switch (event.key) {
	// 		case 'ArrowLeft':
	// 			moveTo(i, j);
	// 			break;
	// 		case 'ArrowRight':
	// 			moveTo(i, j);
	// 			break;
	// 		case 'ArrowUp':
	// 			moveTo(i, j);
	// 			break;
	// 		case 'ArrowDown':
	// 			moveTo(i, j);
	// 			break;
	// 	}
	// }

	else switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;
	}
}


// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}



function addBalls() {
	//console.log('inside addBalls');
	var i = getRandomIntInclusive(1, 8);
	var j = getRandomIntInclusive(1, 10);

	if (i !== gGamerPos.i || j !== gGamerPos.j) {

		var currBallLocation = { i: i, j: j };

		if (gBoard[i][j].gameElement !== BALL) {

			gBoard[i][j].gameElement = BALL;
			renderCell(currBallLocation, BALL_IMG);
			gCurrBallsCount++;
			//console.log(gCurrBallsCount);
		}

	}

}

function collectingBall() {
	//console.log('Collecting!');
	gNumBallsCollected++;
	gCurrBallsCount--;
	//console.log(gCurrBallsCount);
	updateBallsCollected();
	var popingSound = new Audio('sounds/Blop.mp3');
	popingSound.play();
	if (gCurrBallsCount === 0) gameOver();

}

function gameOver() {
	var elRestart = document.querySelector('.restart');
	elRestart.style.display = 'block';
	clearInterval(gAddRandomBall);
	clearInterval(gAddRandomGlue);

}


function updateBallsCollected() {
	var elCollectedBalls = document.querySelector('.collected');
	elCollectedBalls.innerText = `Collected Balls: ${gNumBallsCollected}`;
}


function moveToPass(i, j) {

	// MOVING
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	renderCell(gGamerPos, '');

	gGamerPos.i = i;
	gGamerPos.j = j;

	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	renderCell(gGamerPos, GAMER_IMG);

}




function addGlue() {

	var i = getRandomIntInclusive(1, 8);
	var j = getRandomIntInclusive(1, 10);

	if (i !== gGamerPos.i || j !== gGamerPos.j) {

		gCurrGlueLocation = { i: i, j: j };


		if (gBoard[i][j].gameElement !== BALL) {

			gBoard[i][j].gameElement = GLUE;
			renderCell(gCurrGlueLocation, GLUE_IMG);
			setTimeout(removeGlue, 2900);


		}

	}

}


function removeGlue() {
	var i = gCurrGlueLocation.i;
	var j = gCurrGlueLocation.j;

	gBoard[i][j].gameElement = null;
	renderCell(gCurrGlueLocation, '');
}

function stuckOnGlue() {

	var i = gGamerPos.i;
	var j = gGamerPos.j;
	var currCell = gBoard[i][j];



	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j);
			break;
		case 'ArrowRight':
			moveTo(i, j);
			break;
		case 'ArrowUp':
			moveTo(i, j);
			break;
		case 'ArrowDown':
			moveTo(i, j);
			break;
	}

}


function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}