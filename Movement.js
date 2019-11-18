//This character class will store information about the player 
function Character()
{
	this.tileFrom	= [1,1];	// Coordinate player is moving from
	this.tileTo		= [1,1];	// Coordinate player is moving to
	this.timeMoved	= 0;		// The time at which the player started to move. In milliseconds
	this.dimensions	= [30,30];	// The dimensions of the player 30x30px
	this.position	= [45,45];	// Position of the player in px
	this.delayMove	= 300;		// The time it will take to move 1 tile. I messed around and 300ms seems to be an okay speed.
}
/**********
 * Our function takes two arguments; the x and y position of the destination tile.
 * It then updates the tileFrom and tileTo properties to the new tile coordinates, and
 * calculates "the true" pixel position of the character using the following method:
 * [character position] = [
 *	(([tile width] x [destination X coord]) + (([tile width] - [character width]) / 2)),
 *	(([tile height] x [destination Y coord]) + (([tile height] - [character height]) / 2))
 * ];
 * 
 * 
 */
Character.prototype.placeAt = function(x, y)
{
	this.tileFrom	= [x,y];
	this.tileTo		= [x,y];
	this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)), 
		((tileH*y)+((tileH-this.dimensions[1])/2))];
};
/***********
 * If our player is moving we need to calculate each frame to find the true position.
 * If the tileFrom is the same as tileTo we know that the player is not currently moving and return
 */
Character.prototype.processMovement = function(t)
{
	if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; } // We check if the tileFrom && tileTo is equal with eachother if it is then we are not moving

	if((t-this.timeMoved)>=this.delayMove) //We'll next check if the amount of time that has passed since the Character began its current movement is equal to or longer than the amount of time it takes this Character to move 1 tile. If it is, we set the Characters position to its destination tile using the placeAt method:
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);

		if(typeof tileEvents[toIndex(this.tileTo[0], this.tileTo[1])]!='undefined')
		{
			tileEvents[toIndex(this.tileTo[0], this.tileTo[1])](this);
		}
	}
	else //If the above checks let us know that the Character is in fact still moving, we'll need to accurately calculate its current position on the canvas. To start with, we can calculate the position of the tile the Character is moving from (tileFrom).
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] != this.tileFrom[0]) //Then, starting with the horizontal, or x coordinate, we'll see if the Character is moving on this axis. If so, we calculate the number of pixels they have moved by dividing the width of a tile by the time it takes the Character to move 1 tile, and multiplying the result by the amount of time that has passed since the Character began moving:
		{
			var diff = (tileW / this.delayMove) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff); //[distance moved] = ([tile width] / [time to move 1 tile]) x ([current time] - [time movement began])
		}
		if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / this.delayMove) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}
		// After we've updated the position, we'll round the x and y values to the nearest whole number.
		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}

	return true; // We can now close this function and return true, to let the code that called this function know that the Character is currently moving.
}
/*************************
 * // We'll also have to make some changes to our window onload function and our drawGame function. 
 * Before we do that, we'll create a simple function to make some of our code more readable which will convert a coordinate (x, y) to the corresponding index in the gameMap array.
 */

function toIndex(x, y)
{
	return((y * mapW) + x);
}