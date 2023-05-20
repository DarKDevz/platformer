var classes = {
    Box: Box,
    Text: Text,
    Platform: movingPlatform,
    End: End,
    Enemy: Enemy,
    Interact: Interactive
}
var makingNew = false;
var newBox;
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
var LastInfo = [];
var infoDivs = [];
var infoDivsHolder = [];
var infoIndexes = [];
var addSelect;
var id;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pauseButton.position(windowWidth / 2, 0);
    button.position(windowWidth / 2 - 45, 0);
    sideMenu.position(windowWidth - 300, 0);
}

function saveMap() {

    let jsMap = createWriter('t_map_t.js');
    jsMap.write(MapJson());
    jsMap.close();
}

function loadMap(file) {
    eval(file.data);
    JsonMap(MapData);
}

function uiButton(name, x, y) {
    let button = createButton(name);
    button.position(x, y);
    uiElement(button);
    return button;
}

function uiElement(element) {
    element.mouseOver(() => overUI = true);
    element.mouseOut(() => overUI = false);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = new Player();
    button = uiButton('Play', windowWidth / 2 - 45, 0);

    uiElement(button);

    inputFile = createFileInput(loadMap);
    inputFile.position(145, 0);
    inputFile.style("color: transparent");
    uiElement(inputFile);

    addButton = uiButton('add New', 75, 0);
    addButton.mousePressed(() => { makingNew = true; })
    addSelect = createSelect();
    addSelect.position(0, 0);
    Object.keys(classes).forEach(element => {
        addSelect.option(element)
    });
    saveButton = uiButton("Save", 220, 0);
    saveButton.mousePressed(saveMap);
    uiElement(saveButton);

    pauseButton = uiButton('Paused', windowWidth / 2, 0);

    sideMenu = createDiv();
    sideMenu.size(300);
    sideMenu.style("max-height:calc(100vh - 20px);overflow:auto;height:fit-content;background-color: rgba(0, 0, 0, 0.25);");
    //sideMenu.size(300, 200);

    sideMenu.position(windowWidth - sideMenu.size().width, 0);
    sideMenu.id('sideMenu');
    uiElement(sideMenu);

    actionButtons = createDiv();
    actionButtons.id('actionMenu');
    actionButtons.parent('sideMenu');

    copyButton = createButton('Copy');
    copyButton.mousePressed(copyObject);
    copyButton.parent('actionMenu');
    uiElement(copyButton);

    removeButton = createButton('Remove');
    removeButton.mousePressed(removeMapObject);
    removeButton.parent('actionMenu');
    uiElement(removeButton);

    JsonMap(MapData);

    button.mousePressed(() => {
        levels[activeLevel].loadLevel();
        Playing = !Playing;
    });

    lastScene = activeLevel;
    cameraPos = createVector(0, 0);
}
let oldremove = removeObject;
removeObject = function() {
    selectedObjects = [];
    return oldremove(...arguments);
}

function removeMapObject() {
    for (let selectedId in selectedObjects) {
        let objId = selectedObjects[selectedId];
        delete levels[activeLevel].boxes[objId];
        delete selectedObjects[selectedId];
    }
    //filter empty
    levels[activeLevel].boxes = levels[activeLevel].boxes.filter((_) => {
        return _
    })
    levels[activeLevel].reloadBoxes();
    selectedObjects = selectedObjects.filter((_) => {
        return _
    })
}

function copyObject() {
    copiedObjs = [];
    for (let objId of selectedObjects) {
        let copiedObj = {
            vals: boxes[objId].getValues(),
            type: boxes[objId].typeId
        }
        copiedObjs.push(copiedObj)
    }
}

function pasteObjects() {
    if (!pasted && !overUI) {
        let firstObjPos;
        for (let copiedObj of copiedObjs) {
            let _obj = (addObj(copiedObj.type, copiedObj.vals));
            let index = levels[activeLevel].boxes.push(_obj);
            index--;
            obj = levels[activeLevel].boxes[index];
            levels[activeLevel].boxes[index].clr = 50;
            let offsetPosX = mouseCoords().x;
            let offsetPosY = mouseCoords().y;
            if (!firstObjPos) firstObjPos = [obj.x, obj.y];
            else {
                offsetPosX -= firstObjPos[0] - obj.x;
                offsetPosY -= firstObjPos[1] - obj.y;
            }
            levels[activeLevel].reloadBoxes();
            obj.offSet(offsetPosX, offsetPosY);
            selectedObjects.push(index);
        }
    }
    pasted = true;
}

