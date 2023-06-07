class gameScript extends Component {
    constructor({ obj = {}, fn = '' , vals = {}}) {
        super("gameScript");
        this.ownObject = obj;
        this.fn = fn;
        this.vals = vals;
    }
    set fn(value) {
        console.log("changed");
        //Updated script, update the object's script so it calls function
        this._src = value;
        this.ownObject.script = value;
        return value;
    }
    get fn() {
        return this._src
    }
    MenuEdit(parent) {
        if (!addEditableScript) return;
        console.log(this);
        addEditableScript("function", (val) => {
            let actValue = val;
            this.fn = actValue;
            return actValue;
        }, this.fn, parent);
        for(let value in this.vals) {
            console.log(this.vals[value]);
            //addMenuInput()
        }
        //addMenuInput()
    }
    toJson() {
        return { name: this.componentName, params: { fn: this.fn, vals: this.vals} };
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
        addEditableSprite("function", (val) => {
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
