/***************************************************
 * First javascript app project by Johan Lindström
 * "Labyrint Jakten" is a 2d maze game with a simple goal reach the end!
 * In the code you will find out how I Draw my gameMap, player and enemy.
 * Make the player move using your arrow keys or the button displayed on screen!
 * This app is easy to expand into a bigger project, simply create more tiles with different functions, how about a teleporter or maybe some power ups??
 * 
 *
 * It can easily be scaled down/up by changing the mapW, mapH, tileW and tileH.
 * Also edit the width and height of the canvas to make sure everything fits the screen.
 * 
 */

// Original values tileW 40 tileH 40
var tileW = 40, tileH = 40;
// Original values mapW 10 mapH 10
var mapW = 15, mapH = 15;
var lastFrameTime = 0;
// We can use the locations in the array to create alot of different functions I use it to end the game when reaching the goal and colliding with an enemy.
var tileEvents = {
	208 : Goal,
	22	: enemyCollide
};

// Function that is called when the player is out of time.
function Defeat()
{
	alert('OUT OF TIME! YOU LOSE!'); // Displays an alert on screen when function is called
	console.log('timer = 0'); 	     // Debugging
	location.reload();				 // After you exit the alert box the page will reload as such the level repeat.
}

// Function that is called when player lands on array location 208.
function Goal()
{
	alert('Congratulations! YOU WIN!');	// Displays an alert on screen function is called
	console.log('GG');					// Debbuging
	location.reload();					// After winning the page still reloads and you are simply stuck playing the game forever.
}

// Function that is called when player collide with enemy. (Not really just triggers when at tile 22 in array)
function enemyCollide()
{
	alert('Ugh! You died! Press OK to restart!'); // This displays if you hit the enemy in the array index 22. So not really enemyCollide and just land on the array spot.
	console.log('collided with enemy');
	location.reload();							  // Reloading the page
}

// floorTyper and tileTypes makes it easier to switch up the maze and add extra features in the future.
var floorTypes = {
	solid	: 0,	// 0 = solid and player can not move through it.
	path	: 1,	// 1 = path and player can move on that space.
	goal	: 1 	// goal = 1 , It's still a path with a diffrent name for semantics. I can later on give that floorType a tileType in the array gameMap and style it diffrently. In my case i show it as a green goal at the end.
}
// It's easy just to add to this list when you want to add new tiles of different types to the gameMap array. In the Draw function we introduce that we want to fillStyle our tiles at the gameMap Index number.
var tileTypes = {
	0 : { colour:"#222648", floor:floorTypes.solid	},	// 0 = number given in gameMap, displaying as a solid darkblue wall.
	1 : { colour:"#808080", floor:floorTypes.path	},	// 1 = number given in gameMap, displaying as a path lightgray
	2 : { colour:"#00ff00", floor:floorTypes.goal	},	// 2 = number given in gameMap, display as a path and is green.
}

// Creating our character object with properties.
// Properties can be seen in the movement script.js
var player = new Character();


// Tag all keys as false from the beginning, making sure there is the keys are not pressed.
var keysDown = 
{
	37 : false,
	38 : false,
	39 : false,
	40 : false
};

var enemy = new enemy(); // Working on this, planned to do the enemy as i did the player

// Giving the enemy object some properties (same as our player)
function enemy() {
	this.dimensions	= [30,30]; // Dimensions for the enemy
	this.position	= [285,45]; // Starting position for the enemy
	this.endPosition = [100,45]; // End position for the enemy
}

/*
 *Enemy walking currenltly not working, CHECK THE enemyTest.html for an example on how i wanted to implement it.
 *
var startPos = [285, 45];
var endPos = [100, 45];
var dx = -3, dy = 0;
var x = startPos[0], y = startPos[1];
function drawEnemy() {
    ctx.fillStyle = "#ff0000";
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillRect(x, y, 30, 30);
    x += dx;
    y += dy;
    if (x < endPos[0] || x > startPos[0] ||
        y < endPos[1] || y > startPos[1] ) {
        dx = -dx;
        dy = -dy;
    }
    setTimeout(drawEnemy, 16); */


/**************
 * 30s timer 
 * Added timer for extra suspense and wanted a working ending
 * TIPS * Comment out the countDown function when working on the code so it dosen't interupt. 
 */
