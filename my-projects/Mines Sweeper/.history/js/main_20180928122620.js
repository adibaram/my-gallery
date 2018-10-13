// CR: Very good game, some things are missing
// CR: like the number of mines.
// CR: You could very easily improve the code
// CR: so when num of cells unopened === num of mines
// CR: the game is over with victory.

"use strict";

const MINE_IMG = '<img src="img/mine.png">';
const FLAG_IMG = '<img src="img/flag.png">';

// CR: emoji with a J....
// CR: I would use one "EMOJI" object to store those 4 unicodes. 
const EMOGI_WIN = '😎';
const EMOGI = '🙂';
const EMOGI_DEAD = '😖';
const EMOGI_PLAYING = '🤓';


var gLevel = [{ SIZE: 4, MINES: 2 }, { SIZE: 6, MINES: 5 }, { SIZE: 8, MINES: 15 }]
var gCurrLevel = 0;

var gBoard;

var gState = {
    isGameOn: false, // boolean, when true we let the user play
    shownCount: 0, //how many cells are shown
    markedCount: 0, //how many cells are marked (with a flag)
    secsPassed: 0 //how many seconds passed
}

// CR: Unnecessary variable.
// CR: You can use other variables to know it.
// CR: like: gState.shownCount, gTimeStart, gGameDuration....
var gIsFirstClick = true;

// CR: I would use one "gTimer" object to store those 3 variables. 
var gTimeStart;
var gTimeCount;
var gGameDuration;

// CR: I would use one "gBestScore" object to store those 3 variables. 
var gBestEasy = null;
var gBestMedium = null;
var gBestHard = null;

//This is called when page loads

function initGame(level) {
    gBoard = buildBoard(level);
    renderBoard(gBoard);

    var elTimer = document.querySelector('.timer');
    elTimer.innerText = 0;

    gState = {
        isGameOn: false, // boolean, when true we let the user play
        shownCount: 0, //how many cells are shown
        markedCount: 0, //how many cells are marked (with a flag)
        secsPassed: 0 //how many seconds passed
    }
}

// Builds the board by setting mines at random locations, 
// and then calling the setMinesNegsCount()
// Then return the created board


function buildBoard(level) {
    // Create the Matrix
    var board = new Array(gLevel[level].SIZE);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(gLevel[level].SIZE);
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, i: i, j: j };
            board[i][j] = cell;
        }
    }

    console.log(board);
    return board;

}

//Sets mines-count to neighbours

function setMinesNegsCount(board, i, j) {
    var minesCount = 0;
    var cell = board[i][j];

    for (var m = cell.i - 1; m <= cell.i + 1; m++) {

        if (m < 0 || m >= board.length) continue;

        for (var n = cell.j - 1; n <= cell.j + 1; n++) {

            if (m === cell.i && n === cell.j) continue;
            if (n < 0 || n >= board[0].length) continue;
            if (board[m][n].isMine) minesCount++;
        }
    }

    
    return cell.minesAroundCount = minesCount;
}


//Print the board as a <table> to the page

function renderBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // CR: Unnecessary variable.
            // CR: You only use it for i and j, and you have it from the loop.
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // CR: inline styling again.
            strHTML += `<td class="cell ${cellClass}" onmousedown="cellClicked(event, 
                        ${currCell.i}, ${currCell.j})" style="cursor: pointer">`

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;

}

// CR: This is one very long function that is doing a lot of things.
// CR: Break the function to smaller parts.
// CR: I would write cellClicked func which handle
// CR: the left click and right click separately.
//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];

    if (gIsFirstClick) {

        //TODO: load after first click
        // CR: You didn't verify that the first cell cannot be a mine.
        addMines(gCurrLevel, gBoard, currCell);

        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                setMinesNegsCount(gBoard, i, j);
            }
        }
        gState.isGameOn = true;

        gTimeStart = Date.now();
        gTimeCount = setInterval(calcCurrTime, 100);

        gIsFirstClick = false;
        changeEmogi(EMOGI_PLAYING);


    }
    // CR: You don't need to write '=== boolean'.
    // CR: e.g only write 'if (gState.isGameOn)' for true
    // CR: and 'if (!gState.isGameOn)' for false.
    // CR: I would do the if statement reverse: if (!gState.isGameOn) return;
    // CR: and then you don't need the else statement.
    if (gState.isGameOn === true) {
        //left mouse click
        if (event.which === 1) {
            if (currCell.isMarked) return;
            else {
                showCell(currCell, i, j);
                checkGameOver(gCurrLevel);
            }

        }

        //right mouse click
        if (event.which === 3) {

            if (currCell.isShown) {
                return;
            } else if (!currCell.isMarked) {
                currCell.isMarked = true;
                elCell = getClassName(currCell);
                gState.markedCount++;
                cellMarked(elCell);
                checkGameOver(gCurrLevel);

            } else {
                currCell.isMarked = false;
                elCell = getClassName(currCell);
                unMarkCell(elCell);
            }
        }

    } else return;
}

