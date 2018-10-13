"use strict";

const MINE_IMG = '<img src="img/mine.png">';
const FLAG_IMG = '<img src="img/flag.png">';

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
// CR: like: gState.isGameOn, gState.shownCount, gTimeStart....
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

//Called when a cell (td) is clicked

function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];

    if (gIsFirstClick) {

        //TODO: load after first click

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

//Called on right click to mark a cell as suspected to have a mine

function cellMarked(elCell) {
    var elCurrCell = document.querySelector(`.${elCell}`);

    elCurrCell.innerHTML += FLAG_IMG;
}

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
        changeEmogi(EMOGI_WIN);

    }
}


function showCell(elCell, i, j) {

    var tempElCell = getClassName(elCell);
    var elCurrCell = document.querySelector(`.${tempElCell}`);

    if (elCell.isMine) { //red background for the mine
        elCurrCell.style = "background-color: red"
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
    if (elCell.isMine) gameOver();

}

//When user clicks an empty place (0 negs), 
//we need to open not only that cell, but also its neighbors.    

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
            var currCell = gBoard[i][j];
            var tempCurrCell = getClassName(currCell);
            var elCell = document.querySelector(`.${tempCurrCell}`);
            if (currCell.isMine) {

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
    elEmoji.innerText = '';
    elEmoji.innerText = `${emogi}`;

}

function changeLevel() {

    var elRestart = document.querySelector('.restart');
    elRestart.innerHTML = '';
    elRestart.innerHTML = `<button class="restart" onclick="restartGame(this, ${gCurrLevel})" 
                            style="display: none">Restart</button>`
}

function addMines(level, board, currCell) {

    var addedMines = [];
    for (var x = 0; x < gLevel[level].MINES; x++) {

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

function setCurrLevel(btn) {

    if (btn.innerText === 'Easy') {
        gCurrLevel = 0;
    } else if (btn.innerText === 'Medium') {
        gCurrLevel = 1;
    } else if (btn.innerText === 'Hard') {
        gCurrLevel = 2;
    } else gCurrLevel;
    return gCurrLevel;
}

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
