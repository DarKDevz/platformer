var t_boxes = [];
function collide(rect1,rect2) {
	return (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.y + rect1.height > rect2.y)
}
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
  addLevel(t_boxes);
  levels[0].loadLevel(0);
  t_boxes = [];
  addBox(350,100,100,50);
  addBox(-1,400,890,32);
  addBox(600,300,260,32);
  addBox(860,300,10,100);
  t_boxes.push(new End(790,350,60,50));
  addLevel(t_boxes);
  t_boxes = [];
  addBox(150,250,170,50);
  addBox(350,100,100,50);
  addBox(-1,400,810,32);
  addBox(600,300,150,32);
  addBox(600,300,32,100);
  addLevel(t_boxes);
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