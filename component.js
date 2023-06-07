var componentList = {};
class Component {
    constructor(name) {
        this.componentName = name;
        this.ownObject = {};
    }
    initialize() {

    }
    MenuEdit(parent) {

    }
    CustomButton(set = () => {}) {

    }
    toJson() {
        return { name: this.componentName };
    }
}

function addComponent(name, componentClass) {
    return componentList[name] = componentClass;
}