// CR: In the unMarkCell func you do the markedCount--
// CR: but in the cellMarked func you do it in the cellClicked func.
//Called on right click to mark a cell as suspected to have a mine
function cellMarked(elCell) {
    var elCurrCell = document.querySelector(`.${elCell}`);

    elCurrCell.innerHTML += FLAG_IMG;
}

// CR: The naming is not uniform:
// CR: cellMarked > cellUnmarked,
// CR: unMarkCell > markCell.
function unMarkCell(elCell) {

    var elCurrCell = document.querySelector(`.${elCell}`);
    elCurrCell.innerHTML = '';
    gState.markedCount--;

}

// Game ends when all mines are marked and all the other cells are shown
function checkGameOver(level) {
    var minesCount = gLevel[level].MINES;
    var size = gLevel[level].SIZE;
    var marked = gState.markedCount;
    var shown = gState.shownCount;

    // console.log('marked:', marked, 'shown:', shown);
    // console.log('minesCount:', minesCount, '(size * size) - minesCount)', (size * size) - minesCount);
    if (marked === minesCount && shown === (size * size) - minesCount) {
        gameOver();
        checkBestScore(gCurrLevel);
        // CR: I would put it in the gameOver func.
        changeEmogi(EMOGI_WIN);

    }
}

// CR: You have the i and j inside the elCell.
function showCell(elCell, i, j) {
    // CR: You can do it in one line:
    // CR: elCurrCell = document.querySelector(`.${getClassName(elCell)}`);
    var tempElCell = getClassName(elCell);
    var elCurrCell = document.querySelector(`.${tempElCell}`);

    // CR: Try to change the style with css classes and not inline style.
    if (elCell.isMine) { //red background for the mine
        elCurrCell.style = "background-color: red"
        // CR: I would put it in the gameOver func.
        changeEmogi(EMOGI_DEAD);

    } else {
        elCurrCell.style = "background-color: rgb(150, 149, 149)"
        elCell.isShown = true;
        gState.shownCount++;
    }

    if (elCell.minesAroundCount !== 0) {
        elCurrCell.innerText = `${elCell.minesAroundCount}`;
    }

    elCell.isShown = true;
    if (elCell.minesAroundCount === 0 && !elCell.isMine) expandShown(gBoard, elCell, i, j);
    // CR: You already checked it in the first if statement.
    // CR: You should do the gameOver() up there.
    if (elCell.isMine) gameOver();

}

//When user clicks an empty place (0 negs), 
//we need to open not only that cell, but also its neighbors.    

// CR: The function receives i and j arguments but they never used.
function expandShown(board, elCell, i, j) {
    //var minesCount = 0;
    var cell = board[elCell.i][elCell.j];

    for (var m = cell.i - 1; m <= cell.i + 1; m++) {

        if (m < 0 || m >= gBoard.length) continue;
        for (var n = cell.j - 1; n <= cell.j + 1; n++) {

            var innerCell = board[m][n];

            if (m === cell.i && n === cell.j) continue;
            if (n < 0 || n >= gBoard[0].length) continue;
            else {
                if (!innerCell.isMarked && !innerCell.isShown) {
                    var tempElCell = getClassName(innerCell);
                    var elCurrCell = document.querySelector(`.${tempElCell}`);
                    elCurrCell.style = "background-color: rgb(150, 149, 149)"
                    gState.shownCount++;
                    innerCell.isShown = true;
                    //console.log('shown count:', gState.shownCount);

                    if (innerCell.minesAroundCount !== 0) {

                        elCurrCell.innerText = `${innerCell.minesAroundCount}`;
                    }
                    if (innerCell.minesAroundCount === 0) {

                        expandShown(gBoard, innerCell, m, n)
                    }
                }
            }
        }
    }
    // CR: Unnecessary return.
    return;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function gameOver() {
    clearInterval(gTimeCount);
    //checkBestScore(gCurrLevel);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            // CR: You don't need the tempCurrCell and elCell variables in every round of the loop.
            // CR: You need to do it only if the currCell.isMine is true.
            var currCell = gBoard[i][j];
            var tempCurrCell = getClassName(currCell);
            var elCell = document.querySelector(`.${tempCurrCell}`);
            if (currCell.isMine) {
                // CR: Next line is unnecessary, so
                // CR: the line next to it could be '=' and not '+='
                elCell.innerHTML = ' ';
                elCell.innerHTML += MINE_IMG;

            } else {
                elCell.style = "background-color: rgb(150, 149, 149)"
                currCell.isShown = true;
                gState.shownCount++;

                if (currCell.minesAroundCount !== 0) {
                    elCell.innerText = `${currCell.minesAroundCount}`;
                }

                if (currCell.isMarked && currCell.minesAroundCount === 0 ) {
                    var elCurrCell = document.querySelector(`.${elCell}`);
                    elCurrCell.innerHTML = '';
                }

                currCell.isShown = true;
            }
        }
    }

    console.log('game over');
    gState.isGameOn = false;

    var elBtnRst = document.querySelector('.restart');
    elBtnRst.style.display = "block";

}


