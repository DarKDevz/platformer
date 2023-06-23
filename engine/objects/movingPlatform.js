class movingPlatform extends Box{
	constructor(x,y,w,h,x1,x2) {
		super(x,y,w,h);
		this.direction = "r";
		this.x1 = x1;
		this.x2 = x2;
		this.typeId = 2;
	}
	getClassName() {
	return "movingPlatform"
	}
	offSet(x,y,diffX=0,diffY=0) {
	this.x1 += diffX;
	this.x2 += diffX;
	super.offSet(x,y);
	}
	getValues() {
	return [...super.getValues(),this.x1,this.x2];
	}
	getValuesName() {
	return [...super.getValuesName(),"placeX1","placeX2"];
	}
	getActualValuesName() {
	return [...super.getActualValuesName(),"x1","x2"]
	}
	earlyUpdate() {
		if(player.grounded && player.groundedId === this.uuid) {player.pos.x -= (this.oldX - this.x)}
	}
	lateUpdate() {
	if(this.x+this.width < this.x2 && this.direction == "r"){this.x += 3;
	}
	else {
	 this.direction = "l";}
	if(this.direction == "l"){
	this.x -= 3;
	}
	if(this.x < this.x1) this.direction = "r";
	}
	customDraw() {
		stroke(0,0,255);
		line(this.x+this.width/2,this.y+this.height/2,this.x1,this.y+this.height/2);
		stroke(255,0,0);
		line(this.x+this.width/2,this.y+this.height/2,this.x2,this.y+this.height/2);
		stroke(0);
	}
}