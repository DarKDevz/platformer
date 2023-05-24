var levels = [];
var activeLevel;

function getCurrentBoxes() {
    return levels[activeLevel].boxes
}

function removeObject(objId) {
    delete levels[activeLevel].boxes[objId];
    //filter empty
    levels[activeLevel].boxes = getCurrentBoxes().filter((_) => {
        return _
    })
    levels[activeLevel].reloadBoxes();
}

function addObj(ind, arr) {
    switch (ind) {
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
            break;
        case 4:
            return (new Enemy(...arr))
            break;
        case 5:
            return (new Interactive(...arr))
            break;
    }
}

function JsonMap(file) {
    let t_levels = []
    levels = [];
    boxes = [];
    var newLevels = JSON.parse(file.data)
    for (let level_id in newLevels) {
        console.log(level_id);
        if (!level_id.includes("l")) {
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
        } else {
            let extras = newLevels[level_id];
            console.log(newLevels[level_id]);
            addLevel(t_levels[extras[0]], createVector(extras[1], extras[2]), extras[3]);
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
    return "MapData={data:`" + JSON.stringify(mapData) + "`}";
}
addLevel = function(arr, pos, maxPos = 500) {
    return levels.push(new Level(arr, pos, maxPos))
}