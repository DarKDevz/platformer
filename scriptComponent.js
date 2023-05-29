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
addComponent("gameScript", gameScript);