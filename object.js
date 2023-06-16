class GameObject {
    constructor(x, y, tag) {
        this.x = x;
        this.y = y;
        this.width = 1;
        this.height = 1;
        this.isCollidable = false;
        this.tag = tag;
        this.components = [];
        this.overrides = {};
        this.savedFuncs = {};
        this.newOverrides = {};
        this.uuid = engine.generateUUID();
        engine.uuidList[this.uuid] = this;
    }
    jsonComponents() {
        let ret = [];
        for(let comp of this.components) {
            ret.push(comp.toJson());
        }
        return ret;
    }
    init() {
        
    }
    getClassName() {
        return "GameObject"
    }
    offSet(x, y) {
        this.x = x;
        this.y = y;
    }
    getValues() {
        return [this.x, this.y];
    }
    getValuesName() {
        return ["x", "y"];
    }
    getActualValuesName() {
        return ["x", "y"];
    }
    display() {

    }
    collision(obj, trigger = false) {
        var oX, oY, oW, oH;
        if (obj.pos !== undefined) {
            oX = obj.pos.x;
            oY = obj.pos.y;
        } else {
            oX = obj.x;
            oY = obj.y;
        }
        if (obj.size !== undefined) {
            oW = obj.size.x;
            oH = obj.size.y;
        } else {
            oW = obj.width;
            oH = obj.height;
        }
        let rect2 = {
            x: oX,
            y: oY,
            width: oW,
            height: oH,
        }
        let collides = collide(this, rect2);
        if (collides && trigger) this.onCollide();
        return collides;
    }
    update() {

    }
    earlyUpdate() {

    }
    lateUpdate() {

    }
    customDraw() {
        point(this.x, this.y)
    }
}
