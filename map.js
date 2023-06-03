var classes = {
    Box: Box,
    Text: Text,
    Platform: movingPlatform,
    End: End,
    Enemy: Enemy,
    Interact: Interactive
};
var makingNew = false
  , valChanged = new Event("ValueChanged")
  , newBox = null
  , pasted = false
  , copiedObjs = []
  , cameraPos = null
  , lastWasPressed = false
  , overUI = false
  , Pressed = lastWasPressed
  , button = null
  , selectBox = []
  , Playing = null
  , Paused = null
  , pauseButton = null
  , addButton = null
  , selectObject = null
  , selectedObjects = []
  , lastScene = null
  , inputFile = null
  , saveButton = null
  , copyButton = null
  , removeButton = null
  , levelButton = null
  , levelMode = false
  , actionButtons = null
  , sideMenu = null
  , boxInfo = null
  , info = []
  , LastInfo = []
  , infoDivs = []
  , infoDivsHolder = []
  , infoIndexes = []
  , addSelect = null
  , id = null;

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
    JsonMap(file);
}

function uiButton(name, x, y) {
    let button = createButton(name);
    button.position(x, y);
    uiElement(button);
    return button;
}

function uiElement(element) {
    element.mouseOver(()=>overUI = true);
    element.mouseOut(()=>overUI = false);
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
    addButton.mousePressed(()=>{
        makingNew = !makingNew;
    }
    )
    addSelect = createSelect();
    addSelect.position(0, 0);
    Object.keys(classes).forEach(element=>{
        addSelect.option(element)
    }
    );
    saveButton = uiButton("Save", 220, 0);
    saveButton.mousePressed(saveMap);
    uiElement(saveButton);

    pauseButton = uiButton('Paused', windowWidth / 2, 0);
    pauseButton.mousePressed(()=>{
        Paused = !Paused
    }
    );
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
    levelButton = createButton('Level');
    levelButton.mousePressed(levelScreen);
    levelButton.parent('actionMenu');
    uiElement(levelButton);

    JsonMap(MapData);

    button.mousePressed(()=>{
        levels[activeLevel].loadLevel();
        Playing = !Playing;
    }
    );

    lastScene = activeLevel;
    cameraPos = createVector(0, 0);
}

function levelScreen() {
    levelMode = !levelMode;
    selectedObjects = [];
    for (let t_info of infoDivs) {
        t_info.remove();
    }
    if (levelMode) {
        let LValues = levels[activeLevel].getLevelValues();
        let LValueNames = levels[activeLevel].getLevelValueNames();
        let LValueIndx = levels[activeLevel].getActualLevelValues();
        for (let i = 0; i < LValues.length; i += 1) {
            addMenuInput(LValueNames[i], (val)=>{
                let actValue = parseInt(val) ? parseInt(val) : val
                levels[activeLevel][LValueIndx[i]] = actValue;
                LValues[i] = actValue;
            }
            , ()=>LValues[i])
        }
    }
}
let oldremove = removeObject;
removeObject = function(id) {
    selectedObjects = removeAndDecrease(selectedObjects, id);
    return oldremove(...arguments);
}

function removeAndDecrease(arr, value) {
    const index = arr.indexOf(value.toString());
    if (index !== -1) {
        arr.splice(index, 1);
        // Remove the value from the array
        for (let i = index; i < arr.length; i++) {
            arr[i] = (parseInt(arr[i], 10) - 1).toString();
            // Decrease subsequent values by 1
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            if (parseInt(arr[i], 10) > parseInt(value, 10)) {
                arr[i] = (parseInt(arr[i], 10) - 1).toString();
                // Decrease subsequent values by 1
            }
        }
    }
    return arr;
}

