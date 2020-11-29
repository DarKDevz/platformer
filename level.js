var levels = [];
var activeLevel;
class Level{
	constructor(arr) {
	this.boxes = arr;
	}
	display() {
	for(let t_box of this.boxes) {
	t_box.display();
	   }
	}
	loadLevel(ind) {
	try {
	player = new Player();
	boxes = this.boxes;
	activeLevel = ind;
	}catch(e) {
		console.log(e)
	}
		}
}
addLevel = arr => {
levels.push(new Level(arr))
}