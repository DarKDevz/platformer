var classes = {
    Box: Box,
    Text: Text,
    Platform: movingPlatform,
    End: End,
    Enemy: Enemy,
    Interact: Interactive
};
var makingNew = false,
    valChanged = new Event("ValueChanged"),
    newBox = null,
    pasted = false,
    copiedObjs = [],
    cameraPos = null,
    lastWasPressed = false,
    overUI = false,
    Pressed = lastWasPressed,
    button = null,
    selectBox = [],
    Playing = null,
    Paused = null,
    pauseButton = null,
    addButton = null,
    selectObject = null,
    selectedObjects = [],
    lastScene = null,
    inputFile = null,
    visibleInputFile = null,
    saveButton = null,
    copyButton = null,
    removeButton = null,
    levelButton = null,
    levelMode = false,
    actionButtons = null,
    sideMenu = null,
    boxInfo = null,
    info = [],
    LastInfo = [],
    infoDivs = [],
    infoDivsHolder = [],
    infoIndexes = [],
    addSelect = null,
    id = null,
    ContentBrowserPanel = {
        set files(value) { return engine.files = value},
        get files() {return engine.files},
        Divs : []
    },
    OldFiles = [];

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pauseButton.position(windowWidth / 2, 0);
    button.position(windowWidth / 2 - 45, 0);
    sideMenu.position(windowWidth - 300, 0);
    ContentBrowserPanel.HUD.size(windowWidth,windowHeight/4);
    ContentBrowserPanel.HUD.position(0,windowHeight-windowHeight/4);
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
    element.mouseOver(() => overUI = true);
    element.mouseOut(() => overUI = false);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    engine = new Engine();
    player = new Player();
    button = uiButton('Play', windowWidth / 2 - 45, 0);

    uiElement(button);

    inputFile = createFileInput(loadMap);
    inputFile.style("display: none");
    visibleInputFile = uiButton("load File", 145, 0)
    visibleInputFile.mouseClicked((e) => {
        inputFile.elt.click(e)
    })
    uiElement(visibleInputFile);

    addButton = uiButton('add New', 75, 0);
    addButton.mousePressed(() => {
        makingNew = !makingNew;
        //wait 4 seconds then disable 
        setTimeout(()=>{makingNew = false},4000)
    })
    addSelect = createSelect();
    addSelect.position(0, 0);
    Object.keys(classes).forEach(element => {
        addSelect.option(element)
    });
    saveButton = uiButton("Save", 212, 0);
    saveButton.mousePressed(saveMap);
    uiElement(saveButton);

    pauseButton = uiButton('Paused', windowWidth / 2, 0);
    pauseButton.mousePressed(() => {
        Paused = !Paused
    });
    sideMenu = createDiv();
    sideMenu.size(300);
    sideMenu.style("max-height:calc(100vh - 20px);overflow:auto;height:fit-content;background-color: rgba(0, 0, 0, 0.25);");
    //sideMenu.size(300, 200);

    sideMenu.position(windowWidth - sideMenu.size().width, 0);
    sideMenu.id('sideMenu');
    uiElement(sideMenu);
    ContentBrowserPanel.HUD = createDiv();
    ContentBrowserPanel.HUD.size(windowWidth,windowHeight/4);
    createDiv('ContentBrowserPanel').parent(ContentBrowserPanel.HUD)
    ContentBrowserPanel.HUD.style("background-color: rgba(0, 0, 0, 0.25);overflow:auto;");
    ContentBrowserPanel.HUD.position(0,windowHeight-windowHeight/4);
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

    button.mousePressed(() => {
       engine.getActiveScene().loadLevel();
        Playing = !Playing;
    });

    lastScene = engine.activeScene;
    cameraPos = createVector(0, 0);
}

