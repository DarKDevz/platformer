window['test'] = [];
class gameScript extends Component {
    constructor({obj={}, fn='', vals={}}) {
        super("gameScript");
        this.ownObject = obj;
        let temp = {}
        this.vals = {
            set shown(value) {
                if(value.ObjTest) {
                    console.log(typeof value.ObjTest);
                    window['test'].push(typeof value.ObjTest,value.ObjTest);
                }
                if (typeof value === 'object' && Object.keys(value).length > 0) {
                    for (let key in obj.shown) {
                        if (value.hasOwnProperty(key)) {
                            console.warn(obj.shown[key],value[key]);
                            value[key] = replaceValues(obj.shown[key],value[key]);
                        }
                    }
                    //console.log('The value is an object.');
                }
                obj.shown = value;
                let normalObject = removeNonNormal(value);
                if(typeof normalObject === "object") {
                for(let i in normalObject) {
                    this.editableVals[i] = normalObject[i];
                    console.log(i);
                }
            }else {
                this.editableVals[''] = normalObject;
            }
                //this.editableVals = removeNonNormal(value);
                // Call your custom function here
                console.log("valChanged", value);
            },
            get shown() {
                return obj.shown;
            },
            editableVals: new Proxy(temp,{
                set(target, key, value) {
                    console.log("works? maybe?")
                    if(key === "") {target = value;}
                    else {target[key] = value;}
                    console.log(key);
                    //target[key] = tValue[key];
                    return true;
                },
                get(target, key, receiver) {
                    return target[key];
                }
            })
        }
        this.vals.shown = vals;
        this.id = obj.components.length + 1;
        this.overrides = {};
        this.savedFuncs = {};
        this.newOverrides = {};
        this.fn = fn;
    }
    updateValues() {
        for (let key in this.ownObject.shown) {
            if (this.vals.editableVals.hasOwnProperty(key)) {
                console.warn(this.ownObject.shown[key],this.vals.editableVals[key]);
                this.ownObject.shown[key] = replaceValues(this.vals.editableVals[key],this.ownObject.shown[key]);
            }
        } 
    }
    evalValues() {}
    set fn(source) {
        console.log("changed");
        //Updated script, update the object's script so it calls function
        this._src = source;
        this.ownObject.script = source;
        //console.log(this.id);
        this.newOverrides = {};
        //console.log(this.components[this.id]);
        //this.components[this.id].evalValues(source);
        let _temp = {};

        let _Run = {
            shown: new Proxy(_temp,{
                set(target, key, value) {
                    target[key] = value;
                    let tValue = (target);
                    console.log(value, removeNonNormal(target));
                    if (key === "valueDetected") {
                        console.log("valueDetected is added or modified:", value);
                    }
                    target[key] = tValue[key];
                    return true;
                }
            })
        };
        (new Function(source)).call(_Run);
        this.newOverrides = _Run;
        console.log(_Run, _temp);
        this.vals.shown = _temp;
        delete this.newOverrides.shown
        console.log(this);
        if (this.savedFuncs[this.id] === undefined)
            this.savedFuncs[this.id] = {}
        this.overrides[this.id] = this.newOverrides;
        for (let i in this.overrides[this.id]) {
            console.log(i);
            //check if the overriden value even exists and if we want to replace with a function
            if (this.ownObject[i] !== undefined && typeof this.overrides[this.id][i] === "function") {
                if (this.savedFuncs[this.id][i] === undefined) {
                    this.savedFuncs[this.id][i] = this.ownObject[i];
                }
                this.ownObject[i] = ()=>{
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
    addNewEditObj(obj, parent='sideMenu') {
        let Holder = parent
        //console.log(obj)
        for (let i in obj) {
            //console.log(i, obj[i], typeof obj[i]);
            if (typeof obj[i] === "object") {
                let divHolder = createDiv().parent(parent);
                let headerText = createDiv();
                Holder = accordionMenu(headerText, createDiv(), i);
                headerText.parent(divHolder);
                Holder.parent(divHolder);
                infoDivs.push(headerText);
                this.addNewEditObj(obj[i], Holder);
            } else {
                addMenuInput(i, (_)=>{
                    obj[i] = parseInt(_) ? parseInt(_) : _
                    this.updateValues();
                    return obj[i]
                }
                , ()=>{
                    return obj[i]
                }
                , parent)
                //console.log("final Object", obj[i]);
            }
        }
    }
    MenuEdit(parent) {
        if (!addEditableScript)
            return;
        console.log(parent);
        let mainDiv = addEditableScript("function", (val)=>{
            let actValue = val;
            this.fn = actValue;
            return actValue;
        }
        , ()=>this.fn, parent);
        this.addNewEditObj(this.vals.editableVals, mainDiv[0]);
    }
    toJson() {
        return {
            name: this.componentName,
            params: {
                fn: this.fn,
                vals: this.vals.editableVals
            }
        };
    }
}
class gameSprite extends Component {
    constructor({obj={}, src='', fileUUID=''}) {
        super("gameSprite");
        if(fileUUID!=='') {
            this.fileData = engine.files[fileUUID];
        }else {
            //Support for Old Loading Images
            this.fileData = addGameFile(src.imageb64);
        }
        this.ownObject = obj;
        console.log(src);

        this._src = src;
        this.src = src;
        //engine.assignUUID("Image File");
        this.sprite;
    }
    set src(value) {
        console.log("changed");
        console.warn("the src has been set", value);
        if(value.imageb64)this.fileData.data = value.imageb64;
        delete value.imageb64;
        return this._src = value;
    }
    get src() {
        return this._src
    }
    MenuEdit(parent) {
        if (!addEditableSprite)
            return;
        addEditableSprite("Image", (val)=>{
            let actValue = val;
            console.log(val);
            this.src = actValue;
            return actValue;
        }
        , this.src, parent)
    }
    getSprite() {
        return this.sprite.get(...arguments)
    }
    reloadImage() {
        let _img = this.src;
        console.log(_img);
        var _sprite = loadImage("data:image/png;base64," + this.fileData.data.toString());
        _sprite.width = _img.width;
        _sprite.height = _img.height;
        this.ownObject.sprite = _sprite;
        this.sprite = _sprite;
    }
    getImage() {
        return this.ownObject.sprite;
    }
    toJson() {
        //this._src.imageb64 = this.fileData.data;
        let _return = {
            name: this.componentName,
            params: {
                src: {...this._src},
                fileUUID: this.fileData.UUID
            }
        };
        return _return
    }
}
class gameFile extends Component {
    constructor(data,UUID) {
        super("gameFile");
        this.UUID = UUID;
        console.warn(data);
        this.data = data.toString();
        engine.files[UUID] = this;
    }
    get File() {
        return this.data;
    }
    set File(value) {
        return this.data = value;
    }
}
addComponent("gameScript", gameScript);
addComponent("gameSprite", gameSprite);
addComponent("gameFile", gameFile);
function checkifexists(data) {
    for(let fileUUID in engine.files) {
        let file = engine.files[fileUUID];
        if(file.data === data) return file;
    }
    return false;
}
function addGameFile(data) {
    let fileexists = checkifexists(data)
    if(fileexists) {
        return fileexists;
    }
    let fUUID = engine.generateUUID();
    fileexists = new gameFile(data,fUUID)
    //alert(fileexists.data);
    return fileexists;
}
function replaceValues(obj, replaced) {
    if(typeof obj !== "object") {
        return obj;
    }
    for (let key in obj) {
      if (replaced.hasOwnProperty(key)) {
        replaced[key] = obj[key];
      } else if (typeof obj[key] === 'object' && typeof replaced[key] === 'object') {
        replaced[key] = replaceValues(obj[key], replaced[key]);
      }
    }
  
    return replaced;
}
function removeNonNormal(obj) {
    const replacer = (key,value)=>{
        if (key === "p5")
            return undefined
        if (key === "" || value instanceof p5.Vector)
            return value;
        console.log(key, value.constructor.name, typeof value);
        if (value.constructor.name !== "Object" && value.constructor.name !== "String" && value.constructor.name !== "Number" && value.constructor.name !== "Boolean") {
            return undefined;
            // Ignore the property
        }
        return value;
        // Serialize the property as usual
    }
    ;

    const jsonString = JSON.stringify(obj, replacer);
    return JSON.parse(jsonString)
}
