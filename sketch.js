function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
JsonMap({data:"{\"0\":[[0,150,250,170,50],[0,150,250,170,50],[4,647,24,100,50],[0,350,100,100,50],[0,-1,400,810,32],[1,610,200,60,100],[0,600,300,150,32],[0,600,300,32,100],[2,247,350,60,50,0,500]],\"1\":[[0,350,100,100,50],[0,-1,400,890,32],[0,600,300,260,32],[0,860,300,10,100],[2,516,350,60,50,350,600],[3,500,330,\"S to crouch\"],[1,790,350,60,50]],\"2\":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[0,50,360,50,32],[0,600,300,150,32],[0,600,300,32,100],[2,175,13,50,50,90,590],[0,-160,-50,150,50],[0,-372,268,150,50],[0,-766,168,150,50],[0,-1205,-60,150,50],[0,-133,-3,50,350],[0,-1354,-441,150,50],[0,-1551,-223,150,50],[0,-984,-643,150,50],[0,-407,-758,150,50],[1,48,-843,50,25]],\"3\":[[0,6,82,150,50]]}"})}
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
