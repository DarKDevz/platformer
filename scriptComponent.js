class gameScript extends Component {
    constructor({ obj, fn }) {
        super("gameScript");
        this.ownObject = obj;
        this.fn = fn;
    }
    MenuEdit(parent) {
        if (!addEditableScript) return;
        addEditableScript("function", (val) => {
            let actValue = val;
            this.fn = actValue;
            return actValue;
        }, this.fn, parent)
    }
    toJson() {
        return { name: this.componentName, params: { fn: this.fn } };
    }
}
class gameSprite extends Component {
    constructor({ obj, src }) {
        super("gameSprite");
        this.ownObject = obj;
        console.log(src);
        this.src = src;
        this.sprite;
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