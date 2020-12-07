var lastWasPressed = false;
var Pressed = lastWasPressed;
var button;
var selectBox = [];
var Playing;
var Paused;
var pauseButton;
var selectedObjects = [];
var lastScene;
var inputFile;
var saveButton;
function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
	pauseButton.position(windowWidth / 2, 0);
	button.position(windowWidth / 2 - 45, 0);
}
function JsonMap(file) {
	boxes = [];
	levels = [];
	eval(file.data);
	setupLevels();
}
function saveMap() {
	let jsMap = createWriter('t_map_t.js');
	/*--------------addObj Code-------------*/
	jsMap.write(['var t_boxes = [];'+
	'let addLevel = function(arr, pos) {levels.push(new Level(arr, pos))};'+
	'function addObj(ind,arr) {'+
	'switch(ind) {'+
		'case 0:'+
		't_boxes.push(new Box(...arr));'+
		'break;'+
		'case 1:'+
		't_boxes.push(new End(...arr));'+
		'break;'+
		'case 2:'+
		't_boxes.push(new movingPlatform(...arr));'+
		'break;'+
		'case 3:'+
		't_boxes.push(new Text(...arr));'+
		'break;'+
		'}'+
		'}']);
	jsMap.write("function setupLevels() {");
	for(tLid in levels) {
		console.log(tLid);
		for(t_box of levels[tLid].boxes) {
		let arguments = "[";
		for(t_arg_id in t_box.getValues()) {
		let t_arg = t_box.getValues()[t_arg_id];
		if(t_arg_id != t_box.getValues().length - 1) {
		arguments += t_arg + ",";
		}else {
		arguments += t_arg + "]);";
			}
		}
		jsMap.write("addObj(" + t_box.typeId +","+ arguments);
		}
		jsMap.write("addLevel(t_boxes, createVector(" + levels[tLid].pos.x +", " + levels[tLid].pos.y + "));")
		jsMap.write("t_boxes = [];")
	}
	jsMap.write("levels[0].loadLevel();");
	jsMap.write("}")
	jsMap.close();
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
	button = createButton('Play');
	inputFile = createFileInput(JsonMap);
	inputFile.position(0,0);
	inputFile.style("color: transparent");
	saveButton = createButton("Save");
	saveButton.position(75,0);
	saveButton.mousePressed(saveMap);
	pauseButton = createButton('Paused');
	pauseButton.position(windowWidth / 2, 0)
	setupLevels();
	button.position(windowWidth / 2 - 45, 0);
	button.mousePressed(() => {
	levels[activeLevel].loadLevel();
	Playing = !Playing;
	});
	pauseButton.mousePressed(() => {
	Paused = !Paused;
	});
	lastScene = activeLevel;
}
function draw() {
	clear();
	background(150, 230, 240);
	if(lastScene != activeLevel) {
	selectedObjects = [];
	}
	lastScene = activeLevel;
	/*-------------PLAYER AND LEVEL DRAWING-----------------*/
	if(Playing && !Paused)player.update();
	//Early Update
	if(!Paused)levels[activeLevel].earlyUpdate();
	if(Playing && !Paused)player.camera();
	if(Playing && !Paused)player.checkCollisions();
	levels[activeLevel].display();
	if(Playing)player.display();
	//Late Update
	if(!Paused)levels[activeLevel].lateUpdate();
	/*-------------PLAYER AND LEVEL DRAWING-----------------*/
	//DRAW SELECT BOX
	if(selectBox[1]) {
	let rect1 = new Box(selectBox[0][0],selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
	fill(0,0,0,25);
	rect(rect1.x,rect1.y,rect1.width,rect1.height);
	}
	/*------------------SelectBox Stuff---------------------*/
        if(lastWasPressed != Pressed && mouseIsPressed && mouseButton === LEFT) {	
		selectBox.push([
		Playing && !Paused ? mouseX + player.cameraPos.x: mouseX
		,Playing && !Paused ? mouseY + player.cameraPos.y: mouseY
		]);
		}
        if(mouseIsPressed && mouseButton === CENTER) {	
		if(selectedObjects.length !== 0) {
		for(t_box_id of selectedObjects) {
		let t_box = boxes[t_box_id];
		t_box.x += mouseX - pmouseX;
		t_box.y += mouseY - pmouseY;
			}
		}
	}
	if(lastWasPressed != Pressed && !mouseIsPressed) {
	selectBox = [];
	}else if(selectBox[0] && mouseIsPressed && !selectBox[2]) {
	mouseUp();
	}
	//Disallow selecting if Playing
	//if(Playing  && !Paused) selectBox = [];
	lastWasPressed = Pressed;
	Pressed = mouseIsPressed;
}
function mouseUp() {
	if(!selectBox[0]) return;
	selectBox[1] = [
	Playing && !Paused ? mouseX + player.cameraPos.x: mouseX
	,Playing && !Paused ? mouseY + player.cameraPos.y: mouseY
	];
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
	selectedObjects = [];
	for(t_box_id in boxes) {
		let t_box = boxes[t_box_id];
		let c = collide(rect1,t_box);
		if(c) selectedObjects.push(t_box_id);
		t_box.clr = c * 50
		//console.log(c);
		}
}