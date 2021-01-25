class GameObject {
	constructor(x,y,tag) {
	this.x = x;
	this.y = y;
	this.tag = tag;
	}
	getValues() {
	return [this.x,this.y];
	}
	getValuesName() {
	return ["x","y"];
	}
	getActualValuesName() {
	return ["x","y"];
	}
	display() {
	
	}
	collision(obj) {
	
	}
	update() {
	
	}
	earlyUpdate() {

	}
	lateUpdate() {

	}
	customDraw() {
	point(this.x,this.y)
	}
}