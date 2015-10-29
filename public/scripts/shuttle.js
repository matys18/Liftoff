/*
	Helper function used for eg smoke of the rocket.
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
	Checks if the rocket colided with any rocks. Essentialy a box collider.
*/
var colissionCheck = function(rocks){
	
	for (var i = 0; i < rocks.length; i++){
		var rect1 = {x: shuttle.x, y: shuttle.y, width: shuttle.width, height: shuttle.height};
		var rect2 = {x: rocks[i].x, y: rocks[i].y, width: rocks[i].width, height: rocks[i].height};
		if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
			return true;
		}
	}

	return false;
}

/*
	The Game "class". Contains functions for running the game.
*/
var Game = function(shuttle, rocks, particles){

	var self = this; // I use this to make it easier for myself, because I keep writing self instead of this due to python.

	self.score = 0;
	self.topScore = 0;
	self.running = false;
	self.paused = false;

	self.drawScore = function(){
		ctx.fillStyle = "white";
		ctx.font = "30px Comic Sans MS";
		var textWidth = ctx.measureText(this.score);
		ctx.fillText(this.score, width/2 - textWidth.width/2, 50);
	}

	self.assets = {
		shuttleSprite:false,
		rockSprite:false
	};

	self.loading= function(){
		var arrayLength = 0;
		var noLoaded = 0;
		for (var key in self.assets) {
		  if (self.assets.hasOwnProperty(key)) {
		    arrayLength++;
		    if (self.assets[key] == true){
		    	noLoaded++;
		    }
		  }
		}

		if (noLoaded == arrayLength) {
			console.log('game loaded');
			return false;
			//animationId = requestAnimationFrame(init);
		} else {
			console.log('game still loading');
			return true;
		}
	};

	self.animationId;

	self.startGame = function(){
		console.log('test', self.loading());
		if (self.loading() == false) {
			self.running = true;
			self.animationId = requestAnimationFrame(self.loop);
			return;
		} else {
			setTimeout(function(){
				self.startGame();
			}, 1000);
		}
	}

	self.endGame = function(){
		
		if (self.topScore< self.score) {
			self.topScore = self.score;
			document.getElementById('topScore').innerHTML = 'Top Score: ' + self.score;
		}

		self.score = 0;
		self.running = false;
		shuttle.x = (width / 2) - (shuttle.width / 2);
		rocks = createObsticles(shuttle);
	}

	self.pause = function(){
		if (self.paused == false){
			window.cancelAnimationFrame(self.animationId);
			self.paused = true;
		} else if (self.paused == true) {
			self.animationId = requestAnimationFrame(self.loop);
			self.paused = false;
		}
	}

	self.restart = function(){
		self.endGame();
		self.startGame();
	}

	self.loop = function(){
		ctx.clearRect(0, 0, width, height);

		if (self.score > 50) {
			for (var i = 0; i < rocks.length; i++){
				rocks[i].moveRock();
				rocks[i].draw();
			}

		}

		shuttle.draw();

		for (var i = 0; i < particles.length; i++){
			particles[i].move();
			particles[i].draw();

		}

		self.score++;
		game.drawScore();

		if (colissionCheck(rocks) == true) {
			self.endGame();
			window.cancelAnimationFrame(self.animationId);
		} else {
			self.animationId = requestAnimationFrame(self.loop);
		}

	}
}

/*
	The Shuttle class contains the Rocket objects and it's parameters.
*/
var Shuttle = function(rocks, particles){

	var self = this;

	self.sprite = new Image();
	self.sprite.src = 'public/images/shuttle.svg';
	self.sprite.addEventListener('load', function(){
		game.assets.shuttleSprite = true;
	});
	self.width = width * 0.075;
	self.height = height * 0.14;
	self.x = (width / 2) - (this.width / 2);
	self.y = height / 2;

	self.move = function(pos){
		var moveAmmount = width * 0.01;
		if (self.x + moveAmmount <= (width - self.width) && pos == true) {
			self.x += moveAmmount;
		} else if (self.x - moveAmmount >= 0 && pos == false) {
			self.x -= moveAmmount;
		} else if (self.x + moveAmmount > width - self.width && self.x < width - self.width && pos == true) {
			self.x = width - self.width;
		} else if (this.x - moveAmmount < 0 && self.x > 0 && pos == false) {
			self.x = 0;
		}
	}

	self.draw = function(){
		ctx.drawImage(self.sprite, self.x, self.y, self.width, self.height);
	}

}

