var levels = [];
var activeLevel;
class Level{
	constructor(arr,pos) {
	this.boxes = arr;
	this.ind = levels.length;
	this.pos = pos;
	}
	display() {
	for(let t_box of this.boxes) {
	t_box.display();
	   }
	}
	lateUpdate() {
	for(let t_box of this.boxes) {
	t_box.lateUpdate();
	   }
	}
	earlyUpdate() {
	for(let t_box of this.boxes) {
	t_box.earlyUpdate();
	   }
	}
	loadLevel() {
	player.pos = this.pos.copy();
	player.cameraPos = player.pos.copy();
	player.grounded = false;
	player.groundedId = null;
	player.colliding = false;
	player.collidedId = null;
	player.vel = createVector(0,0);
	boxes = this.boxes;
	activeLevel = this.ind;
	}
}
addLevel = function(arr, pos) {
levels.push(new Level(arr, pos))
}