class movingPlatform extends Box{
	constructor(x,y,w,h,id,x1,x2) {
		super(x,y,w,h);
		this.id = id
		this.direction = "r";
		this.x1 = x1;
		this.x2 = x2;
	}
	update() {
		let t_player = {
		x: player.pos.x,
		y: player.pos.y + 1,
		width: player.size.x,
		height: player.size.y,
		}
		let ground;
		if(this.x < this.x2 && this.direction == "r"){this.x += 3;
		ground = collide(this, t_player);}
		else {
		 this.direction = "l";}
		if(this.direction == "l"){
		this.x -= 3;
		}
		if(this.x < this.x1) this.direction = "r";
		if(player.grounded && player.groundedId == this.id && !player.colliding) {player.pos.x -= (this.oldX - this.x)}
	}
	direction() {
	}
}