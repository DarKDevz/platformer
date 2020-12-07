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
	if(this.x < this.x2 && this.direction == "r"){this.x += 3;
	}
	else {
	 this.direction = "l";}
	if(this.direction == "l"){
	this.x -= 3;
	}
	if(this.x < this.x1) this.direction = "r";
	}
}