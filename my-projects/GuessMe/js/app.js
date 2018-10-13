'use strict';

var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
var gLastRes = null;

const LS_KEY = 'guess-me-tree';

$(document).ready(init);

function init() {
    // gQuestsTree = loadFromLocalStorage(LS_KEY);
    gQuestsTree = createQuest('Male?');

    gQuestsTree.yes = createQuest('Gandhi');
    gQuestsTree.no = createQuest('Rita');

    gCurrQuest = gQuestsTree;
   
}

function startGuessing() {
    // TODO: hide the gameStart section
    $('.gameStart').hide();
    renderQuest();
    // TODO: show the gameQuest section
    $('.gameQuest').show();
}

function renderQuest() {
    // TODO: select the <h2> inside gameQuest and update its text by the currQuest text
    $('.gameQuest > h2').html(gCurrQuest.txt);
}

function userResponse(res) {

    $('img').addClass('animated tada');
    setTimeout(function () {
        $('img').removeClass('animated tada');;
    }, 1000)
    
    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            alert('Yes, I knew it!');
            $('.gameQuest').hide();
            $('.gameGieneWins').show();
            saveToLocalStorage(LS_KEY, gQuestsTree);
            // TODO: improve UX
        } else {
            alert('I dont know...teach me!');
            // TODO: hide and show gameNewQuest section
            $('.gameQuest').hide();
            $('.gameNewQuest').show();

    
        }
    } else {
        // TODO: update the prev, curr and res global vars
        gPrevQuest = gCurrQuest;
        gCurrQuest = gCurrQuest[res];
        gLastRes = res;
        renderQuest();
    }
}

function addGuess() {
    // TODO: create 2 new Quests based on the inputs' values
    // TODO: connect the 2 Quests to the quetsions tree

    var newQuest = createQuest($('#newQuest').val());
    newQuest['yes'] = createQuest($('#newGuess').val());
    newQuest['no'] = gCurrQuest;
    gPrevQuest[gLastRes] = newQuest;

    saveToLocalStorage(LS_KEY, gQuestsTree);

    // console.log(newQuest);
    // console.log(gPrevQuest[gLastRes]);

    restartGame();
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function restartGame() {
    $('.gameNewQuest').hide();
    $('.gameQuest').hide();
    $('.gameStart').show();
    $('.gameGieneWins').hide();
    gCurrQuest = loadFromLocalStorage(LS_KEY);
    gPrevQuest = null;
    gLastRes = null;
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}