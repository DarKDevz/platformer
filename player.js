var player;
class Player {
	constructor() {
	this.pos=createVector(400,-1000);
	this.size=createVector(30,70);
	this.vel= createVector(0,0);
	this.old= createVector(0,0);
	this.cameraPos = this.pos.copy();
	this.draw=true;
	this.xdir= 0;
	this.grounded= false;
	this.colliding= false;
	this.collidedId= null;
	this.yvel= 1;
	this.xvel= 0;
	}
display (){
	fill(0)
	if(draw) rect(this.pos.x,this.pos.y,this.size.x,this.size.y);
	text("vx= " + round(this.vel.x),50,50);
	text("vy= " + round(this.vel.y),50,60);
	text("x= " + round(this.pos.x),50,70);
	text("y= " + round(this.pos.y),50,80);
	text("oy= " + round(this.old.y),50,90);
	text("ox= " + round(this.old.x),50,100);
	text("ground= " + (this.grounded),50,110);
	text("colliding= " + (this.colliding),50,120);
	text("id= " + (this.collidedId),50,130);
	text("surface x=" + (this.surface),50,140);
	}
update (){
	this.old = this.pos.copy();
	//controlller
	//Space
	if (keyIsDown(87) && this.grounded) {
		this.grounded = false;
		this.colliding = false;
		this.vel.y = -6.7;
		}
	if (keyIsDown(65)) {
   			this.vel.x -= 5;
	}
 	if (keyIsDown(68)) {
   			this.vel.x += 5;
		}
	if (keyIsDown(65) && keyIsDown(16)) {
   			this.vel.x -= 2;
	}
 	if (keyIsDown(68) && keyIsDown(16)) {
   			this.vel.x += 2;
		}
	if(keyIsDown(83)) {
		let SizeY = this.size.y;
		this.size.y = lerp(this.size.y, 45, .5);
		this.pos.y -= this.size.y - SizeY;
		}else if(this.size.y != 70) {
		let SizeY = this.size.y;
		this.size.y = lerp(this.size.y, 70, .5);;
		this.pos.y -= this.size.y - SizeY;
		}
	//Y vel
	if(this.grounded) this.vel.y = 0;
	else {this.vel.y += .1}
	this.pos.y += 1*this.vel.y*(deltaTime / 16)
	this.yvel = abs(this.vel.y)/this.vel.y
	if(!this.yvel) this.yvel = 0;
	if(this.grounded && !this.colliding) this.grounded = false;
	//X vel
	this.vel.x = this.vel.x * .7 * (deltaTime / 16)
	if(this.vel.x < 0.0001  && this.vel.x > 0) this.vel.x = 0;
	else if(this.vel.x > -0.0001  && this.vel.x < 0) this.vel.x = 0;
	this.pos.x += 1*this.vel.x;
	this.xvel = abs(this.vel.x)/this.vel.x
	if(!this.xvel) this.xvel = 0;
	if(this.pos.y > 500) {
	this.pos = createVector(400,-10);
	this.size = createVector(30,70);
	this.vel = createVector(0,0);
	this.old = createVector(0,0);
		}
	}
	collision(id) {
	let t_box = boxes[id];
	if(t_box)
	return t_box.collision();
	}
	posCenter() {
	return this.center(this.size,this.pos);
	}
	center(v,v1) {
	let t_v = v.copy().div(2).add(v1);
	return t_v;
	}
	yCollision(id) {
		let t_box = boxes[id];
		let bpos = createVector(t_box.x,t_box.y)
		let bsize = createVector(t_box.width,t_box.height);
		let t_center = this.center(bsize, bpos);
		let pos_center = this.posCenter();
		//Y Collision
		if(pos_center.y < t_center.y){ 
		let distance = (this.size.copy().div(2).y + bsize.copy().div(2).y) - (t_center.y - pos_center.y);
		this.pos.y -= distance;
		this.grounded = true;
		}
		if(pos_center.y > t_center.y) {
		this.vel.y = 0;
		let distance = (this.size.copy().div(2).y + bsize.copy().div(2).y) + (t_center.y - pos_center.y);
		this.pos.y += distance;
		}
	}
	xCollision(id) {
		let t_box = boxes[id];
		let bpos = createVector(t_box.x,t_box.y);
		let bsize = createVector(t_box.width,t_box.height);
		let t_center = this.center(bsize, bpos);
		let pos_center = this.posCenter();
		//X Collision
		if(pos_center.x < t_center.x){ 
		this.vel.x = 0;
		let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) - (t_center.x - pos_center.x);
		this.pos.x -= distance;
		}
		if(pos_center.x > t_center.x) {
		this.vel.x = 0;
		let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) + (t_center.x - pos_center.x);
		this.pos.x += distance;
		}
	}
	onCollide(id) {
		let t_box = boxes[id];
		let bpos = createVector(t_box.oldX,t_box.oldY)
		let bsize = createVector(t_box.width,t_box.height);
		let tcenter = this.center(bsize, bpos);
		let pcenter = this.center(this.size, this.old);
		if(abs(pcenter.x - tcenter.x) > (bsize.x / 2 + this.size.x / 2) - 1) {this.xCollision(id)}
		else {this.yCollision(id)}
	}
	checkCollisions() {
	let found;
	let xfound;
	let t_box_id;
		for(t_box_id in boxes) {
		let c = this.collision(t_box_id);
		if(c) {
			this.collidedId = t_box_id;
			this.onCollide(t_box_id);
		}
			if(!found) {
			found = c;
			if(this.grounded) {
			this.pos.y++;
			found = this.collision(this.collidedId);
			this.pos.y--;
				}
			}
		}
	this.colliding = found;
	return this.colliding;
	}
	camera() {
	let pos = this.posCenter();
	this.cameraPos = createVector(lerp(this.cameraPos.x, pos.x, .05),lerp(this.cameraPos.y, pos.y, .05));
	resetMatrix();
	translate(-this.cameraPos.x + canvas.width / 2, -this.cameraPos.y + canvas.height / 2);
	}
}