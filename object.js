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
    }
    getClassName() {
        return "GameObject"
    }
    set script(source) {
        (new Function(source)).call(this.overrides);
        for (let i in this.overrides) {
            console.log(i);
            //check if the overriden value even exists and if we want to replace with a function
            if (this[i] !== undefined && typeof this.overrides[i] === "function") {
                if (this.savedFuncs[i] === undefined) {
                    this.savedFuncs[i] = this[i];
                }
                this[i] = function() {
                    this.overrides[i].call(this, ...arguments);
                    this.savedFuncs[i].call(this, ...arguments);
                }
                console.log(this.overrides[i]);
            } else {
                this[i] = this[this.overrides];
            }
        }
        console.log(this.overrides);
    }
    get script() {
        throw new Error("You shouldn't get it from here")
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