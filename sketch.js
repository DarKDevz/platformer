function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	setupLevels();
	player = new Player();
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