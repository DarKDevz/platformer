var boxes = [];
class Box extends GameObject{
	constructor(x,y,w,h) {
	super(x,y,"Box");
	this.width = w;
	this.height = h;
	this.clr = 0;
	this.oldX;
	this.oldY;
	this.typeId = 0;
	this.isCollidable = true;
	}
	getValuesName() {
	return [...super.getValuesName(),"width","height"];
	}
	getValues() {
	return [...super.getValues(),this.width,this.height]
	}
	getActualValuesName() {
	return [...super.getActualValuesName(),"width","height"]
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
	customDraw() {
		super.customDraw()
		stroke(0,0,255);
		line(this.x+this.width/2,this.y+this.height/2,this.x+this.width/2-30,this.y+this.height/2);
		stroke(255,0,0);
		line(this.x+this.width/2,this.y+this.height/2,this.x+this.width/2,this.y+this.height/2-30);
		stroke(0);
	}
//	update() {}
	onCollide() {}
}