function draw() {

    if (keyIsDown(17) && keyIsDown(86)) {
        pasteObjects();
    } else {
        pasted = false;
    }
    clear();
    background(150, 230, 240);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    if (Playing && !Paused) player.update();
    //Early Update
    if (!Paused) levels[activeLevel].earlyUpdate();
    if (Playing && !Paused) player.camera();
    else translate(cameraPos.x, cameraPos.y)
    if (Playing && !Paused) player.checkCollisions();
    levels[activeLevel].display();
    if (Playing) player.display();
    //Late Update
    if (!Paused) levels[activeLevel].lateUpdate();
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //DRAW SELECT BOX
    if (selectBox[1]) {
        let rect1 = new Box(selectBox[0][0], selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
        fill(0, 0, 0, 25);
        rect(rect1.x, rect1.y, rect1.width, rect1.height);
    }
    /*------------------SelectBox Stuff---------------------*/
    if (lastWasPressed != Pressed && mouseIsPressed && mouseButton === LEFT) {
        selectBox.push([mouseCoords().x, mouseCoords().y]);
    }
    if (mouseIsPressed && mouseButton === CENTER) {
        let diffX = mouseX - pmouseX
        let diffY = mouseY - pmouseY
        if (selectedObjects.length !== 0) {
            for (t_box_id of selectedObjects) {
                let t_box = boxes[t_box_id];
                t_box.customDraw();
                t_box.offSet(t_box.x += diffX, t_box.y += diffY, diffX, diffY);
            }
        } else {
            cameraPos.x += diffX;
            cameraPos.y += diffY;
        }
    }
    if (lastWasPressed != Pressed && !mouseIsPressed && !overUI) {
        releaseSelectBox();
    } else if (selectBox[0] && mouseIsPressed && !selectBox[2] && !overUI) {
        mouseUp();
    }
    //If switching scenes remove selected
    if (lastScene != activeLevel) {
        selectedObjects = [];
        for (let t_info of infoDivs) {
            t_info.remove();
        }
    }
    lastScene = activeLevel;

    for (let t_box_id of selectedObjects) {
        let t_box = boxes[t_box_id];
        t_box.customDraw();
    }
    //Disallow selecting if Playing
    //if(Playing  && !Paused) selectBox = [];
    if (!overUI) {
        lastWasPressed = Pressed;
        Pressed = mouseIsPressed;
    }
    if (selectedObjects.length != 0) {
        OpenEditMenu()
    }
}

function releaseSelectBox() {
    selectBox = [];
    if (makingNew) {
        let tempBox = new classes[addSelect.value()]();
        let classParameters = [];
        for (let param of tempBox.getValuesName()) {
            let resp = newBox[param];
            if (resp === undefined) {
                paramResp = prompt(param)
                classParameters.push(Math.abs(parseInt(paramResp)) + 1 ? parseInt(paramResp) : paramResp);
            } else {
                classParameters.push(parseInt(resp) ? parseInt(resp) : resp);
            }
        }
        levels[activeLevel].boxes.push(new classes[addSelect.value()](...classParameters));
        levels[activeLevel].reloadBoxes();
    }
    makingNew = false;
}

function OpenEditMenu() {
    lastInfo = info;
    info = [];
    let lastIndexes = infoIndexes;
    infoIndexes = [];
    for (let objectId of selectedObjects) {
        let t_box = boxes[objectId];
        infoIndexes.push(objectId);
        for (t_val_id in t_box.getValues()) {
            info.push(objectId);
            info.push(t_box.getValuesName()[t_val_id])
            info.push(t_box.getValues()[t_val_id])
            info.push(t_box.getActualValuesName()[t_val_id])
        }
    }
    if (info.equals(lastInfo)) {
        return;
    }
    if (lastIndexes.equals(infoIndexes)) {
        //edit existing values
        let infoI = 0;
        for (let t_info of infoDivs) {
            //Hacky solution to fix updating dom every time
            if (infoI < info.length)
                t_info.child()[1].value = info[infoI + 2].toString().replace('"', '').replace('\"', '');
            infoI += 4;
        }
        return;
    }
    for (let t_info of infoDivs) {
        t_info.remove();
        infoDivs = [];
    }
    console.table(info);
    for (let i = 0; i < info.length; i += 4) {
        console.log(info[i]);
        addMenuInput(info[i + 1], (val) => {
            let actValue = parseInt(val) ? parseInt(val) : val.replace('"', '').replace('\"', '')
            boxes[info[i]][info[i + 3]] = actValue;
            info[i + 2] = actValue;
        }, info[i + 2])
    }
}

function addMenuInput(name, set, get) {
    let divHolder = createDiv();
    divHolder.html();
    let _span = createSpan(name + ": ").parent(divHolder);
    let inp = createInput(get.toString().replace('"', '').replace('\"', '')).style("opacity:0.5;")
    inp.parent(divHolder).input(() => {
        set(inp.value());
    });
    infoDivs.push(divHolder);
    infoDivs[infoDivs.length - 1].parent('sideMenu')
}

function editMenuInput(index, name, set, get) {}

function mouseCoords() {
    return createVector(
        round(Playing && !Paused ? mouseX + player.cameraPos.x : mouseX - cameraPos.x),
        round(Playing && !Paused ? mouseY + player.cameraPos.y : mouseY - cameraPos.y)
    )
}

function transformCoordinates(drawSelect) {
    var x1 = drawSelect[0][0];
    var y1 = drawSelect[0][1];
    var x2 = drawSelect[1][0];
    var y2 = drawSelect[1][1];

    // Calculate the new x-coordinate (leftmost point)
    var x = Math.min(x1, x2);

    // Calculate the new y-coordinate (topmost point)
    var y = Math.min(y1, y2);

    // Calculate the width and ensure it is positive
    var width = Math.abs(x2 - x1);

    // Calculate the height and ensure it is positive
    var height = Math.abs(y2 - y1);

    // Return the transformed coordinates and dimensions
    return [x, y, width, height];
}

function mouseUp() {
    if (!selectBox[0]) return;
    selectBox[1] = [mouseCoords().x, mouseCoords().y];
    let drawSelect = selectBox;
    let rect1;
    rect1 = new Box(...transformCoordinates(drawSelect));

    if (!rect1) return;
    if (makingNew) return newBox = rect1;
    selectedObjects = [];
    for (t_box_id in boxes) {
        let t_box = boxes[t_box_id];
        let c = t_box.collision(rect1, false);
        if (c) selectedObjects.push(t_box_id);
        t_box.clr = c * 50
            //console.log(c);
    }
}
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            } else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    // Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});