class End extends Box{
	constructor(x,y,w,h) {
	super(x,y,w,h);
	}
	display() {
		this.oldX = this.x;
		this.oldY = this.y;
		fill(255,255,0);
		rect(this.x,this.y,this.width ,this.height)
	}
	onCollide() {
		levels[activeLevel + 1].loadLevel();
	}
}