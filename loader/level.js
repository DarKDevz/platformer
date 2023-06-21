// var engine.scene = [];
// var engine.activeScene;
//var engine = new Engine();
//Support for Older Projects
class Engine {
    constructor() {
        this.scene = [];
        this.activeScene;
        this.files = {};
        this.uuidList = {};
        this.hasUUID = false;
        this.assignedUUID = 0;
        let _cList = engine.componentList?engine.componentList:{};
        this.componentList = Object.assign({},engine.componentList?engine.componentList:{});
    }
    deleteGameFile(id,value = false) {
        delete this.files[this.getByReference(id,value).UUID]
    }
    getByReference(id,value=false) {
        if(this.files[id]) {
            return this.files[id];
        }else {
            for(let fileUUID in this.files) {
                let file = this.files[fileUUID];
                if(!value) {
                    for(let type in file.references) {
                        let reference = file.references[type];
                        if(reference == id) return file;
                    }
                }
                if(file.references[id]===value) return file;
            }
            return false;
        }
    }
    customFileUUID(fileType) {
        if(this.hasUUID) {
            this.hasUUID = false;
            return this.assignedUUID;
        }
        let fileName = Array.from(fileType);
        fileName.shift();
        fileName = fileName.toString().replaceAll(",","")
        var UUID = fileName+"file";
        let stack = -1;
        while(this.files[UUID]) {
            stack++;
            UUID = fileName+"file"+stack;
            if(stack>=99999999) {
                throw new Error("Stack exceeded! Math.random is broken or uuid list is filled");
            }
        }
        return UUID;
    }
    assignUUID(UUID) {
        this.hasUUID = true;
        this.assignedUUID = UUID;
    }
    getfromUUID(UUID) {
        return this.uuidList[UUID];
    }
    getActiveScene() {
        return this.scene[this.activeScene];
    }
    changeUUID(ogUUId,newUUID) {
        let ogVal = this.uuidList[ogUUId];
        delete this.uuidList[ogUUId];
        this.uuidList[newUUID] = ogVal;
        return this.uuidList[newUUID];
    }
    generateUUID() {
        if(this.hasUUID) {
            this.hasUUID = false;
            return this.assignedUUID;
        }
        var UUID = "0x"+(Math.random()*99999999999999999).toString(16);
        let stack = 0;
        while(this.uuidList[UUID]) {
            stack++;
            UUID = "0x"+(Math.random()*99999999999999999).toString(16);
            if(stack>=99999999) {
                throw new Error("Stack exceeded! Math.random is broken or uuid list is filled");
            }
        }
        return UUID;
    }
}
function getCurrentBoxes() {
    return engine.getActiveScene().boxes
}
function deleteUser(obj) {
    let components = obj.components;
    for(let component of components) {
        //Don't remove files that aren't used
        component.deleteUser(false);
    }
}
function removeObject(objId) {
    if(typeof objId === "string" && objId.startsWith("0x")) {
        //it's passing an UUID, delete accordingly
        let obj = engine.uuidList[objId];
        deleteUser(obj)
        let sceneId = engine.getActiveScene().boxes.indexOf(obj)
        delete engine.uuidList[objId];
        engine.getActiveScene().boxes.splice(sceneId,1);
        engine.getActiveScene().boxes = getCurrentBoxes().filter(Boolean);
    }else if(typeof objId === "object") {
        deleteUser(objId);
        let sceneId = engine.getActiveScene().boxes.indexOf(objId)
        delete engine.uuidList[objId.uuid];
        engine.getActiveScene().boxes.splice(sceneId,1);
        engine.getActiveScene().boxes = getCurrentBoxes().filter(Boolean);
    }
    else {
    let obj = engine.getActiveScene().boxes[objId]
    if(!obj) return;
    deleteUser(obj)
    delete engine.uuidList[obj.uuid];
    delete engine.getActiveScene().boxes[objId];
    engine.getActiveScene().boxes = getCurrentBoxes().filter(Boolean);
    }
}

