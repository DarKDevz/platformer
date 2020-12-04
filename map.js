var lastWasPressed = false;
var Pressed = lastWasPressed;
var button;
var selectBox = [];
function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	setupLevels();
	player = {};
	player.pos = createVector(1000,100);
	player.size = createVector(1,1);
	button = createButton('Play!');
	button.position(0,0);
}
function draw() {
	clear();
	background(150, 230, 240);
	levels[activeLevel].display();
	//rect(-1,375,800,500)
	if(selectBox[1]) {
	let rect1 = new Box(selectBox[0][0],selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
	fill(0,0,0,25);
	rect(rect1.x,rect1.y,rect1.width,rect1.height);
	}
        if(lastWasPressed != Pressed && mouseIsPressed) {	
		selectBox.push([mouseX,mouseY]);
		}
	if(lastWasPressed != Pressed && !mouseIsPressed) {
	selectBox = [];
	}else if(selectBox[0] && mouseIsPressed && !selectBox[2]) {
	mouseUp();
	}
	if(selectBox[1]) {
	let rect1 = new Box(selectBox[0][0],selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
	fill(0,0,0,25);
	rect(rect1.x,rect1.y,rect1.width,rect1.height);
	}
	lastWasPressed = Pressed;
	Pressed = mouseIsPressed;
}
function mouseUp() {
	selectBox[1] = [mouseX,mouseY];
	let drawSelect = selectBox;
	let rect1;
	if(drawSelect[0][0] >= drawSelect[1][0] && drawSelect[0][1] <= drawSelect[1][1]) {
	rect1 = new Box(
	drawSelect[1][0],
	drawSelect[0][1],
	drawSelect[0][0] - drawSelect[1][0],
	drawSelect[1][1] - drawSelect[0][1]);
	}
	if(drawSelect[0][0] <= drawSelect[1][0] && drawSelect[0][1] <= drawSelect[1][1]){
	rect1 = new Box(
	drawSelect[0][0],
	drawSelect[0][1],
	drawSelect[1][0] - drawSelect[0][0],
	drawSelect[1][1] - drawSelect[0][1]);
	}
	if(drawSelect[0][0] <= drawSelect[1][0] && drawSelect[0][1] >= drawSelect[1][1]){
	rect1 = new Box(
	drawSelect[0][0],
	drawSelect[1][1],
	drawSelect[1][0] - drawSelect[0][0],
	drawSelect[0][1] - drawSelect[1][1]);
	}
	if(drawSelect[0][0] >= drawSelect[1][0] && drawSelect[0][1] >= drawSelect[1][1]) {
	rect1 = new Box(
	drawSelect[1][0],
	drawSelect[1][1],
	drawSelect[0][0] - drawSelect[1][0],
	drawSelect[0][1] - drawSelect[1][1]);
	}
	if(!rect1) return;
		for(t_box_id in boxes) {
		let t_box = boxes[t_box_id];
		let c = collide(rect1,t_box);
		t_box.clr = c * 50
		//console.log(c);
		}
}