class Box {
	constructor(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.clr = 0;
	}
	show() {
	fill(this.clr);
	rect(this.x,this.y,this.w,this.h)
	}
	pressed() {
	return this.x < mouseX && this.x + this.w > mouseX && this.y < mouseY && this.y + this.h > mouseY
	}
}