function levelScreen() {
    levelMode = !levelMode;
    selectedObjects = [];
    for (let t_info of infoDivs) {
        t_info.remove();
    }
    if (levelMode) {
        let LValues =engine.getActiveScene().getLevelValues();
        let LValueNames =engine.getActiveScene().getLevelValueNames();
        let LValueIndx =engine.getActiveScene().getActualLevelValues();
        for (let i = 0; i < LValues.length; i += 1) {
            addMenuInput(LValueNames[i], (val) => {
                let actValue = parseInt(val) ? parseInt(val) : val
               engine.getActiveScene()[LValueIndx[i]] = actValue;
                LValues[i] = actValue;
            }, () => LValues[i])
        }
    }
}

function removeMapObject() {
    for (let selectedId in selectedObjects) {
        let objId = selectedObjects[selectedId];
        removeObject(objId);
        delete selectedObjects[selectedId];
    }
    //filter empty
   engine.getActiveScene().boxes = getCurrentBoxes().filter((_) => {
        return _
    })
   engine.getActiveScene().reloadBoxes();
    selectedObjects = selectedObjects.filter((_) => {
        return _
    })
}

function copyObject() {
    for(let _ in selectedObjects) {
        let objs = selectedObjects[_]
        if(!engine.getfromUUID(objs)) {
            selectedObjects.splice(_,1);
        }
    }
    copiedObjs = [];
    for (let objId of selectedObjects) {
        let copiedObj = {
            vals: engine.getfromUUID(objId).getValues(),
            type: engine.getfromUUID(objId).typeId,
            components: engine.getfromUUID(objId).jsonComponents()
        }
        copiedObjs.push(copiedObj)
    }
}

function pasteObjects() {
    if (!pasted && !overUI) {
        let firstObjPos;
        for (let copiedObj of copiedObjs) {
            let _obj = (addObj(copiedObj.type, copiedObj.vals));
            console.log(copiedObj.components);
            for(let component of copiedObj.components) {
                console.log(component)
                _obj.components.push(new componentList[component.name]({...component.params,obj:_obj}))
            }
            let index =engine.getActiveScene().boxes.push(_obj);
            index--;
            obj =engine.getActiveScene().boxes[index];
           engine.getActiveScene().boxes[index].clr = 50;
            let offsetPosX = mouseCoords().x;
            let offsetPosY = mouseCoords().y;
            if (!firstObjPos)
                firstObjPos = [obj.x, obj.y];
            else {
                offsetPosX -= firstObjPos[0] - obj.x;
                offsetPosY -= firstObjPos[1] - obj.y;
            }
           engine.getActiveScene().reloadBoxes();
            obj.offSet(offsetPosX, offsetPosY);
            selectedObjects.push(obj.uuid);
        }
    }
    pasted = true;
}

