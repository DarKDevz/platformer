var classes = {
	box : Box,
	text : Text,
	platform : movingPlatform,
	end: End,
}
var classesInv = {
	Box : "box",
	Text : "text",
	movingPlatform : "platform",
	End : "end",
}
var pasted = false;
var copiedObjs = [];
var cameraPos;
var lastWasPressed = false;
var overUI = false;
var Pressed = lastWasPressed;
var button;
var selectBox = [];
var Playing;
var Paused;
var pauseButton;
var addButton;
var selectObject;
var selectedObjects = [];
var lastScene;
var inputFile;
var saveButton;
var copyButton;
var removeButton;
var actionButtons;
var sideMenu;
var boxInfo;
var info = [];
var infoDivs = [];
var infoDivsHolder = [];
var infoIndexAdded = [];
var id;
function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
	pauseButton.position(windowWidth / 2, 0);
	button.position(windowWidth / 2 - 45, 0);
	sideMenu.position(windowWidth - 250,0);
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
function saveMap() {
	
	let jsMap = createWriter('t_map_t.js');
	jsMap.write(MapJson());
	jsMap.close();
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	player = new Player();
	button = createButton('Play');
	inputFile = createFileInput(JsonMap);
	inputFile.position(70,0);
	inputFile.style("color: transparent");
	inputFile.mouseOver(() => overUI = true)
	inputFile.mouseOut(() => overUI = false)
	addButton = createButton('add New')
	addButton.position(0,0);
	addButton.mouseOver(() => overUI = true)
	addButton.mouseOut(() => overUI = false)
	saveButton = createButton("Save");
	saveButton.position(145,0);
	saveButton.mousePressed(saveMap);
	saveButton.mouseOver(() => overUI = true)
	saveButton.mouseOut(() => overUI = false)
	pauseButton = createButton('Paused');
	pauseButton.position(windowWidth / 2, 0)
	pauseButton.mouseOver(() => overUI = true)
	pauseButton.mouseOut(() => overUI = false)
	sideMenu = createDiv();
	sideMenu.style("background-color: rgba(0, 0, 0, 0.25);");
	sideMenu.size(250,450);
	sideMenu.position(windowWidth - 250,0);
	sideMenu.id('sideMenu');
	sideMenu.mouseOver(() => overUI = true)
	sideMenu.mouseOut(() => overUI = false)
	actionButtons = createDiv();
	actionButtons.id('actionMenu')
	actionButtons.parent('sideMenu')
	copyButton = createButton('Copy');
	copyButton.mousePressed(copyObject)
	copyButton.parent('actionMenu')
	removeButton = createButton('Remove')
	removeButton.mousePressed(removeObject)
	removeButton.parent('actionMenu')
	JsonMap({data:"{\"0\":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[1,610,200,60,100],[0,600,300,150,32],[0,600,300,32,100],[2,301,350,60,50,0,500]],\"1\":[[0,350,100,100,50],[0,-1,400,890,32],[0,600,300,260,32],[0,860,300,10,100],[2,450,350,60,50,350,600],[3,500,330,\"S to crouch\"],[1,790,350,60,50]],\"2\":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[0,50,360,50,32],[0,600,300,150,32],[0,600,300,32,100]]}"});
	button.position(windowWidth / 2 - 45, 0);
	button.mousePressed(() => {
	levels[activeLevel].loadLevel();
	Playing = !Playing;
	});
	button.mouseOver(() => overUI = true)
	button.mouseOut(() => overUI = false)
	pauseButton.mousePressed(() => {
	Paused = !Paused;
	});
	addButton.mousePressed(()=>{
	try {Paused = true;
	let className = prompt('Type class name');
	let tempBox = new classes[className]();
	let classParameters = [];
	for(let param of tempBox.getValuesName()) {
	let resp = prompt(param)
	classParameters.push(parseInt(resp) ? parseInt(resp) : resp);
	}
	levels[activeLevel].boxes.push(new classes[className](...classParameters));
	}catch(e){
	alert(e);
	}
	})
	lastScene = activeLevel;
	cameraPos = createVector(0,0);
}
function removeObject() {
	for(let selectedId in selectedObjects) {
	let objId = selectedObjects[selectedId];
	delete levels[activeLevel].boxes[objId];
	delete boxes[objId]
	delete selectedObjects[selectedId];
	}
	//filter empty
	boxes = boxes.filter((_) => {return _})
	levels[activeLevel].boxes = levels[activeLevel].boxes.filter((_) => {return _})
	selectedObjects = selectedObjects.filter((_)=>{return _})
}
function copyObject() {
	copiedObjs = [];
	for(let objId of selectedObjects) {
		let copiedObj = {
		vals:boxes[objId].getValues(),
		type:boxes[objId].typeId
		}
		copiedObjs.push(copiedObj)
	}
}
function draw() {
	if(keyIsDown(17) && keyIsDown(86)) {
	if(!pasted) {
		if(!overUI) {
			let firstObjPos;
			for(let copiedObj of copiedObjs) {
				let _obj = (addObj(copiedObj.type,copiedObj.vals));
				let index  = levels[activeLevel].boxes.push(_obj);
				index--;
				obj = levels[activeLevel].boxes[index];
				levels[activeLevel].boxes[index].clr = 50;
				let offsetPosX = mouseCoords().x;
				let offsetPosY = mouseCoords().y;
				if(!firstObjPos) firstObjPos = [obj.x,obj.y];
				else {
					offsetPosX -= firstObjPos[0]-obj.x;
					offsetPosY -= firstObjPos[1]-obj.y;
				}
				console.log(boxes[index])
				obj.offSet(offsetPosX,offsetPosY);
				console.log(boxes[index])
				selectedObjects.push(index);	
			}
		}
	}
	pasted = true;
	}else {
	pasted = false;
	}
	clear();
	background(150, 230, 240);
	/*-------------PLAYER AND LEVEL DRAWING-----------------*/
	if(Playing && !Paused)player.update();
	//Early Update
	if(!Paused)levels[activeLevel].earlyUpdate();
	if(Playing && !Paused)player.camera();
	else translate(cameraPos.x,cameraPos.y)
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
		selectBox.push([mouseCoords().x,mouseCoords().y]);
		}
    if(mouseIsPressed && mouseButton === CENTER) {
		let diffX = mouseX - pmouseX
		let diffY = mouseY - pmouseY		
		if(selectedObjects.length !== 0) {
		for(t_box_id of selectedObjects) {
		let t_box = boxes[t_box_id];
		t_box.customDraw();
		t_box.offSet(t_box.x += diffX,t_box.y += diffY);
			}
		}else {
		cameraPos.x += diffX;
		cameraPos.y += diffY;	
		}
	}
	if(lastWasPressed != Pressed && !mouseIsPressed && !overUI) {
	selectBox = [];
	}else if(selectBox[0] && mouseIsPressed && !selectBox[2] && !overUI) {
	mouseUp();
	}
	//If switching scenes remove selected
	if(lastScene != activeLevel) {
	selectedObjects = [];
	for(let t_info of infoDivs) {
		t_info.remove();
	}
	}
	lastScene = activeLevel;
	
	for(let t_box_id of selectedObjects) {
		let t_box = boxes[t_box_id];
		t_box.customDraw();
	}
	//Disallow selecting if Playing
	//if(Playing  && !Paused) selectBox = [];
	if(!overUI) {
	lastWasPressed = Pressed;
	Pressed = mouseIsPressed;
	}
	if(selectedObjects.length == 1) {
	OpenEditMenu(selectedObjects[0])
	}
}
function OpenEditMenu(objectId) {
	let t_box = boxes[objectId];
	let lastInfo = info;
	let lastId = id;
	id = objectId;
	info = [];
	for(t_val_id in t_box.getValues()) {
	info.push(t_box.getValuesName()[t_val_id])
	info.push(t_box.getValues()[t_val_id])
	info.push(t_box.getActualValuesName()[t_val_id])
	}
	let lastInfoDivs = infoDivs;
	//dont update list if it's the same as before
	//equals array prototype at bottom!
	if(lastInfo.equals(info)) {
		return;
	}
	if(lastId != id) {
			for(let t_info of infoDivs) {
				t_info.remove();
			infoDivs = [];
		}		
		if(!infoIndexAdded.includes(id)) {
			infoDivsHolder = infoDivs;
			infoIndexAdded.push(id);
			}
		for(let i = 0; i < info.length; i += 3) {
		//Info shit                                 
		let divHolder = createDiv();
		divHolder.html();
		let _span = createSpan(info[i] + ": ").parent(divHolder);
		let inp = createInput(info[i+1].toString().replace('"','').replace('\"','')).style("opacity:0.5;")
		inp.parent(divHolder).input(() => {
		t_box[info[i+2]] = parseInt(inp.value()) ? parseInt(inp.value()) : inp.value().replace('"','').replace('\"','');
		//overWrite info list so you dont update for no reason :)
		info[i+1] = parseInt(inp.value()) ? parseInt(inp.value()) : inp.value().replace('"','').replace('\"','');
		});
		infoDivs.push(divHolder);
		infoDivs[infoDivs.length-1].parent('sideMenu')
		}
		}
	else {
		//update values
		let infoI = 0;
		for(let t_info of infoDivs) {
			//Hacky solution to fix updating dom every time
			if(infoI < info.length)
				t_info.child()[1].value = info[infoI+1].toString().replace('"','').replace('\"','');
			infoI+=3;
		}
	}
}
function addMenuInput(name,set,get) {
}
function editMenuInput(name,set,get) {}
function mouseCoords() {
return createVector(
	round(Playing && !Paused ? mouseX + player.cameraPos.x: mouseX - cameraPos.x),
	round(Playing && !Paused ? mouseY + player.cameraPos.y: mouseY - cameraPos.y)
)
}
function mouseUp() {
	if(!selectBox[0]) return;
	selectBox[1] = [mouseCoords().x,mouseCoords().y];
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
		let c = t_box.collision(rect1,false);
		if(c) selectedObjects.push(t_box_id);
		t_box.clr = c * 50
		//console.log(c);
		}
}
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});