function addObj(ind, arr) {
    const objectMap = {
        0: Box,
        1: End,
        2: movingPlatform,
        3: Text,
        4: Enemy,
        5: Interactive
    };

    return new(objectMap[ind])(...arr);
}
function ScenesfromObject(levelsObject) {
    let t_levels = [];
    var newLevels = levelsObject;
    if(newLevels.file) {
        for(let file of newLevels.file) {
            for(let UUID in file) {
                engine.assignUUID(UUID);
                console.warn(file[UUID])
                if(typeof file[UUID] === "object") {
                    addGameFile(file[UUID].data,file[UUID].type,file[UUID].references?file[UUID].references:{});
                }else {
                    addGameFile(file[UUID]);
                }
            }
        }
        delete newLevels.file;
    }
    if(newLevels.version) {
        console.error("Engine Version:"+newLevels.version)
        delete newLevels.version;
    }
    for (let level_id in newLevels) {
        console.log(level_id);
        if (!level_id.includes("l") && !level_id.includes('c')) {
            let newLevel = newLevels[level_id];
            let t_boxes = [];
            for (let object of newLevel) {
                let _objInd = object.shift()
                t_boxes.push(addObj(_objInd, object))
            }
            t_levels.push(t_boxes);
            if (!newLevels[level_id + "l"]) {
                addLevel(t_boxes, createVector(400, -10));
            }
        } else if (level_id.includes("l")) {
            let extras = newLevels[level_id];
            console.log(newLevels[level_id]);
            addLevel(t_levels[extras[0]], createVector(extras[1], extras[2]), extras[3]);
        } else {
            for (let ObjwithComponents of newLevels[level_id]) {
                //console.log(_components);
                for (let BoxId in ObjwithComponents) {
                    let components = ObjwithComponents[BoxId];
                    if(BoxId==="UUID") {
                        for(let box in components) {
                            let ogUUID = engine.scene[level_id.slice(0, -1)].boxes[box].uuid;
                            engine.changeUUID(ogUUID,components[box])
                        }
                        //console.warn("UUID found:",engine.scene[level_id.slice(0, -1)].boxes);
                    }else if(BoxId==="file") {
                        console.warn(components);
                    }else {
                    let _componentList = [];
                    for (let component of components) {
                        var level = engine.scene[level_id.slice(0, -1)];
                        var box = level.boxes[BoxId];
                        var componentConstructor = engine.componentList[component.name];
                        var paramObj = {}
                        paramObj.obj = box;
                        for (let _param in component.params) {
                            paramObj[_param] = component.params[_param]
                        }
                        //paramObj.fn = component.params.fn
                        var newComponent = new componentConstructor({...paramObj });
                        _componentList.push(newComponent);
                        console.log(newComponent);
                    }
                    var box = level.boxes[BoxId];
                    box.components = _componentList;
                }
                }
            }
            console.log(newLevels[level_id]);
        }
    }

    engine.scene[0].loadLevel();
}
function JsonMap(file) {
    if(!(engine instanceof Engine)) {
        console.error("engine hasn't been initialized in setup()")
    }
    let cList = engine.componentList;
    engine = new Engine();
    engine.componentList = cList;
    ScenesfromObject(JSON.parse(file.data))
}
class Level {
    constructor(arr, pos, maxPos) {
        this.boxes = arr;
        this.ind = engine.scene.length;
        this.pos = pos;
        this.maxPos = maxPos;
    }
    customDraw(shouldRun = true) {
        if(!shouldRun) return 1;
        stroke(0, 0, 255);
        line(this.pos.x, this.pos.y, this.pos.x + 25, this.pos.y);
        stroke(0, 255, 0);
        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + 25);
        stroke(255, 0, 0);
        line(player.posCenter().x - width / 2, this.maxPos, player.posCenter().x + width / 2, this.maxPos);
        stroke(0);
    }
    display(OnlyDraw = false) {
        for (let t_box of this.boxes) {
            t_box.display(OnlyDraw);
        }
    }
    lateUpdate(shouldRun = true) {
        if(!shouldRun) return 1;
        for (let t_box of this.boxes) {
            t_box.lateUpdate();
        }
    }
    earlyUpdate(shouldRun = true) {
        if(!shouldRun) return 1;
        for (let t_box of this.boxes) {
            t_box.earlyUpdate();
        }
    }
    set posX(x) {
        this.pos.x = x;
    }
    get posX() {
        return this.pos.x;
    }
    set posY(y) {
        this.pos.y = y;
    }

    get posY() {
        return this.pos.y;
    }
    getActualLevelValues() {
        return ["ind", "posX", "posY", "maxPos"]
    }
    getLevelValues() {
        return [this.ind, this.posX, this.posY, this.maxPos]
    }
    getLevelValueNames() {
        return ["level Index", "starting Position x", "starting Position y", "Max Y Pos"]
    }
    loadLevel() {
        player.pos = this.pos.copy();
        player.cameraPos = player.pos.copy();
        player.grounded = false;
        player.groundedId = null;
        player.colliding = false;
        player.collidedId = null;
        player.vel = createVector(0, 0);
        engine.activeScene = this.ind;
        //Call init function of each;
        this.initiateBoxes();
    }
    initiateBoxes() {
        for (let t_box of this.boxes) {
            t_box.init();
        }
    }
    reloadBoxes() {
        //boxes = this.boxes;
        console.error("reloadBoxes isn't needed, you can remove all fucntion calls that use this");
    }
    componentsJson() {
        let usableBoxes = this.boxes.filter((box) => (box.components.length !== 0)&&(box.typeId !== undefined));
        const boxVals = usableBoxes.map((t_box) => {
            let _components = t_box.components;
            console.log(this.boxes.indexOf(t_box))
            let _newComponents = [];
            for (let _component of _components) {
                _newComponents.push(_component.toJson())
            }
            let finalObj = {};
            finalObj[this.boxes.indexOf(t_box)] = _newComponents;
            return finalObj;
        });
        return boxVals;
    }
    extrasJson() {
        return this.getLevelValues();
    }
    toJSON() {
        this.boxes = this.boxes.filter((box) => box.typeId !== undefined);
        const boxVals = this.boxes.map((t_box) => [t_box.typeId, ...t_box.getValues()]);

        return boxVals;
    }
}

function MapJson() {
    let mapData = {};
    mapData = {};
    let fileList = []
    for(let fileId in engine.files) {
        let file = engine.files[fileId]
        let obj = {};
        obj[fileId] =  {data:file.data.replaceAll('"',"'"),type:file.type,references:file.references};
        fileList.push(obj);
    }
    mapData["version"] = 1.0;
    mapData["file"] = fileList;
    for (let level of engine.scene) {
        mapData[level.ind] = level.toJSON()
    }
    for (let level of engine.scene) {
        mapData[level.ind + "l"] = level.extrasJson()
    }
    for (let level of engine.scene) {
        mapData[level.ind + "c"] = level.componentsJson()
    }
    engine.getActiveScene().loadLevel;
    return JSON.stringify(mapData);
}
function addLevel(arr, pos, maxPos = 500) {
    let _level = new Level(arr,pos,maxPos);
    engine.scene.push(_level)
    return _level;
}