function draw() {
    if (keyIsDown(17) && keyIsDown(86)) {
        pasteObjects();
    }else {
        pasted = false;
    }
    clear();
    background(150, 230, 240);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    if (Playing && !Paused)
        player.update();
    //Early Update
    if (!Paused)
       engine.getActiveScene().earlyUpdate();
    if (Playing && !Paused)
        player.camera();
    else
        translate(cameraPos.x, cameraPos.y)
    if (Playing && !Paused)
        player.checkCollisions();
   engine.getActiveScene().display();
    if (levelMode)
       engine.getActiveScene().customDraw();
    if (Playing)
        player.display();
    //Late Update
    if (!Paused)
       engine.getActiveScene().lateUpdate();
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //DRAW SELECT BOX
    if (selectBox[1]) {
        let rect1 = new Box(selectBox[0][0], selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
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
                let t_box = engine.getfromUUID(t_box_id);
                
                if(t_box) {
                    t_box.customDraw();
                    t_box.offSet(t_box.x += diffX, t_box.y += diffY, diffX, diffY);
                }else {
                    selectedObjects.splice(t_box_id,1);
                }
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
    if (lastScene != engine.activeScene) {
        selectedObjects = [];
        for (let t_info of infoDivs) {
            t_info.remove();
        }
    }
    lastScene = engine.activeScene;

    for (let t_box_id of selectedObjects) {
        let t_box = engine.getfromUUID(t_box_id);
        if(t_box){
            t_box.customDraw();
        }else {
            selectedObjects.splice(t_box_id,1);
        }
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
    let newFile = Object.keys(engine.files);
    if(Array.prototype.equals) {
        if(newFile.equals(OldFiles)) {

    }else {
        console.warn("added a file!/ changed");
        OldFiles = newFile;
        removeOldContent()
        readTypeAndName()
    }
}
}
function removeOldContent() {
    for(let i of ContentBrowserPanel.Divs) {
        i.remove();
    }
    ContentBrowserPanel.Divs = [];
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
       engine.getActiveScene().boxes.push(new classes[addSelect.value()](...classParameters));
       engine.getActiveScene().reloadBoxes();
    }
}

function OpenEditMenu() {
    //remove any non removed objs
    lastInfo = info;
    info = [];
    let lastIndexes = infoIndexes;
    infoIndexes = [];
    for (let objectId of selectedObjects) {
        let t_box = engine.getfromUUID(objectId);
        infoIndexes.push(objectId);
        if(t_box) {
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
        //console.log(info[i]);
        if (info[i + 1] === "noMenu" || info[i + 1] === "component" || info[i + 1] === "CustomButton") {
            //console.log("works");
            if (info[i + 1] === "noMenu") { // if (boxes[info[i]].components[info[i + 2]]) {
                //     boxes[info[i]].components[info[i + 2]].MenuEdit('sideMenu');
                // }
            } else if (info[i + 1] === "component") {
                if (engine.getfromUUID(info[i]).components[info[i + 2]]) {
                    engine.getfromUUID(info[i]).components[info[i + 2]].MenuEdit('sideMenu');
                }
            } else {
                let divHolder = createDiv();
                let ComponentSelect = createSelect();
                for (const [key, value] of Object.entries(componentList)) {
                    ComponentSelect.option(key);
                }
                ComponentSelect.parent(divHolder);
                let addButton = createButton("Add");
                addButton.mousePressed(() => {
                    engine.getfromUUID(info[i]).components.push(new componentList[ComponentSelect.value()]({
                        obj: engine.getfromUUID(info[i])
                    }))
                })
                addButton.parent(divHolder)
                divHolder.parent('sideMenu')
                infoDivs.push(divHolder);
            }
        } else {
            addMenuInput(info[i + 1], (val) => {
                let actValue = parseInt(val) ? parseInt(val) : val
                engine.getfromUUID(info[i])[info[i + 3]] = actValue;
                info[i + 2] = actValue;
            }, () => info[i + 2])
        }
    }
}
function readTypeAndName() {
    for(let nameOfFile in ContentBrowserPanel.files) {
        let _file = ContentBrowserPanel.files[nameOfFile];
        let typeOfFile = _file.type;
        console.warn(nameOfFile+typeOfFile);
        if(typeOfFile === ".js") {
            let _get = ()=>{return ContentBrowserPanel.files[nameOfFile].data}
            let set = (value)=>{
                //console.warn(ContentBrowserPanel.files[nameOfFile].whoUses)
                for(let ObjId in _file.whoUses) {
                    let script = _file.whoUses[ObjId];
                    script.fn = value;
                }
            };
            let inp = createButton(nameOfFile+typeOfFile).parent(ContentBrowserPanel.HUD);
            inp.mousePressed(() => {
                var popupWindow = window.open("popup.html?text=" + encodeURIComponent(_get().toString()), "Popup Window", "width=400,height=300");
                window.receivePopupText = (text) => {
                console.warn(text);
                _file.data = text;
                set(text);
                _get = () => text;
                };
            });
            inp.size(140,140);
            ContentBrowserPanel.Divs.push(inp);
        }else if(typeOfFile === ".img") {
            let inp = createButton(nameOfFile+typeOfFile).parent(ContentBrowserPanel.HUD);
            let _get = ()=>{return ContentBrowserPanel.files[nameOfFile].data}
            let set = (value)=>{
                //console.warn(ContentBrowserPanel.files[nameOfFile].whoUses)
                for(let ObjId in _file.whoUses) {
                    let script = _file.whoUses[ObjId];
                    script.src = value;
                }
            };
            inp.mousePressed(() => {
                let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
                window.jsonImage = (text) => {
                  console.warn(text);
                  _file.data = text.imageb64;
                  _get = set(text);
                };
              });
              inp.size(140,140);
              ContentBrowserPanel.Divs.push(inp);
        }
    }
}
function accordionMenu(headerText, inputField, name, onShow = () => {}) {
  let isExpanded = false;

  headerText.class("accordion-header");
      headerText.html("►" + name);
      inputField.style("max-height", "0px");
  inputField.class("accordion-content");
  inputField.hide();

  headerText.mousePressed(() => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      headerText.html("▼" + name);
      inputField.show();
        onShow();
      inputField.style("max-height", inputField.elt.scrollHeight + "px");
      setTimeout(() => {
          console.log("??");
          inputField.style('max-height', 'none');
      }, 400);
      inputField.style('margin-left', '1em');
    } else {
      headerText.html("►" + name);
      inputField.style("max-height", "0px");
      setTimeout(() => {
          onShow();
        inputField.hide();
      }, 200);
    }
  });

  return inputField;
}

function addEditableScript(name, set, get, parentName = "sideMenu", additionalDiv = []) {
  let divHolder = createDiv();
  let headerText = createSpan("Script Component").parent(divHolder);
  let _get = get;
  let inputField = createDiv();

  let _span = createSpan(name + ": ").parent(inputField);
  
  for (let div in additionalDiv) {
    div.parent(inputField);
  }

  let inp = createButton("Script").parent(inputField);
  inp.mousePressed(() => {
    var popupWindow = window.open("popup.html?text=" + encodeURIComponent(_get().toString()), "Popup Window", "width=400,height=300");
    window.receivePopupText = (text) => {
      console.log(text);
      set(text);
      _get = () => text;
    };
  });
  inp.size(177, 21);

  accordionMenu(headerText, inputField, "Script Component");

  infoDivs.push(divHolder);
  infoDivs[infoDivs.length - 1].parent(parentName);
  inputField.parent(divHolder);
  return [inputField,divHolder];
}

function addEditableSprite(name, set, get, parentName = "sideMenu") {
  let divHolder = createDiv();
  let headerText = createSpan("Sprite Component").parent(divHolder);
  let _get = get;
  let inputField = createDiv();

  let _span = createSpan(name + ": ").parent(inputField);

  let inp = createButton("Sprite").parent(inputField);

  accordionMenu(headerText, inputField, "Sprite Component");

  inp.mousePressed(() => {
    let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
    window.jsonImage = (text) => {
      console.log(text);
      _get = set(text);
    };
  });

  inp.size(177, 21);
  let infoId = infoDivs.push(divHolder);
  infoDivs[infoId - 1].parent(parentName);
  inputField.parent(divHolder);
}


function addMenuInput(name, set, get, par = 'sideMenu') {
    let divHolder = createDiv();
    divHolder.html();
    let _span = createSpan(name + ": ").parent(divHolder);
    let inp = createInput(get().toString()).style("opacity:0.5;")
    inp.parent(divHolder).input(() => {
        set(inp.value());
    });
    divHolder.elt.addEventListener("ValueChanged", () => {
        inp.value(get())
    });
    infoDivs.push(divHolder);
    infoDivs[infoDivs.length - 1].parent(par)
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
    for (t_box_id in engine.getActiveScene().boxes) {
        let t_box = engine.getActiveScene().boxes[t_box_id];
        let c = t_box.collision(rect1, false);
        if (c) {
            selectedObjects.push(t_box.uuid);
            //console.log(t_box.uuid);
        }
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
