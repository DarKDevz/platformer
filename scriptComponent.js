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
        this.src = src;
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
    toJson() {
        return { name: this.componentName, params: { src: this.src } };
    }
}
addComponent("gameScript", gameScript);
addComponent("gameSprite", gameSprite);