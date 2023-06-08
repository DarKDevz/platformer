class gameScript extends Component {
    constructor({ obj = {}, fn = '', vals = {} }) {
        super("gameScript");
        this.ownObject = obj;
        this.vals = {
            set shown(value) {
                if (typeof value === 'object' && Object.keys(value).length > 0) {
                    for (let key in obj.shown) {
                        if (obj.shown.hasOwnProperty(key)) {
                            value[key] = obj.shown[key];
                        }
                    }
                    console.log('The value is an object.');
                }
                obj.shown = value;
                // Call your custom function here
                console.log("valChanged", value);
            },
            get shown() {
                return obj.shown;
            }
        }
        this.vals.shown = vals;
        this.id = obj.components.length + 1;
        this.overrides = {};
        this.savedFuncs = {};
        this.newOverrides = {};
        this.fn = fn;
    }
    evalValues() {}
    set fn(source) {
        console.log("changed");
        //Updated script, update the object's script so it calls function
        this._src = source;
        this.ownObject.script = source;
        console.log(this.id);
        this.newOverrides = {};
        //console.log(this.components[this.id]);
        //this.components[this.id].evalValues(source);
        let _temp = {};
        let _Run = {
            set shown(value) {
                _temp = value;
                // Call your custom function here
                console.log("valChanged", value);
            },
            get shown() {
                return _temp;
            }
        };
        (new Function(source)).call(_Run);
        this.newOverrides = _Run;
        console.log(_Run);
        this.vals.shown = _Run.shown;
        delete this.newOverrides.shown
        console.log(this);
        if (this.savedFuncs[this.id] === undefined) this.savedFuncs[this.id] = {}
        this.overrides[this.id] = this.newOverrides;
        for (let i in this.overrides[this.id]) {
            console.log(i);
            //check if the overriden value even exists and if we want to replace with a function
            if (this.ownObject[i] !== undefined && typeof this.overrides[this.id][i] === "function") {
                if (this.savedFuncs[this.id][i] === undefined) {
                    this.savedFuncs[this.id][i] = this.ownObject[i];
                }
                this.ownObject[i] = () => {
                    let shouldSkip = false;
                    if (this.overrides[this.id][i] !== undefined) {
                        if (this.overrides[this.id][i].bind(this.ownObject)(...arguments) === 1) {
                            shouldSkip = true;
                        }
                    } else {
                        //script has been deleted
                        this.ownObject[i] = this.savedFuncs[this.id][i].bind(this.ownObject)
                    }
                    if (!shouldSkip) {
                        this.savedFuncs[this.id][i].call(this.ownObject, ...arguments);
                    }
                }
                console.log(this.overrides[this.id][i]);
            } else {
                this.ownObject[i] = this.overrides[this.id][i];
            }
        }
        console.log(this.overrides);
        return source;
    }
    get fn() {
        return this._src
    }
    MenuEdit(parent) {
        if (!addEditableScript) return;
        console.log(this);
        let mainDiv = addEditableScript("function", (val) => {
            let actValue = val;
            this.fn = actValue;
            return actValue;
        }, this.fn, parent);
        for (let value in this.vals.shown) {
            console.log(this.vals.shown[value]);
            //window.vals.push(this.vals.shown[value]);
            //parse int if necessary
            if(this.vals.shown[value] instanceof p5.Vector) {
                            addMenuInput(value + " x",
                (_) => { return this.vals.shown[value].x = parseInt(_) ? parseInt(_) : _ },
                () => { return this.vals.shown[value].x },
                mainDiv
            );
                                            addMenuInput(value + " y",
                (_) => { return this.vals.shown[value].y = parseInt(_) ? parseInt(_) : _ },
                () => { return this.vals.shown[value].y },
                mainDiv
            )
            }else {
            addMenuInput(value,
                (_) => { return this.vals.shown[value] = parseInt(_) ? parseInt(_) : _ },
                () => { return this.vals.shown[value] },
                mainDiv
            )
            }
        }
        //addMenuInput()
    }
    toJson() {
        return { name: this.componentName, params: { fn: this.fn, vals: this.vals.shown } };
    }
}
class gameSprite extends Component {
    constructor({ obj = {}, src = '' }) {
        super("gameSprite");
        this.ownObject = obj;
        console.log(src);
        this._src = src;
        this.src = src;
        this.sprite;
    }
    set src(value) {
        console.log("changed");
        return this._src = value;
    }
    get src() {
        return this._src
    }
    MenuEdit(parent) {
        if (!addEditableSprite) return;
        addEditableSprite("Image", (val) => {
            let actValue = val;
            console.log(val);
            this.src = actValue;
            return actValue;
        }, this.src, parent)
    }
    getSprite() {
        return this.sprite.get(...arguments)
    }
    reloadImage() {
        let _img = this.src;
        console.log(_img);
        var _sprite = loadImage("data:image/png;base64," + _img["imageb64"].toString());
        _sprite.width = _img.width;
        _sprite.height = _img.height;
        this.ownObject.sprite = _sprite;
        this.sprite = _sprite;
    }
    getImage() {
        return this.ownObject.sprite;
    }
    toJson() {
        return { name: this.componentName, params: { src: this.src } };
    }
}
addComponent("gameScript", gameScript);
addComponent("gameSprite", gameSprite);
