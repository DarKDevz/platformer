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
    set script(source) {
        // var this.id = 0;
        // for (let componentId in this.components) {
        //     let component = this.components[componentId];
        //     console.log(component);
        //     if (component._src && component._src === source) {
        //         console.log("found it", componentId);
        //         this.id = componentId;
        //     }
        // }
        // console.log(this.id);
        // this.newOverrides = {};
        // console.log(this.components[this.id]);
        // //this.components[this.id].evalValues(source);
        // (new Function(source)).call(this.newOverrides);
        // if (this.savedFuncs[this.id] === undefined) this.savedFuncs[this.id] = {}
        // this.overrides[this.id] = this.newOverrides;
        // for (let i in this.overrides[this.id]) {
        //     console.log(i);
        //     //check if the overriden value even exists and if we want to replace with a function
        //     if (this[i] !== undefined && typeof this.overrides[this.id][i] === "function") {
        //         if (this.savedFuncs[this.id][i] === undefined) {
        //             this.savedFuncs[this.id][i] = this[i];
        //         }
        //         this[i] = function() {
        //             let shouldSkip = false;
        //             if (this.overrides[this.id][i] !== undefined) {
        //                 if (this.overrides[this.id][i].bind(this)(...arguments) === 1) {
        //                     shouldSkip = true;
        //                 }
        //             } else {
        //                 //script has been deleted
        //                 this[i] = this.savedFuncs[this.id][i].bind(this)
        //             }
        //             if (!shouldSkip) {
        //                 this.savedFuncs[this.id][i].call(this, ...arguments);
        //             }
        //         }
        //         console.log(this.overrides[this.id][i]);
        //     } else {
        //         this[i] = this[this.overrides];
        //     }
        // }
        // console.log(this.overrides);
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