var timeLeft = 30; // Create a variable with the amount of time on the timer. (30s)

    var counter = document.getElementById('timeDiv');
    
    var timerId = setInterval(countdown, 1000); // Counts down 1 sec
    
    function countdown() 
    {
      if (timeLeft == 0) {
        clearTimeout(timerId);
        Defeat(); // if time reaches 0 call for the Defeat function which alerts the player lost and reloads the page.
      } else {
        document.getElementById('counterId').innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
      }
	  console.log(timeLeft); // debugging
	}
	

/* Quick background audio, restarts when time runs out or you win because the page reloads.
 *   Audio found at youtube free audio library
 */
var mySound = document.createElement('audio'); // variable my sound and the document.createElement() method that creates in my case the audio element for my background music.
mySound.src = 'bgMusic.mp3'; // Creating the link to the audio
mySound.play();	// is a function to play the audio

// Determine where our Character can go. That he is only allowed move on tiles = 0/path. In the beginning we can alter our map and create more path with diffrent tiles.
Character.prototype.canMoveTo = function(x, y)
{
	if(x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	if(tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.path){ return false; }
	return true;
};
/************
 * Creating four methods to see if the Character can move Up, Down, Left, and Right. 
 * These methods will simply call the canMoveTo method, passing as arguments the Characters current position (tileFrom) with the x or y values modified according to the direction we're trying to move in, and return the result:
 */
Character.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
Character.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
Character.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
Character.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };
/************
 * For improved readability when we actually set a destination (tileTo) for a Character,
 * we add a method for each direction which simply take the current game time (in milliseconds) as their argument, 
 * and modify the tileTo x or y properties as needed for the target direction. The timeMoved value for the Character is also updated to the passed game time
 */
Character.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; };
Character.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; };
Character.prototype.moveUp		= function(t) { this.tileTo[1]-=1; this.timeMoved = t; };
Character.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; };


// This is called in the html onload in the body. It used to be window.onload = function{} which worked the same but caused some issues with using canvas. This is what works for me now and is stable.
function startGame()
{
	ctx = document.getElementById('game').getContext("2d"); // Whithout this we don' get the context we draw everything with and displays it on the id we have on the canvas in out html file.
	requestAnimationFrame(Draw);
	// We'll add eventListeners for the keydown and keyup events to turn the flags in the keysDown map on or off (true or false) if the keys pressed/released are the arrow keys
	window.addEventListener("keydown", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
	});
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
	});
	Draw();
};
// Erase function for the meny im working on may or may not be used, currently not doing anything right now.
function erase() 
{
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 600, 600);
}

// Big part of the script. Draws the gameMap/player/enemy and allows player movement
function Draw() // Violation warning in console?? "requestAnimationFrame took 55ms" 
{
	var currentFrameTime = Date.now();
	// Allows movement if the key is pressed and the player can move in that direction.
	if(!player.processMovement(currentFrameTime)) //
		{if(keysDown[38] && player.canMoveUp())			{ player.moveUp(currentFrameTime); }
		else if(keysDown[40] && player.canMoveDown())	{ player.moveDown(currentFrameTime); }
		else if(keysDown[37] && player.canMoveLeft())	{ player.moveLeft(currentFrameTime); }
		else if(keysDown[39] && player.canMoveRight())	{ player.moveRight(currentFrameTime); }
    }
	//Loops our array at the x, y axis (row = x and column = y).
	for(var y = 0; y < mapH; ++y)
	{
		for(var x = 0; x < mapW; ++x)
		{
			ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour; // (ctx) fill colour to the colour corresponding to the gameMap array tile value found at the index returned from the toIndex method for the current x,y loop values in the tileTypes array!

			ctx.fillRect( x*tileW, y*tileH, tileW, tileH); // Fills the arrat with the tileW & tileH variables given in the beginning
		}
	}
	// Draws the player with the dimensions given
	ctx.fillStyle = "#00ffff"; 							// Color of the rectangle
	ctx.fillRect(player.position[0], player.position[1],// Fills the rectangle of the players dimensions in its position
		player.dimensions[0], player.dimensions[1]);

	// Draws the enemy with the dimensions given
	ctx.fillStyle = "#ff0000"; 						  	// Color of the rectangle
	ctx.fillRect(enemy.position[0], enemy.position[1],  // Fills the rectangle of the enemys dimension where its positions at
    	enemy.dimensions[0], enemy.dimensions[1]);
	
	lastFrameTime = currentFrameTime;
	requestAnimationFrame(Draw);
}
// Used for debugging and finding specific locations in the array, you can do this manually but I'm sitting infront of my pc so why not.
console.log(gameMap);
