var t_boxes = [];
function addBox(x,y,w,h) {
	let t_box = new Box(x, y, w, h);
	t_boxes.push(t_box);
}
function Levels() {
  addBox(150,250,170,50);
  addBox(350,100,100,50);
  addBox(-1,400,810,32);
  t_boxes.push(new End(610,200,60,100));
  addBox(600,300,150,32);
  addBox(600,300,32,100);
  t_boxes.push(new movingPlatform(-500,350,60,50,t_boxes.length, 0, 500));
  addLevel(t_boxes, createVector(400,-10));
  levels[0].loadLevel();
  t_boxes = [];
  addBox(350,100,100,50);
  addBox(-1,400,890,32);
  addBox(600,300,260,32);
  addBox(860,300,10,100);
  t_boxes.push(new Text(500, 330,"S to crouch"));
  t_boxes.push(new movingPlatform(450,350,60,50,t_boxes.length, 350, 600));
  t_boxes.push(new End(790,350,60,50));
  addLevel(t_boxes, createVector(400,-10));
  t_boxes = [];
  addBox(150,250,170,50);
  addBox(350,100,100,50);
  addBox(-1,400,810,32);
  addBox(600,300,150,32);
  addBox(600,300,32,100);
  addLevel(t_boxes, createVector(400,-10));
}
function changeMap(ind) {
		levels[ind].loadLevel();
}
function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	Levels();
	player = new Player();
}
function draw() {
	clear();
	background(150, 230, 240);
	player.update();
	player.checkCollisions();
	player.camera();
	levels[activeLevel].display();
	player.display();
	//rect(-1,375,800,500)
}