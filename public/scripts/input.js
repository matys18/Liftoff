var interval; // Used for moving the rocket when a button is held down.

/* 
    This function listens for keypresses (A, D, R, P) and does their respective functions.
*/
document.onkeydown = function(e){
	e = e || window.event;

    if (e.keyCode == '82' && game.running == false) {
        //left
        game.startGame();
    }

    if (e.keyCode == '81' && game.running == true) {
        //left
        game.pause();
    }

    if (e.keyCode == '65' && game.running == true) {
        clearInterval(interval);
    	//left
		interval = setInterval(function(){
			shuttle.move(false);
		}, 5);
    }
    else if (e.keyCode == '68' && game.running == true) {
    	// right
        clearInterval(interval);
    	interval = setInterval(function(){
			shuttle.move(true);
		}, 5);
    }
}

/* 
    This function listens for keyups and cancels the movement interval functionb thus stopping the rocket movement.
*/
document.onkeyup = function(e){
	e = e || window.event;

    if (e.keyCode == '65') {
    	//left
		clearInterval(interval);
    }
    else if (e.keyCode == '68') {
    	// right
		clearInterval(interval);
    }
}