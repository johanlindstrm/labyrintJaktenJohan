
function Character()
{
	this.tileFrom	= [1,1];
	this.tileTo		= [1,1];
	this.timeMoved	= 0;
	this.dimensions	= [30,30];
	this.position	= [45,45];
	this.delayMove	= 300;
}
Character.prototype.placeAt = function(x, y)
{
	this.tileFrom	= [x,y];
	this.tileTo		= [x,y];
	this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
		((tileH*y)+((tileH-this.dimensions[1])/2))];
};
Character.prototype.processMovement = function(t) // Math getting the player to move 
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

// Not working at the moment, I'm trying
Character.prototype.buttonMove = function() {
    
			var toX = player.x + x, toY = player.y + y;
			if (gameMap[toY][toX] === '1' || gameMap[toY][toX] === '2') {
				player.x = toX;
				player.y = toY;
			}
		
		
		document.getElementById('button-up').onclick = function () {
			playerMove(0, -1);
		};
		document.getElementById('button-down').onclick = function () {
			playerMove(0, 1);
		};
		document.getElementById('button-right').onclick = function () {
			playerMove(1, 0);
		};
		document.getElementById('button-left').onclick = function () {
			playerMove(-1, 0);
		};
		
	}

function toIndex(x, y)
{
	return((y * mapW) + x);
}