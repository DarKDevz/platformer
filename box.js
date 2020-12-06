var boxes = [];
function addBox(x,y,w,h) {
	let t_box = new Box(x, y, w, h);
	t_boxes.push(t_box);
}
class Box extends GameObject{
	constructor(x,y,w,h) {
	super(x,y,"Box");
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
	collision(obj) {
		var oX,oY,oW,oH;
		if(obj.pos !== undefined) {
		oX = obj.pos.x;
		oY = obj.pos.y;
		}
		else {
		oX = obj.x;
		oY = obj.y;
		}
		if(obj.size !== undefined) {
		oW = obj.size.x;
		oH = obj.size.y;
		}
		else {
		oW = obj.width;
		oH = obj.height;
		}
		let rect2 = {
		x: oX,
		y: oY,
		width: oW,
		height: oH,
		}
		let collides = collide(this, rect2);
		if(collides) this.onCollide();
		return collides;
	    }
//	update() {}
	onCollide() {}
}