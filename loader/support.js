let temp = {};
var levels = new Proxy(temp,{
    set(target, key, value) {
        engine.scene[key] = value;
        console.error("level variable is deprecated, use engine.scene instead");
        return true;
    },
    get(target, key, receiver) {
        console.error("level variable is deprecated, use engine.scene instead");
        return engine.scene[key];
    }
})
let cList = new Proxy(temp,{
    set(target, key, value) {
        engine.componentList[key] = value;
        console.error("componentList is deprecated, use engine.componentList instead");
        return true;
    },
    get(target, key, receiver) {
        console.error("componentList is deprecated, use engine.componentList instead");
        return engine.componentList[key];
    }
})
Object.defineProperty(window,"componentList",{
    set(value) {
        cList = Object.assign(cList,value);
        console.error("componentList variable is deprecated, use engine.componentList instead");
        return true;
    },
    get() {
        console.error("componentList variable is deprecated, use engine.componentList instead");
        return cList;
    }
})
var boxes = new Proxy(temp,{
    set(target, key, value) {
        this.getActiveScene().boxes[key] = value;
        console.error("Boxes variable is deprecated, use engine.scene instead");
        return true;
    },
    get(target, key, receiver) {
        console.error("Boxes variable is deprecated, use engine.scene instead");
        return this.getActiveScene().boxes[key];
    }
})
Object.defineProperty(window,"activeLevel",{
    set(value) {
        engine.activeScene = value;
        console.error("activeLevel variable is deprecated, use engine.activeScene instead");
        return true;
    },
    get() {
        console.error("activeLevel variable is deprecated, use engine.activeScene instead");
        return engine.activeScene;
    }
})