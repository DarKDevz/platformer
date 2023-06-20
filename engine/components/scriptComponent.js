class gameScript extends Component {
    constructor({obj={}, fn='', vals={},fileUUID=''}) {
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
        if(fileUUID!=='') {
            this.file = engine.files[fileUUID];
            this.fn = this.file.data
            this.file.type = ".js";
            this.file.addUser(this,obj.uuid);
        }else {
            this.file = addGameFile(fn,'.js');
            this.fn = this.file.data;
            this.file.addUser(this,obj.uuid);
        }
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
                let script = this;
                this.ownObject[i] = function() {
                    let shouldSkip = false;
                    if (script.overrides[script.id][i] !== undefined) {
                        if (script.overrides[script.id][i].bind(this)(...arguments) === 1) {
                            shouldSkip = true;
                        }
                    } else {
                        //script has been deleted
                        script.ownObject[i] = script.savedFuncs[script.id][i].bind(this)
                    }
                    if (!shouldSkip) {
                        script.savedFuncs[script.id][i].call(this, ...arguments);
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
    AddFileEdit(parent) {
        let inp = createButton(this.file.UUID+this.file.type).parent(parent);
        inp.elt.ondrop = (event) => {
            console.log(event);
            console.warn(event.dataTransfer.getData("UUID"));
            let uuid = event.dataTransfer.getData("UUID");
            let file = engine.files[uuid];
            //If file isn't a script return
            if(file.type !== ".js") return;
            this.loadFile(file);
            forceMenuUpdate = true;
            //Replace old file with new file
        }
        inp.elt.ondragover = (event) => {
            event.preventDefault();
            window.mouseReleased = () =>{}
            //console.warn(event.dataTransfer.getData("UUID"));
        }
    }
    MenuEdit(parent) {
        if (!addEditableScript)
            return;
        console.log(parent);
        let fileHolder = createDiv()
        this.AddFileEdit(fileHolder);
        let mainDiv = addEditableScript("function", (val)=>{
            let actValue = val;
            //if only one uses it's better to replace the file
            //instead of just re-adding it and changing the name; 
            if(Object.keys(this.file.whoUses).length == 1) {
                this.file.data = actValue;
                this.loadFile(this.file);
            }else {
            this.loadFile(addGameFile(actValue,".js"));
            }
            return actValue;
        }
        , ()=>this.fn, parent,[fileHolder],fileHolder);
        this.addNewEditObj(this.vals.editableVals, mainDiv[0]);
    }
    loadFile(file) {
        if(this.file.UUID !== file.UUID) {
            delete this.file.whoUses[this.ownObject.uuid];
            if(Object.keys(this.file.whoUses).length == 0) {
                //If no one uses it delete it
                //alert("empty script");
                delete engine.files[this.file.UUID]
            }
        }
        this.file = file;
        //Include Ourselfs as a user
        this.file.addUser(this,this.ownObject.uuid);
        //Will load all sprites and not initialize correctly
        //Load Sprite automatically
        this.fn = this.file.data;
        //Re-initiate Object
        this.ownObject.init();        
        forceMenuUpdate = true;
    }
    toJson() {
        return {
            name: this.componentName,
            params: {
                fileUUID: this.file.UUID,
                vals: this.vals.editableVals
            }
        };
    }
}
class gameSprite extends Component {
    constructor({obj={}, src={imageb64:''}, fileUUID=''}) {
        super("gameSprite");
        if(!obj.sprites) {
            debugger;
        }
        obj.sprites.push(this);
        if(fileUUID!=='') {
            this.fileData = engine.files[fileUUID];
            this.fileData.type = ".img";
            this.fileData.addUser(this,obj.uuid);
        }else {
            //Support for Old Loading Images
            this.fileData = addGameFile(src.imageb64,".img");
            this.fileData.addUser(this,obj.uuid);
        }
        this.ownObject = obj;
        console.log(src);
        if(src.imageb64) {
            delete src.imageb64;
        }
        this._src = src;
        this.src = src;
        //engine.assignUUID("Image File");
        this.sprite;
    }
    set src(value) {
        console.log("changed");
        console.warn("the src has been set", value);
        //delete value.imageb64;
        this._src = {...value};
        this._src.imageb64 = undefined;
        if(this.ownObject.sprite) {
            this.reloadImage();
        }
        return this._src;
    }
    get src() {
        return this._src
    }
    MenuEdit(parent) {
        if (!addEditableSprite)
            return;
        let divHolder = createDiv()
        let FileEdit = this.AddFileEdit();
        FileEdit.parent(divHolder);
        let mainDiv = addEditableSprite("Image", (val)=>{
            forceBrowserUpdate = true;
            let actValue = val;
            console.log(val);
            this.src = actValue;
            if(val.imageb64){
                this.loadFile(addGameFile(val.imageb64,'.img'));
            }
            return actValue;
        }
        , ()=>this.fileData.data, parent,[divHolder],divHolder)
    }
    AddFileEdit() {
        let inp = createButton(this.fileData.UUID+this.fileData.type);
        inp.elt.ondrop = (event) => {
            console.log(event);
            console.warn(event.dataTransfer.getData("UUID"));
            let uuid = event.dataTransfer.getData("UUID");
            let file = engine.files[uuid];
            //If file isn't an image return
            if(file.type !== ".img") return;
            //Replace old file with new file;
            this.loadFile(file);
            //Replace old file with new file
        }
        inp.elt.ondragover = (event) => {
            event.preventDefault();
            window.mouseReleased = () =>{}
            //console.warn(event.dataTransfer.getData("UUID"));
        }
        return inp;
    }
    loadFile(file) {
        //Remove Og File
        if(this.fileData.UUID !== file.UUID) {
            delete this.fileData.whoUses[this.ownObject.uuid];
            if(Object.keys(this.fileData.whoUses).length == 0) {
                //If no one uses it delete it
                //alert("empty script");
                delete engine.files[this.fileData.UUID]
            }
        }
        this.fileData = file;
        //Include Ourselfs as a user
        this.fileData.addUser(this,this.ownObject.uuid);
        //Will load all sprites and not initialize correctly
        //Load Sprite automatically
        if(!this.fileData.customData) {
            this.fileData.customData = loadImage("data:image/png;base64," + this.fileData.data.toString());
        }
        this.setSprite(this.fileData.customData);
        forceMenuUpdate = true;
        forceBrowserUpdate = true;
    }
    getSprite() {
        return this.sprite.get(...arguments)
    }
    reloadImage() {
        let _img = this.src;
        console.log(_img);
        //Check if file has already loaded image, then get reference
        if(this.fileData.customData!==undefined) {
            var _sprite = this.fileData.customData;
        }else {
            var _sprite = loadImage("data:image/png;base64," + this.fileData.data.toString());
        }
        this.setSprite(_sprite);
    }
    setSprite(sprite) {
        this.fileData.customData = sprite;
        this.sprite = sprite;
        this.ownObject.sprite = sprite;
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
    constructor(data,UUID,type) {
        super("gameFile");
        this.customData = undefined;
        this.UUID = UUID;
        this.type = type;
        console.warn(data);
        this.data = data.toString();
        engine.files[UUID] = this;
        this.whoUses = {};
    }
    addUser(obj,UUID) {
        this.whoUses[UUID] = obj;
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
function addGameFile(data,type) {
    if(data!=='') {let fileexists = checkifexists(data)
    if(fileexists) {
        return fileexists;
    }
}
    let fUUID = engine.customFileUUID(type);
    console.warn(fUUID);
    fileexists = new gameFile(data,fUUID,type)
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