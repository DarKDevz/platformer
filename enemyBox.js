class Enemy extends Box{
	constructor(x,y,w,h) {
	super(x,y,w,h);
	this.tag = "enemyBox";
	this.typeId = 4;
	}
	getClassName() {
	return "Enemy"
	}
	display() {
		this.oldX = this.x;
		this.oldY = this.y;
		fill(255,0,0);
		rect(this.x,this.y,this.width ,this.height)
	}
	earlyUpdate() {
		if(this.collision(player))  {
		player.playerDeath();
		}
	}
}