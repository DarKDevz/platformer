var levels = [];
var activeLevel;
function addObj(ind,arr) {
	switch(ind) {
	case 0:
	t_boxes.push(new Box(...arr));
	break;
	case 1:
	t_boxes.push(new End(...arr));
	break;
	case 2:
	t_boxes.push(new movingPlatform(...arr));
	break;
	case 3:
	t_boxes.push(new Text(...arr))
	}
}
class Level{
	constructor(arr,pos) {
	this.boxes = arr;
	this.ind = levels.length;
	this.pos = pos;
	this.maxPos = 500;
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