function restartGame(btn, gCurrLevel) {
    clearInterval(gTimeCount);
    setCurrLevel(btn)
    initGame(gCurrLevel);
    gState = {
        isGameOn: true, // boolean, when true we let the user play
        shownCount: 0, //how many cells are shown
        markedCount: 0, //how many cells are marked (with a flag)
        secsPassed: 0 //how many seconds passed
    }

    var elBtnRst = document.querySelector('.restart');
    elBtnRst.style.display = "none";

    gIsFirstClick = true;
    gTimeStart;
    gTimeCount = 0;
}


function calcCurrTime() {

    gGameDuration = (Date.now() - gTimeStart) / 1000;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGameDuration;

    return gGameDuration;
}


function changeEmogi(emogi) {
    var elEmoji = document.querySelector('.emogi');
    // CR: Next line is unnecessary.
    elEmoji.innerText = '';
    elEmoji.innerText = `${emogi}`;

}

function changeLevel() {

    var elRestart = document.querySelector('.restart');
    elRestart.innerHTML = '';
    elRestart.innerHTML = `<button class="restart" onclick="restartGame(this, ${gCurrLevel})" 
                            style="display: none">Restart</button>`
}

// CR: The function receives a currCell argument but it never used.
function addMines(level, board, currCell) {

    var addedMines = [];
    for (var x = 0; x < gLevel[level].MINES; x++) {
        
        // CR: Each cell has class name with i and j,
        // CR: so keep using it and don't switch to x and y.
        // CR: Use variable names like randI and randJ.
        var random1 = getRandomNumber(gLevel[level].SIZE);
        var random2 = getRandomNumber(gLevel[level].SIZE);
        
        for (var y = 0; y < addedMines.length; y++) {
            //console.log('added mine:', addedMines[y], 'added mines:', addedMines);

            if (addedMines[y].i === random1 && addedMines[y].j === random2) {
                random1 = getRandomNumber(gLevel[level].SIZE);
                random2 = getRandomNumber(gLevel[level].SIZE);

            }
        }
        var cell = board[random1][random2];
        cell.isMine = true;
        addedMines.push(cell);
    }

}

// CR: Unused function.
function checkDifferent() {
    for (var y = 0; y < addedMines.length; y++) {

        if (addedMines[y].i === random1 && addedMines[y].j === random2) {
            random1 = getRandomNumber(gLevel[level].SIZE);
            random2 = getRandomNumber(gLevel[level].SIZE);
            checkDifferent();

        }
    }

    return {
        random1, random2
    }
}

// CR: This func is not doing what it should.
// CR: It get as an argument the button element,
// CR: it then check the innerText which is.... 'Restart'
// CR: So it never goes inside any of the if statements
// CR: and it always return the gCurrLevel unchanged.
function setCurrLevel(btn) {
    if (btn.innerText === 'Easy') {
        gCurrLevel = 0;
    } else if (btn.innerText === 'Medium') {
        gCurrLevel = 1;
    } else if (btn.innerText === 'Hard') {
        gCurrLevel = 2;
    // CR: Unnecessary else statement.
    } else gCurrLevel;
    return gCurrLevel;
}

// CR: You never read the localStorage and set the bestScore.
// CR: Every refresh delete the score.
function checkBestScore(level) {

    //count game time
    var totalTime = gGameDuration;
    var elBest;

    if (level === 0 && (gBestEasy === null || totalTime < gBestEasy)) {
        gBestEasy = totalTime;
        //localStorage.setItem('best-score-L1', gBestEasy);
        localStorage.setItem('gBestEasy', gBestEasy);
        elBest = document.querySelector('.best1');
        elBest.innerText = `${localStorage.gBestEasy}`;
        return gBestEasy;
    }

    else if (level === 1 && (gBestMedium === null || totalTime < gBestMedium)) {
        gBestMedium = totalTime;
        //localStorage.setItem('best-score-L2', gBestMedium);
        localStorage.setItem('gBestMedium', gBestMedium);
        elBest = document.querySelector('.best2');
        elBest.innerText = `${localStorage.gBestMedium}`;
        return gBestMedium;
    }

    else if (level === 2 && (gBestHard === null || totalTime < gBestHard)) {
        gBestHard = totalTime;
        //localStorage.setItem('best-score-L3', gBestHard);
        localStorage.setItem('gBestHard', gBestHard);
        elBest = document.querySelector('.best3');
        elBest.innerText = `${localStorage.gBestHard}`;;
        return gBestHard;
    }
}

function getRandomNumber(max) {
    return Math.floor((Math.random() * 1000) + 1) % max;
}


//function that disables menu opening on right mouse click
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);
