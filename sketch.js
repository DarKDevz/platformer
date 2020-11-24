var player;
var boxes = [];
function collide(rect1,rect2) {
	return (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.y + rect1.height > rect2.y)
}
function addBox(pos, size) {
	let t_box = {
		x:pos.x,
		y:pos.y,
		width: size.x,
		height: size.y,
		clr: 0,
		oldX:pos.x,
		oldY:pos.y,
		display: function() {
		oldX = this.x;
		oldY = this.y;
		fill(this.clr)
		rect(this.x,this.y,this.width ,this.height)
		},
		collision: function() {
		let rect2 = {
		x: player.pos.x,
		y: player.pos.y,
		width: player.size.x,
		height: player.size.y,
		}
		let collides = collide(this, rect2)
		this.clr = collides * 125
		return collides;
	    }
	}
	boxes.push(t_box);
}
function Level() {
	addBox(createVector(150,250),createVector(170,50));
	addBox(createVector(350,100),createVector(100,50));
	addBox(createVector(-1,400),createVector(810,32));
	addBox(createVector(610,200),createVector(60,100));
	addBox(createVector(600,300),createVector(150,32));
	addBox(createVector(600,300),createVector(32,100));
}
function setup() {
	createCanvas(800,500);
	Level();
	player = {
		pos:createVector(400,-1000),
		size:createVector(30,70),
		vel: createVector(0,0),
		old: createVector(0,0),
		draw:true,
		xdir: 0,
		grounded: false,
		colliding: false,
		collidedId: null,
		yvel: 1,
		xvel: 0,
	display: function() {
		fill(0)
		if(draw) rect(this.pos.x,this.pos.y,this.size.x,this.size.y);
		text("vx: " + round(this.vel.x),50,50);
		text("vy: " + round(this.vel.y),50,60);
		text("x: " + round(this.pos.x),50,70);
		text("y: " + round(this.pos.y),50,80);
		text("oy: " + round(this.old.y),50,90);
		text("ox: " + round(this.old.x),50,100);
		text("ground: " + (this.grounded),50,110);
		text("colliding: " + (this.colliding),50,120);
		text("id: " + (this.collidedId),50,130);
		text("surface x:" + (this.surface),50,140);
		},
	update: function() {
		this.old = this.pos.copy();
		//controlller
		//Space
		if (keyIsDown(32) && this.grounded) {
			this.grounded = false;
			this.colliding = false;
			this.vel.y = -6.7;
			}
		if (keyIsDown(LEFT_ARROW)) {
    			this.vel.x -= 5;
  		}if (keyIsDown(RIGHT_ARROW)) {
    			this.vel.x += 5;
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
		},
		collision(id) {
		let t_box = boxes[t_box_id];
		return t_box.collision();
		},
		posCenter() {
		return this.center(this.size,this.pos);
		},
		center(v,v1) {
		let t_v = v.copy().div(2).add(v1);
		return t_v;
		},
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
			};
			if(pos_center.y > t_center.y) {
			this.vel.y = 0;
			let distance = (this.size.copy().div(2).y + bsize.copy().div(2).y) + (t_center.y - pos_center.y);
			this.pos.y += distance;
			}
		},
		xCollision(id) {
			let t_box = boxes[id];
			let bpos = createVector(t_box.x,t_box.y)
			let bsize = createVector(t_box.width,t_box.height);
			let t_center = this.center(bsize, bpos);
			let pos_center = this.posCenter();
			//X Collision
			if(pos_center.x < t_center.x){ 
			this.vel.x = 0;
			let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) - (t_center.x - pos_center.x);
			this.pos.x -= distance;
			};
			if(pos_center.x > t_center.x) {
			this.vel.x = 0;
			let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) + (t_center.x - pos_center.x);
			this.pos.x += distance;
			}
		},
		onCollide(id) {
			let t_box = boxes[id]
			let bpos = createVector(t_box.oldX,t_box.oldY)
			let bsize = createVector(t_box.width,t_box.height);
			let tcenter = this.center(bsize, bpos);
			let pcenter = this.center(this.size, this.old);
			console.log(abs(pcenter.x - tcenter.x) > (bsize.x / 2 + this.size.x / 2))
			console.log(id);
			if(abs(pcenter.x - tcenter.x) > (bsize.x / 2 + this.size.x / 2) - 1) {this.xCollision(id);}
			else {this.yCollision(id);}
		},
		checkCollisions() {
		let found;
		let xfound
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
	}
}
function draw() {
	clear();
	background(150, 230, 240);
	player.update();
	player.checkCollisions();
	for(t_box of boxes) {
	t_box.display();
	}
	player.display();
	//rect(-1,375,800,500)
}