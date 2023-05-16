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
	constructor(arr,pos,maxPos) {
	this.boxes = arr;
	this.ind = levels.length;
	this.pos = pos;
	this.maxPos = maxPos;
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
	getLevelValues() {
	return[this.ind,this.pos,this.maxPos]
	}
	getLevelValueNames() {
	return["level Index","starting Position","Max Y Pos"]
	}
	loadLevel() {
	player.pos = this.pos.copy();
	player.cameraPos = player.pos.copy();
	player.grounded = false;
	player.groundedId = null;
	player.colliding = false;
	player.collidedId = null;
	player.vel = createVector(0,0);
	this.reloadBoxes();
	activeLevel = this.ind;
	}
	reloadBoxes() {
	boxes = this.boxes;
	}
	toJSON() {
		let all = "\""+this.ind+"\":[";
		let jsonString;
		for(let t_box of this.boxes) {
		jsonString = "[";
		jsonString += t_box.typeId+ ",";
		for(let t_arg_id in t_box.getValues()) {
		let t_arg = t_box.getValues()[t_arg_id];
		if(t_arg_id != t_box.getValues().length - 1) {
		jsonString += t_arg + ",";
		}else {
		jsonString += t_arg + "],";
			}
		}
		all += jsonString;
	}
	all = all.substring(0,all.length-1);
	all += "]"
	return all;
	}
}
function MapJson() {
	let mapData = "MapData={data:`{";
	for(let level of levels) {
	mapData += level.toJSON();
	mapData += ","
	}
	mapData = mapData.substring(0,mapData.length-1);
	mapData += "}`}"
	return mapData;
}
addLevel = function(arr, pos, maxPos = 500) {
levels.push(new Level(arr, pos, maxPos))
}