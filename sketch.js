function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
	JsonMap(MapData)
}
function addObj(ind,arr) {
	switch(ind) {
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
function draw() {
	clear();
	background(150, 230, 240);
	//Update
	player.update();
	//Early Update
	levels[activeLevel].earlyUpdate();
	player.camera();
	player.checkCollisions();
	levels[activeLevel].display();
	player.display();
	//Late Update
	levels[activeLevel].lateUpdate();
	//rect(-1,375,800,500)
}
