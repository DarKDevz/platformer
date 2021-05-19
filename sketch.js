function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
	JsonMap({data:"{\"0\":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[1,610,200,60,100],[0,600,300,150,32],[0,600,300,32,100],[2,301,350,60,50,0,500]],\"1\":[[0,350,100,100,50],[0,-1,400,890,32],[0,600,300,260,32],[0,860,300,10,100],[2,450,350,60,50,350,600],[3,500,330,\"S to crouch\"],[1,790,350,60,50]],\"2\":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[0,50,360,50,32],[0,600,300,150,32],[0,600,300,32,100]]}"});
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