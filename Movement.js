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
 * placeAt allows me to place the player on the specific position
 * The horizontal and vertical positions of the character are th
 * Character position:
 * (Tile X * Tile Width) + (Horizontal diff./2),
 * (Tile Y * Tile Height) + (Vertical diff./2)
 * 
 * Our function takes two arguments; the x and y position of the destination tile.
 * It then updates the tileFrom and tileTo properties to the new tile coordinates, and
 * calculates the pixel position of the character using the following method:
 * [character position] = [
 *	(([tile width] x [destination X coord]) + (([tile width] - [character width]) / 2)),
 *	(([tile height] x [destination Y coord]) + (([tile height] - [character height]) / 2))
 * ];
 * 
 * Clean up explanation
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
	if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; }

	if((t-this.timeMoved)>=this.delayMove)
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);

		if(typeof tileEvents[toIndex(this.tileTo[0], this.tileTo[1])]!='undefined')
		{
			tileEvents[toIndex(this.tileTo[0], this.tileTo[1])](this);
		}
	}
	else
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] != this.tileFrom[0])
		{
			var diff = (tileW / this.delayMove) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
		if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / this.delayMove) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}

		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}

	return true;
}
// All this allows for the buttery smooth movement i was aimning for

function toIndex(x, y)
{
	return((y * mapW) + x);
}