class End extends Box{
	constructor(x,y,w,h) {
	super(x,y,w,h);
	this.tag = this.name;
	this.typeId = 1;
	}
	getClassName() {
	return "End"
	}
	display() {
		this.oldX = this.x;
		this.oldY = this.y;
		fill(255,255,0);
		rect(this.x,this.y,this.width ,this.height)
	}
	earlyUpdate() {
		if(this.collision(player))  {
		if( engine.scene[engine.activeScene + 1] !== undefined)
			 engine.scene[engine.activeScene + 1].loadLevel();
		else{
			addLevel([],createVector(0,-500)).loadLevel();
		}
		}
	}
}
