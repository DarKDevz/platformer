class movingPlatform extends Box{
	constructor(x,y,w,h,x1,x2) {
		super(x,y,w,h);
		this.direction = "r";
		this.x1 = x1;
		this.x2 = x2;
		this.typeId = 2;
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
		let t_player = {
		x: player.old.x,
		y: player.old.y + 1,
		width: player.size.x,
		height: player.size.y,
		}
		let ground;
		ground = this.collision(t_player);
		if(ground && !player.colliding) {player.pos.x -= (this.oldX - this.x)}
	}
	update() {
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