// // Add your global data structure: gBalloons – this is our model!
// // a. This should be an array of balloons objects
// // b. Each object should have ‘bottom’ and ‘speed’ properties

// // var gBalloons = [{bottom: '', speed: 0}, {bottom: '', speed: 0}]; 


// // In Javascript, when page loads, select the balloons
// // (querySelectorAll) and make each one of them move up a bit
// // by setting their style.bottom in an interval



var gBalloons = [];

init();

function init() {
    var elBalloons = document.querySelectorAll('.balloon');
    for (var i = 0; i < elBalloons.length; i++) {
        var elBalloon = elBalloons[i];
        gBalloons[i] = {
            bottom: 0,
            speed: (i*10)+10
        };
        raiseBalloon(i, elBalloon);
    }
}

function raiseBalloon(i, elBalloon) {
    var interval = setInterval(function () {
        
        //update model
        gBalloons[i].bottom += gBalloons[i].speed;

        //update DOM
        elBalloon.style.bottom = gBalloons[i].bottom + 'px';
    
        if (gBalloons[i].bottom >= 800) {
            clearInterval(interval);
            console.log('Done');
            
        }
    }, 300);
}

function popBalloon(elBalloon) {
    var popingSound = new Audio('sound/Sound.mp3');
    popingSound.play();
    elBalloon.style.opacity = 0;
}