function removeMapObject() {
    for (let selectedId in selectedObjects) {
        let objId = selectedObjects[selectedId];
        delete levels[activeLevel].boxes[objId];
        delete selectedObjects[selectedId];
    }
    //filter empty
    levels[activeLevel].boxes = getCurrentBoxes().filter((_)=>{
        return _
    }
    )
    levels[activeLevel].reloadBoxes();
    selectedObjects = selectedObjects.filter((_)=>{
        return _
    }
    )
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
            if (!firstObjPos)
                firstObjPos = [obj.x, obj.y];
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
    if (Playing && !Paused)
        player.update();
    //Early Update
    if (!Paused)
        levels[activeLevel].earlyUpdate();
    if (Playing && !Paused)
        player.camera();
    else
        translate(cameraPos.x, cameraPos.y)
    if (Playing && !Paused)
        player.checkCollisions();
    levels[activeLevel].display();
    if (levelMode)
        levels[activeLevel].customDraw();
    if (Playing)
        player.display();
    //Late Update
    if (!Paused)
        levels[activeLevel].lateUpdate();
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //DRAW SELECT BOX
    if (selectBox[1]) {
        let rect1 = new Box(selectBox[0][0],selectBox[0][1],selectBox[1][0] - selectBox[0][0],selectBox[1][1] - selectBox[0][1]);
        fill(0, 0, 0, 25);
        rect(rect1.x, rect1.y, rect1.width, rect1.height);
    }
    /*------------------SelectBox Stuff---------------------*/
    if (!levelMode && lastWasPressed != Pressed && mouseIsPressed && mouseButton === LEFT) {
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
    if (!levelMode && lastWasPressed != Pressed && !mouseIsPressed && !overUI) {
        releaseSelectBox();
    } else if (!levelMode && selectBox[0] && mouseIsPressed && !selectBox[2] && !overUI) {
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
        if (t_box.components) {
            for (componentId in t_box.components) {
                let components = t_box.components[componentId];
                info.push(objectId);
                info.push("component")
                info.push(componentId)
                info.push(components.componentName);
            }
        }
        info.push(objectId);
        info.push("CustomButton");
        info.push(0);
        info.push(0);
    }
    if ((lastInfo.length !== info.length))
        console.log(lastInfo.length - info.length, lastIndexes.length - infoIndexes.length);
    if (info.equals(lastInfo)) {
        return;
    }
    let newInfo = lastInfo.length !== info.length
    let noNewObjects = lastIndexes.equals(infoIndexes)
    if (!newInfo && noNewObjects) {
        //edit existing values
        for (let t_info of infoDivs) {
            t_info.elt.dispatchEvent(valChanged);
            //Hacky solution to fix updating dom every time
            /*if (infoI < info.length)
                t_info.child()[1].value = info[infoI + 2].toString();*/
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
        if (info[i + 1] === "noMenu" || info[i + 1] === "component" || info[i + 1] === "CustomButton") {
            console.log("works");
            if (info[i + 1] === "noMenu") {// if (boxes[info[i]].components[info[i + 2]]) {
            //     boxes[info[i]].components[info[i + 2]].MenuEdit('sideMenu');
            // }
            } else if (info[i + 1] === "component") {
                if (boxes[info[i]].components[info[i + 2]]) {
                    boxes[info[i]].components[info[i + 2]].MenuEdit('sideMenu');
                }
            } else {
                let divHolder = createDiv();
                let ComponentSelect = createSelect();
                for (const [key,value] of Object.entries(componentList)) {
                    ComponentSelect.option(key);
                }
                ComponentSelect.parent(divHolder);
                let addButton = createButton("Add");
                addButton.mousePressed(()=>{
                    boxes[info[i]].components.push(new componentList[ComponentSelect.value()]({
                        obj: boxes[info[i]]
                    }))
                }
                )
                addButton.parent(divHolder)
                divHolder.parent('sideMenu')
                infoDivs.push(divHolder);
            }
        } else {
            addMenuInput(info[i + 1], (val)=>{
                let actValue = parseInt(val) ? parseInt(val) : val
                boxes[info[i]][info[i + 3]] = actValue;
                info[i + 2] = actValue;
            }
            , ()=>info[i + 2])
        }
    }
}

function addEditableScript(name, set, get, parentName="sideMenu") {
    let divHolder = createDiv();
    let headerText = createSpan("►Script Component").parent(divHolder);
    let isExpanded = false;
    let _get = get;
    divHolder.class("accordion-header");

    let inputField = createDiv();
    inputField.class("accordion-content");
    inputField.hide();

    let _span = createSpan(name + ": ").parent(inputField);
    _span.style('margin-left', '1em');
    // Add a tab space using CSS margin-left

    let inp = createButton("Script").parent(inputField);
    inp.mousePressed(()=>{
        var popupWindow = window.open("popup.html?text=" + encodeURIComponent(_get.toString()), "Popup Window", "width=400,height=300");
        // Receive updated text from the popup window
        window.receivePopupText = (text)=>{
            console.log(text);
            _get = set(text);
        }
        ;
    }
    );
    inp.size(177, 21);

    divHolder.mousePressed(()=>{
        isExpanded = !isExpanded;
        if (isExpanded) {
            headerText.html("▼Script Component");
            inputField.show();
            inputField.style("max-height", inputField.elt.scrollHeight + "px");
        } else {
            headerText.html("►Script Component");
            inputField.style("max-height", "0px");
            setTimeout(()=>{
                inputField.hide();
            }
            , 200);
            // Adjust the timeout value to match the CSS transition duration
        }
    }
    );

    infoDivs.push(divHolder);
    infoDivs[infoDivs.length - 1].parent(parentName);
    inputField.parent(divHolder);
}

function addEditableSprite(name, set, get, parentName="sideMenu") {
    let divHolder = createDiv();
    let headerText = createSpan("►Sprite Component").parent(divHolder);
    let _get = get;
    let isExpanded = false;

    divHolder.class("accordion-header");

    let inputField = createDiv();
    inputField.class("accordion-content");
    inputField.hide();

    let _span = createSpan(name + ": ").parent(inputField);
    _span.style('margin-left', '1em');
    // Add a tab space using CSS margin-left

    let inp = createButton("Sprite").parent(inputField);

    headerText.mousePressed(()=>{
        isExpanded = !isExpanded;
        if (isExpanded) {
            headerText.html("▼Sprite Component");
            inputField.show();
            inputField.style("max-height", inputField.elt.scrollHeight + "px");
        } else {
            headerText.html("►Sprite Component");
            inputField.style("max-height", "0px");
            setTimeout(()=>{
                inputField.hide();
            }
            , 200);
            // Adjust the timeout value to match the CSS transition duration
        }
    }
    );

    inp.mousePressed(()=>{
        let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
        // Receive updated text from the popup window
        window.jsonImage = (text)=>{
            console.log(text);
            _get = set(text);
        }
        ;
    }
    );

    inp.size(177, 21);
    let infoId = infoDivs.push(divHolder);
    infoDivs[infoId - 1].parent(parentName);
    inputField.parent(divHolder);
}

function addMenuInput(name, set, get) {
    let divHolder = createDiv();
    divHolder.html();
    let _span = createSpan(name + ": ").parent(divHolder);
    let inp = createInput(get().toString()).style("opacity:0.5;")
    inp.parent(divHolder).input(()=>{
        set(inp.value());
    }
    );
    divHolder.elt.addEventListener("ValueChanged", ()=>{
        inp.value(get())
    }
    );
    infoDivs.push(divHolder);
    infoDivs[infoDivs.length - 1].parent('sideMenu')
}

function editMenuInput(index, name, set, get) {}

function mouseCoords() {
    return createVector(round(Playing && !Paused ? mouseX + player.cameraPos.x : mouseX - cameraPos.x), round(Playing && !Paused ? mouseY + player.cameraPos.y : mouseY - cameraPos.y))
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
    if (!selectBox[0])
        return;
    selectBox[1] = [mouseCoords().x, mouseCoords().y];
    let drawSelect = selectBox;
    let rect1;
    rect1 = new Box(...transformCoordinates(drawSelect));

    if (!rect1)
        return;
    if (makingNew)
        return newBox = rect1;
    selectedObjects = [];
    for (t_box_id in boxes) {
        let t_box = boxes[t_box_id];
        let c = t_box.collision(rect1, false);
        if (c)
            selectedObjects.push(t_box_id);
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
        if (this[i]instanceof Array && array[i]instanceof Array) {
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
