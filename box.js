var boxes = [];
class Box extends GameObject{
	constructor(x,y,w,h) {
	super(x,y);
	this.width = w;
	this.height = h;
	this.clr = 0;
	this.oldX;
	this.oldY;
	}
	display() {
		this.oldX = this.x;
		this.oldY = this.y;
		fill(this.clr);
		rect(this.x,this.y,this.width ,this.height);
		this.update();
	}
	collision() {
		let rect2 = {
		x: player.pos.x,
		y: player.pos.y,
		width: player.size.x,
		height: player.size.y,
		}
		let collides = collide(this, rect2);
		this.clr = collides * 125;
		if(collides) this.onCollide();
		return collides;
	    }
//	update() {}
	onCollide() {}
}