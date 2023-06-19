var makingNew = false,
    forceMenuUpdate = false,
    forceBrowserUpdate = false,
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
    lastInfo = [],
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
class Editor {
    constructor() {}
    onUpdate() {
        if (selectBox[1]) {
            let rect1 = new Box(selectBox[0][0], selectBox[0][1], selectBox[1][0] - selectBox[0][0], selectBox[1][1] - selectBox[0][1]);
            fill(0, 0, 0, 25);
            rect(rect1.x, rect1.y, rect1.width, rect1.height);
        }
        /*------------------SelectBox Stuff---------------------*/
        if (!levelMode && lastWasPressed != Pressed && mouseIsPressed && mouseButton === LEFT) {
            selectBox.push([this.mouseCoords().x, this.mouseCoords().y]);
        }
        if (mouseIsPressed && mouseButton === CENTER) {
            let diffX = mouseX - pmouseX
            let diffY = mouseY - pmouseY
            if (selectedObjects.length !== 0) {
                for (let t_box_id of selectedObjects) {
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
            this.releaseSelectBox();
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
                this.OpenEditMenu()
        }
        let newFile = Object.keys(engine.files);
        if(Array.prototype.equals) {
            if(newFile.equals(OldFiles) && !forceBrowserUpdate) {
    
        }else {
            forceBrowserUpdate = false;
            console.warn("added a file!/ changed");
            OldFiles = newFile;
            removeOldContent()
            readTypeAndName()
            }
        }
    }
    mouseCoords() {
        return createVector(round(Playing && !Paused ? mouseX + player.cameraPos.x : mouseX - cameraPos.x), round(Playing && !Paused ? mouseY + player.cameraPos.y : mouseY - cameraPos.y))
    }
    transformCoordinates(drawSelect) {
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
    onMouseUp() {
        if (!selectBox[0])
        return;
    selectBox[1] = [this.mouseCoords().x, this.mouseCoords().y];
    let drawSelect = selectBox;
    let rect1;
    rect1 = new Box(...this.transformCoordinates(drawSelect));

    if (!rect1)
        return;
    if (makingNew)
        return newBox = rect1;
    selectedObjects = [];
    for (let t_box_id in engine.getActiveScene().boxes) {
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
    onResize() {
        pauseButton.position(windowWidth / 2, 0);
        button.position(windowWidth / 2 - 45, 0);
        sideMenu.position(windowWidth - 300, 0);
        ContentBrowserPanel.Holder.size(windowWidth,windowHeight/4);
        ContentBrowserPanel.Holder.position(0,windowHeight-windowHeight/4);
    }
    releaseSelectBox() {
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
    copyObject() {
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
    uiButton(name, x, y) {
        let button = createButton(name);
        button.position(x, y);
        this.uiElement(button);
        return button;
    }
    uiElement(element) {
        element.mouseOver(() => overUI = true);
        element.mouseOut(() => overUI = false);
    }
    saveMap() {
        let jsMap = createWriter('t_map_t.js');
        jsMap.write(MapJson());
        jsMap.close();
    }
    levelScreen() {
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
    pasteObjects() {
        if (!pasted && !overUI) {
            let firstObjPos;
            for (let copiedObj of copiedObjs) {
                if(copiedObj.type===''||copiedObj.type===undefined) {
                    console.warn('Empty type means not copiable');
                } else {
                let _obj = (addObj(copiedObj.type, copiedObj.vals));
                console.log(copiedObj.components);
                for(let component of copiedObj.components) {
                    console.log(component)
                    _obj.components.push(new engine.componentList[component.name]({...component.params,obj:_obj}))
                }
                let index =engine.getActiveScene().boxes.push(_obj);
                index--;
                obj =engine.getActiveScene().boxes[index];
               engine.getActiveScene().boxes[index].clr = 50;
                let offsetPosX = this.mouseCoords().x;
                let offsetPosY = this.mouseCoords().y;
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
        }
        pasted = true;
    }
    removeMapObject() {
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
    onSetup() {
        button = this.uiButton('Play', windowWidth / 2 - 45, 0);
    this.uiElement(button);

    inputFile = createFileInput(
        (file)=>{
            JsonMap(file)
        });
    inputFile.style("display: none");
    visibleInputFile = this.uiButton("load File", 145, 0)
    visibleInputFile.mouseClicked((e) => {
        inputFile.elt.click(e)
    })
    this.uiElement(visibleInputFile);

    addButton = this.uiButton('add New', 75, 0);
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
    saveButton = this.uiButton("Save", 212, 0);
    saveButton.mousePressed(this.saveMap);
    this.uiElement(saveButton);

    pauseButton = this.uiButton('Paused', windowWidth / 2, 0);
    pauseButton.mousePressed(() => {
        Paused = !Paused
    });
    sideMenu = createDiv();
    sideMenu.size(300);
    sideMenu.style("max-height:calc(100vh - 20px);overflow:auto;height:fit-content;background-color: rgba(0, 0, 0, 0.25);");
    //sideMenu.size(300, 200);

    sideMenu.position(windowWidth - sideMenu.size().width, 0);
    sideMenu.id('sideMenu');
    this.uiElement(sideMenu);
    ContentBrowserPanel.Holder = createDiv();
    ContentBrowserPanel.Main = createDiv();
    ContentBrowserPanel.Main.parent(ContentBrowserPanel.Holder);
    let _ = createDiv()
    createDiv('ContentBrowserPanel').parent(_)
    _.mousePressed(()=>{showBrowserPanel()})
    _.style('cursor: pointer;')
    //_.class("accordion-content");
    _.parent(ContentBrowserPanel.Main);
    ContentBrowserPanel.HUD = createDiv();
    ContentBrowserPanel.HUD.parent(ContentBrowserPanel.Main)
    ContentBrowserPanel.Holder.size(windowWidth,windowHeight/4);
    ContentBrowserPanel.Holder.class('contentBrowser');
    ContentBrowserPanel.HUD.style('display: flex; align-items: center; flex-flow: row wrap; place-content: stretch space-around;     justify-content: flex-start; align-content: center; flex-direction: row; flex-wrap: wrap;')
    ContentBrowserPanel.Main.class("accordion-content");
    ContentBrowserPanel.Main.elt.style.maxHeight = windowHeight/4+"px";
    ContentBrowserPanel.Main.maxHeight = '';
    /*display: flex;
    align-items: flex-start;
    // justify-items: stretch; 
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: stretch;*/
    ContentBrowserPanel.Main.style("position:relative;background-color: rgba(0, 0, 0, 0.25);overflow:auto;");
    ContentBrowserPanel.Holder.position(0,windowHeight-windowHeight/4);
    this.uiElement(ContentBrowserPanel.Main);
    actionButtons = createDiv();
    actionButtons.id('actionMenu');
    actionButtons.parent('sideMenu');

    copyButton = createButton('Copy');
    copyButton.mousePressed(this.copyObject);
    copyButton.parent('actionMenu');
    this.uiElement(copyButton);
    removeButton = createButton('Remove');
    removeButton.mousePressed(this.removeMapObject);
    removeButton.parent('actionMenu');
    this.uiElement(removeButton);
    levelButton = createButton('Level');
    levelButton.mousePressed(this.levelScreen);
    levelButton.parent('actionMenu');
    this.uiElement(levelButton);

    JsonMap(MapData);

    button.mousePressed(() => {
       engine.getActiveScene().loadLevel();
        Playing = !Playing;
    });

    lastScene = engine.activeScene;
    cameraPos = createVector(0, 0);
    }
    OpenEditMenu() {
        //remove any non removed objs
        lastInfo = info;
        info = [];
        let lastIndexes = infoIndexes;
        infoIndexes = [];
        for (let objectId of selectedObjects) {
            let t_box = engine.getfromUUID(objectId);
            infoIndexes.push(objectId);
            if(t_box) {
            for (let t_val_id in t_box.getValues()) {
                info.push(objectId);
                info.push(t_box.getValuesName()[t_val_id])
                info.push(t_box.getValues()[t_val_id])
                info.push(t_box.getActualValuesName()[t_val_id])
            }
            if (t_box.components) {
                for (let componentId in t_box.components) {
                    let components = t_box.components[componentId];
                    info.push(objectId);
                    info.push("component")
                    info.push(componentId)
                    info.push(components.shouldUpdateMenu);
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
        if (info.equals(lastInfo) && !forceMenuUpdate) {
            return;
        }
        let newInfo = lastInfo.length !== info.length
        let noNewObjects = lastIndexes.equals(infoIndexes)
        if (!newInfo && noNewObjects && !forceMenuUpdate) {
            //edit existing values
            for (let t_info of infoDivs) {
                t_info.elt.dispatchEvent(valChanged);
                //Hacky solution to fix updating dom every time
                /*if (infoI < info.length)
                    t_info.child()[1].value = info[infoI + 2].toString();*/
            }
            return;
        }
        forceMenuUpdate = false;
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
                    for (const [key, value] of Object.entries(engine.componentList)) {
                        if(key!=="gameFile")ComponentSelect.option(key);
                    }
                    ComponentSelect.parent(divHolder);
                    let addButton = createButton("Add");
                    divHolder.elt.ondrop = (event) => {
                        console.log(event);
                        console.warn(event.dataTransfer.getData("UUID"));
                        let uuid = event.dataTransfer.getData("UUID");
                        let file = engine.files[uuid];
                        if(file.type === ".js") {
                            engine.getfromUUID(info[i]).components.push(
                                new engine.componentList['gameScript']( {
                                    obj: engine.getfromUUID(info[i]),
                                    fileUUID: uuid
                                })
                            )
                        }else if(file.type === ".img") {
                            let gSprite = new engine.componentList['gameSprite']( {
                                obj: engine.getfromUUID(info[i]),
                                fileUUID: uuid
                            });
                            engine.getfromUUID(info[i]).components.push(gSprite)
                            //gSprite.reloadImage()
                        }
                        console.warn(file);
                    }
                    divHolder.elt.ondragover = (event) => {
                        event.preventDefault();
                        window.mouseReleased = () =>{}
                        //console.warn(event.dataTransfer.getData("UUID"));
                    }
                    addButton.mousePressed(() => {
                        engine.getfromUUID(info[i]).components.push(new engine.componentList[ComponentSelect.value()]({
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
}
var editor = new Editor()
//Browser Panel Stuff
function removeOldContent() {
    for(let i of ContentBrowserPanel.Divs) {
        i.remove();
    }
    ContentBrowserPanel.Divs = [];
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
            inp.elt.draggable = "true";
            inp.elt.ondragstart = (event)=>{
                event.dataTransfer.setData("UUID",ContentBrowserPanel.files[nameOfFile].UUID);
                console.log(ContentBrowserPanel.files[nameOfFile]);
            }
            inp.mousePressed(() => {
                if(mouseButton === "right") {

                }else {
                    function mouseReleased() {
    
                    };
                    window.mouseReleased = () => {
                        window.mouseReleased = () => {};
                        var popupWindow = window.open("popup.html?text=" + encodeURIComponent(_get().toString()), "Popup Window", "width=400,height=300");
                        window.receivePopupText = (text) => {
                        console.warn(text);
                        _file.data = text;
                        set(text);
                        _get = () => text;
                };}
            }
            });
            inp.size(140,140);
            ContentBrowserPanel.Divs.push(inp);
        }else if(typeOfFile === ".img") {
            let img = createImg("data:image/png;base64,"+_file.data).parent(ContentBrowserPanel.HUD);
            img.elt.draggable = "true";
            img.elt.ondragstart = (event)=>{
                event.dataTransfer.setData("UUID",ContentBrowserPanel.files[nameOfFile].UUID);
                console.log(ContentBrowserPanel.files[nameOfFile]);
            }
            let _get = ()=>{return ContentBrowserPanel.files[nameOfFile].data}
            let set = (value)=>{
                forceBrowserUpdate = true;
                //console.warn(ContentBrowserPanel.files[nameOfFile].whoUses)
                for(let ObjId in _file.whoUses) {
                    let script = _file.whoUses[ObjId];
                    script.src = value;
                }
            };
            img.mousePressed(() => {
                console.log(mouseButton);
                if(mouseButton === "right") {

                }else {
                    window.mouseReleased = () => {
                        this.mouseReleased = ()=>{}
                let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
                popup._ImageData = () =>{
                    return _get();
                }    
                window.jsonImage = (text) => {
                    console.warn(text);
                    _file.data = text.imageb64;
                    _get = ()=>{return text};
                    };
                    }
                }
              });
              img.size(140,140);
              ContentBrowserPanel.Divs.push(img);
        }
    }
}
function showBrowserPanel() {
    if(ContentBrowserPanel.HUD.elt.style.display === 'none') {
        ContentBrowserPanel.Holder.elt.style.maxHeight = '';
        ContentBrowserPanel.Main.elt.style.maxHeight = windowHeight/4+"px";
        ContentBrowserPanel.HUD.elt.style.display = 'flex';
        ContentBrowserPanel.Holder.position(0,windowHeight-windowHeight/4);
    }else {
        ContentBrowserPanel.HUD.hide();
        ContentBrowserPanel.Holder.position(0,windowHeight-ContentBrowserPanel.Main.child()[0].scrollHeight);
        ContentBrowserPanel.Main.elt.style.maxHeight = ContentBrowserPanel.Main.child()[0].scrollHeight;
        ContentBrowserPanel.Holder.elt.style.height = ContentBrowserPanel.Main.child()[0].scrollHeight;
    }
}
//Accordion menu, menu edit, script edit, image edit
//Don't touch could break everything
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
//UtilFunc
function addEditableScript(name, set, get, parentName = "sideMenu", additionalDiv = [],
replaceButton = false) {
  let divHolder = createDiv();
  let headerText = createSpan("Script Component").parent(divHolder);
  let _get = get;
  let inputField = createDiv();
  inputField.child(...additionalDiv);
  let inp;
  if(replaceButton) {
    inp = replaceButton;
  }else {
  let _span = createSpan(name + ": ").parent(inputField);
  inp = createButton("Script").parent(inputField);
  }
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
//UtilFunc
function addEditableSprite(name, set, get,
     parentName = "sideMenu",
     additionalDivs = [],
     replaceButton = false
     ) {
  let divHolder = createDiv();
  let headerText = createSpan("Sprite Component").parent(divHolder);
  let _get = get;
  let inputField = createDiv();
  inputField.child(...additionalDivs);
  if(replaceButton) {
    inp = replaceButton;
  }else {
  let _span = createSpan(name + ": ").parent(inputField);
  let inp = createButton("Sprite").parent(inputField);
  }
  accordionMenu(headerText, inputField, "Sprite Component");
  inp.mousePressed(() => {
    
    let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
    popup._ImageData = () =>{
        return _get();
    } 
    console.log(_get);
    window.jsonImage = (text) => {
      console.log(text);
      _get = ()=>{set(text)};
    };
  });

  inp.size(177, 21);
  let infoId = infoDivs.push(divHolder);
  infoDivs[infoId - 1].parent(parentName);
  inputField.parent(divHolder);
  return [inputField,divHolder];
}
//UtilFunc
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
var classes = {
    Box: Box,
    Text: Text,
    Platform: movingPlatform,
    End: End,
    Enemy: Enemy,
    Interact: Interactive
};