/*
	The smoke class is used to create the smoke circles for the rocket's exausht.
*/
var Smoke = function(shuttle){

	var self = this;

	self.radius = shuttle.width / 1.5;
	self.x = shuttle.x + shuttle.width/2 + getRandomInt(-shuttle.width*0.5, shuttle.width*0.5);
	self.y = getRandomInt(shuttle.x + shuttle.height * 2, height);

	self.color = 'rgba(255,'+ getRandomInt(100,204) + ', 0, 0.5)';

	self.move = function(){
		if (self.y > height){
	    	self.x = shuttle.x + shuttle.width/2 + getRandomInt(-shuttle.width*0.5, shuttle.width*0.5);
	    	self.y = shuttle.y + shuttle.height + getRandomInt(-shuttle.width, shuttle.width * 0.1);
	    	self.radius = shuttle.width / 1.5;
	    } else {
	    	self.x += getRandomInt(-width * 0.02, width * 0.02);
	    	self.y += height * 0.01;
	    	self.radius += shuttle.width / 30;
	    }

	    if (self.y > height * 0.75) {
	    	var color = getRandomInt(200,230);
	    	self.color = 'rgba('+color+','+color+','+color+', 0.5)';
	    } else {
	    	var color = getRandomInt(140,204);
	    	self.color = 'rgba(255,'+ color + ', 0, 0.5)';
	    }

	}

	self.draw = function(){
		ctx.beginPath();
		ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, true);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
}

/*
	The rock "class". Used to create the obsticles. Contains their position etc.
*/
var Rock = function(shuttle){

	var self = this;

	self.sprite = new Image();
	self.sprite.src = 'public/images/rock.png';
	self.sprite.addEventListener('load', function(){
		game.assets.rockSprite = true;
	});
	self.height = width * 0.06;
	self.width = width * 0.06;
	self.x = getRandomInt(0, (width - self.width));
	self.y = 0 - self.height;

	this.moveRock = function(){
		if (self.y > height) {
			self.x = getRandomInt(0, (width - self.width));
			self.y = 0 - self.height;
		} else {
			self.y += height * 0.018;
		}
	}

	this.draw = function(){
		ctx.drawImage(self.sprite, self.x, self.y, self.width, self.height);
	}
}

/*
	Creates and populates an array with obsticles.	
*/
var createObsticles = function(relativeObj){
	var rocks = [];
	var noRocks = 6;
	for (var i = 0; i < noRocks; i++){
		rocks.push(new Rock(relativeObj));
		if (i >= noRocks/2) {
			rocks[i].y = (-height / 2) - rocks[2].height;
		}
	}
	return rocks;
}

/*
	Creates and populates an array with smoke particles.	
*/
var createParticles = function(relativeObj){
	var particles = [];
	var noParticles = 100;
	for (var i = 0; i < noParticles; i++){
		particles.push(new Smoke(relativeObj));
	}
	return particles;
}

/*
	Maniputaes the DOM and actually runs the functions defined above.
*/
var width = 400; // main var
var height = 700; //main var
var canvas = '<canvas id="myCanvas" height="'+ height +'" width="'+ width +'"></canvas>'; // main var
document.getElementById('global-container').style.height = height;
document.getElementById('global-container').style.width = width;
document.getElementById('global-container').innerHTML = canvas;
var c = document.getElementById("myCanvas"); // main var
var ctx = c.getContext("2d");

ctx.font = "30px Source Sans Pro";
ctx.fillStyle = 'lightgrey';
ctx.fillText('Click R to Start!', 110, 300);

var shuttle = new Shuttle();
var rocks = createObsticles(shuttle);
var particles = createParticles(shuttle);
var game = new Game(shuttle, rocks, particles);