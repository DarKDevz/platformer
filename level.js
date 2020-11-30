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
	loadLevel() {
	try {
	if(player) {
	player.pos = this.pos.copy();
	player.cameraPos = player.pos.copy()
	}
	boxes = this.boxes;
	activeLevel = this.ind;
	}catch(e) {
		console.log(e)
	}
		}
}
addLevel = function(arr, pos) {
levels.push(new Level(arr, pos))
}