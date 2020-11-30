class movingPlatform extends Box{
	constructor(x,y,w,h,id) {
		super(x,y,w,h);
		this.id = id
	}
	update() {
		let t_player = {
		x: player.pos.x,
		y: player.pos.y + 1,
		width: player.size.x,
		height: player.size.y,
		}
		let ground
		let dirpos = this.direction();
		if(this.x < 500){this.x += 3;
		ground = collide(this, t_player);}
		else {this.x = 0}
		if(player.grounded && player.groundedId == this.id && !player.colliding) {player.pos.x -= (this.oldX - this.x)}
	}
	direction() {
	}
}