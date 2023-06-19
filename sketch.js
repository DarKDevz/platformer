function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	//Remove right click default behaviour
	canvas.oncontextmenu = function(e) {
		e.preventDefault();
	}
	noSmooth()

	player = new Player();
	engine = new Engine();
	JsonMap(MapData)
}

function draw() {
	
	clear();
	background(150, 230, 240);
	//Update
	player.update(!0);
	//Early Update
	engine.getActiveScene().earlyUpdate(!0);
	player.camera(!0);
	player.checkCollisions(!0);
	engine.getActiveScene().display(!0);
	player.display(!0);
	//Late Update
	engine.getActiveScene().lateUpdate(!0);
	//rect(-1,375,800,500)
}
