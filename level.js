var levels = [];
var activeLevel;

function getCurrentBoxes() {
    return levels[activeLevel].boxes
}

function removeObject(objId) {
    delete levels[activeLevel].boxes[objId];
    levels[activeLevel].boxes = getCurrentBoxes().filter(Boolean);
    levels[activeLevel].reloadBoxes();
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

function JsonMap(file) {
    let t_levels = []
    levels = [];
    boxes = [];
    var newLevels = JSON.parse(file.data)
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
                    console.log(components, BoxId);
                    let _componentList = [];
                    for (let component of components) {
                        var level = levels[level_id.slice(0, -1)];
                        var box = level.boxes[BoxId];
                        var componentConstructor = componentList[component.name];
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
            console.log(newLevels[level_id]);
        }
    }

    levels[0].loadLevel();
}
class Level {
    constructor(arr, pos, maxPos) {
        this.boxes = arr;
        this.ind = levels.length;
        this.pos = pos;
        this.maxPos = maxPos;
    }
    customDraw() {
        stroke(0, 0, 255);
        line(this.pos.x, this.pos.y, this.pos.x + 25, this.pos.y);
        stroke(0, 255, 0);
        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + 25);
        stroke(255, 0, 0);
        line(player.posCenter().x - width / 2, this.maxPos, player.posCenter().x + width / 2, this.maxPos);
        stroke(0);
    }
    display() {
        for (let t_box of this.boxes) {
            t_box.display();
        }
    }
    lateUpdate() {
        for (let t_box of this.boxes) {
            t_box.lateUpdate();
        }
    }
    earlyUpdate() {
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
        this.reloadBoxes();
        activeLevel = this.ind;
    }
    reloadBoxes() {
        boxes = this.boxes;
    }
    componentsJson() {
        const usableBoxes = this.boxes.filter((box) => box.components.length !== 0);
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
        const usableBoxes = this.boxes.filter((box) => box.typeId !== undefined);
        const boxVals = usableBoxes.map((t_box) => [t_box.typeId, ...t_box.getValues()]);

        return boxVals;
    }
}

function MapJson() {
    let mapData = {};
    mapData = {};
    for (let level of levels) {
        mapData[level.ind] = level.toJSON()
    }
    for (let level of levels) {
        mapData[level.ind + "l"] = level.extrasJson()
    }
    for (let level of levels) {
        mapData[level.ind + "c"] = level.componentsJson()
    }
    return JSON.stringify(mapData);
}
function addLevel(arr, pos, maxPos = 500) {
    let _level = new Level(arr,pos,maxPos);
    levels.push(_level)
    return _level;
}
