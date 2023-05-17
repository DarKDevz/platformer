var levels = [];
var activeLevel;
function addObj(ind, arr) {
    switch (ind) {
        case 0:
            return (new Box(...arr));
            break;
        case 1:
            return (new End(...arr));
            break;
        case 2:
            return (new movingPlatform(...arr));
            break;
        case 3:
            return (new Text(...arr))
            break;
        case 4:
            return (new Enemy(...arr))
			break;
		case 5:
			return (new Interactive(...arr))
			break;
    }
}
function JsonMap(file) {
	levels = [];
	boxes = [];
	var newLevels = JSON.parse(file.data)
	for(let level_id in newLevels) {
		let newLevel = newLevels[level_id];
		let t_boxes = [];
		for(let object of newLevel) {
			let _objInd = object.shift()
			t_boxes.push(addObj(_objInd,object))
		}
		addLevel(t_boxes, createVector(400,-10));
	}
	levels[0].loadLevel();
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