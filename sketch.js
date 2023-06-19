function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
	engine = new Engine();
	JsonMap(MapData)
}

function draw() {
	
	clear();
	background(150, 230, 240);
	//Update
	player.update();
	//Early Update
	engine.getActiveScene().earlyUpdate();
	player.camera();
	player.checkCollisions();
	engine.getActiveScene().display();
	player.display();
	//Late Update
	engine.getActiveScene().lateUpdate();
	//rect(-1,375,800,500)
}
//Remove right click default behaviour
canvas.oncontextmenu = function(e) {
	e.preventDefault();
}
