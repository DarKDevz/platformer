var boxes = [];
class Box {
	constructor(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.clr = 0;
	this.oldX;
	this.oldY;
	console.log(this);
	}
	display() {
		this.oldX = this.x;
		this.oldY = this.y;
		fill(this.clr);
		rect(this.x,this.y,this.width ,this.height)
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
	onCollide() {}
}