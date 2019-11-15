/***************************************************
 * First javascript app project by Johan Lindström
 * "Labyrint Jakten" is a 2d maze game with a simple goal reach the end!
 * In the code you will find out how i Draw my gameMap, Player, Enemy
 * Make my player move around and much more!
 * This app is easy to expand to a bigger project, create more tiles with different functions, maybe a teleporter or some power ups??
 * Get creative and keep 
 * 
 */

// Original values tileW 40 tileH 40 ----
var tileW = 40, tileH = 40;
// Original values mapW 10 mapH 10 ---- 
var mapW = 15, mapH = 15;
var lastFrameTime = 0;
// We can use the locations in the array to create alot of different functions I use it to end the game when reaching the goal and colliding with an enemy.
var tileEvents = {
	208 : Goal,
	22	: enemyCollide
};

/**************
 * 30s timer 
 * Added timer for extra suspense and wanted a working ending
 * TIPS * Comment out the countDown function when working on the code so it dosen't interupt. 
 * 
var timeLeft = 30;

    var elem = document.getElementById('some_div');
    
    var timerId = setInterval(countdown, 1000);
    
    function countdown() 
    {
      if (timeLeft == 0) {
        clearTimeout(timerId);
        Defeat();
      } else {
        document.getElementById('some_div').innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
      }
      console.log(timeLeft);
    }*/

// Function that is called when the player is out of time.
function Defeat()
{
	alert('OUT OF TIME! YOU LOSE!');
	console.log('GG');
	location.reload();
}

// Function that is called when player lands on array location 208.
function Goal()
{
	alert('Congratulations! YOU WIN!');
	console.log('GG');
	location.reload();
}

// Function that is called when player collide with enemy. (Not really just triggers when at tile 28 in array)
function enemyCollide()
{
    //document.getElementById('alertBox');
	document.getElementById('alertBox') == alert('DEAD');
	alert('Ugh! You died! Press OK to restart!');
	console.log('GG');
	location.reload();
}

// floorTyper and tileTypes makes it easier to switch up the maze and add extra features in the future, explain more
var floorTypes = {
	solid	: 0,
	path	: 1,
	goal	: 1
}
// 
var tileTypes = {
	0 : { colour:"#222648", floor:floorTypes.solid	},
	1 : { colour:"#808080", floor:floorTypes.path	},
	2 : { colour:"#00ff00", floor:floorTypes.goal	},
}

var enemy = new enemy();
// Creating our character object with properties. Properties can be seen in the movement script.js
var player = new Character();

// Tag all keys as false from the beginning
var keysDown = 
{
	37 : false,
	38 : false,
	39 : false,
	40 : false
};

var x=45;
var y=45;
var velocity = 10;
// Giving the enemy object some properties (same as our player)
function enemy() {
	this.tileFrom	= [1,1];
	this.tileTo		= [1,1];
	this.timeMoved	= 0;
	this.dimensions	= [30,30];
	this.position	= [285,45]; // Starting position // use move the enemy?
	this.endPosition = [100,45];
    this.delayMove	= 300;

}

// Determine where our Character can go. That he is only allowed move on tiles = 0/path. In the beginning we can alter out map and create more path with diffrent tiles.
Character.prototype.canMoveTo = function(x, y)
{
	if(x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	if(tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.path){ return false; }
	return true;
};

Character.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
Character.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
Character.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
Character.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };

Character.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; };
Character.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; };
Character.prototype.moveUp		= function(t) { this.tileTo[1]-=1; this.timeMoved = t; };
Character.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; };


// This is called in the html onload in the body. It used to be window.onload = function{} which worked the same but caused some issues with using canvas.
function startGame()
{
	//ctx.clearRect(0, 0, canvas.width, canvas.height); Save for later use

	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(Draw);

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
function Draw() // Violation warning in console? "requestAnimationFrame took 55ms"
{
	var currentFrameTime = Date.now();

	if(!player.processMovement(currentFrameTime)) //
		{if(keysDown[38] && player.canMoveUp())			{ player.moveUp(currentFrameTime); }
		else if(keysDown[40] && player.canMoveDown())	{ player.moveDown(currentFrameTime); }
		else if(keysDown[37] && player.canMoveLeft())	{ player.moveLeft(currentFrameTime); }
		else if(keysDown[39] && player.canMoveRight())	{ player.moveRight(currentFrameTime); }
    }
    
	for(var y = 0; y < mapH; ++y)
	{
		for(var x = 0; x < mapW; ++x)
		{

			ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour; // Fills the tileTypes in the array

			ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
		}
	}
	// Draws the player with the dimensions given
	ctx.fillStyle = "#00ffff";
	ctx.fillRect(player.position[0], player.position[1],
		player.dimensions[0], player.dimensions[1]);
	// Draws the enemy with the dimensions given
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(enemy.position[0], enemy.position[1],
    enemy.dimensions[0], enemy.dimensions[1]);
	
	lastFrameTime = currentFrameTime;
	requestAnimationFrame(Draw);
}
// Used for debugging and finding specific locations in the array, you can do this manually but I'm sitting infront of my pc so why not.
console.log(gameMap);
