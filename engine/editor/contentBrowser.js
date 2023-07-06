var oldScroll = 0;
function addFile(type,name) {
    //Implement default data of each 
    //later on
    addGameFile('',typ,{name:name})
}
//Browser Panel Stuff
function changeName(_file) {
    let alreadyHasName = _file.references.name;
    alreadyHasName = alreadyHasName?alreadyHasName:_file.UUID
    let newName = prompt("Change file name",alreadyHasName);
    if(newName === null) {
        //Client has escaped
        return;
    }
    //Delete all references
    let file = engine.files[_file.UUID]
    if(getByReference('name',newName)) {
        alert('already used name')
        changeName(file);
    }else {
    file.editReference('name',newName);
    if(newName !== alreadyHasName) {
        forceBrowserUpdate = true;
        forceMenuUpdate = true;
    }
    }
}
function jsFile(file) {
    let typeOfFile = file.type;
    let _file = file;
    let _get = ()=>{return file.data}
    let set = (file)=>{
        for(let ObjId in _file.whoUses) {
            let script = _file.whoUses[ObjId];
            script.loadFile(file);
        }
    };
    let alreadyHasName = _file.references.name;
    let buttonName = alreadyHasName?alreadyHasName:_file.UUID
    buttonName = buttonName+typeOfFile
    let inp = createButton(buttonName).parent(ContentBrowserPanel.HUD);
    inp.elt.draggable = "true";
    inp.elt.ondragstart = (event)=>{
        event.dataTransfer.setData("UUID",file.UUID);
        console.log(file);
        }
    inp.mousePressed(() => {
    if(mouseButton === "right") {
        changeName(_file);
    }else {
    window.mouseReleased = () => {
    window.mouseReleased = () => {};
    var popupWindow = window.open("popup.html", "Popup Window", "width=400,height=300");
    window.scriptData = function(){
        return _get().toString()
    }
    window.receivePopupText = (text) => {
        console.warn(text);
        _file.data = text;
        set(_file);
        _get = () => text;
        };}
    }
    });
    inp.size(140,140);
    ContentBrowserPanel.Divs.push(inp);
}
function imgFile(file) {
    let _file = file;
    let img = createImg(_file.data).parent(ContentBrowserPanel.HUD);
    img.elt.draggable = "true";
    img.elt.ondragstart = (event)=>{
        event.dataTransfer.setData("UUID",_file.UUID);
        console.log(_file);
    }
    let _get = ()=>{return _file.data}
    img.mousePressed(() => {
        console.log(mouseButton);
        if(mouseButton === "right") {
            changeName(_file);
        }else {
            window.mouseReleased = () => {
                this.mouseReleased = ()=>{}
        let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
        popup._ImageData = () =>{
            return _get();
        }    
        window.jsonImage = (text) => {
            console.warn(text);
            forceBrowserUpdate = true;
            //_file.loadFile(addGameFile(val.imageb64,'.img'));
            _file.data = text.imageb64;
            //Remove Sprite definition so it reloads it correctly
            _file.customData = undefined;
            console.log(_file.whoUses);
            for(let uuid in _file.whoUses) {
                let _sprite = _file.whoUses[uuid];
                console.log(_sprite);
                _sprite.loadFile(_file);
                console.log(_sprite);
            }
            _get = ()=>{return text};
            };
            }
        }
      });
    img.size(140,140);
    ContentBrowserPanel.Divs.push(img);
}
function readTypeAndName() {
    for(let nameOfFile in ContentBrowserPanel.files) {
        let _file = ContentBrowserPanel.files[nameOfFile];
        let typeOfFile = _file.type;
        //console.warn(nameOfFile+typeOfFile);
        if(typeOfFile === ".js") {
            jsFile(_file);
        }else if(typeOfFile === ".img") {
            imgFile(_file);
        }
    }
    ContentBrowserPanel.Main.elt.scrollTop = oldScroll;
}
function showEditMenu() {
    
}
function showBrowserPanel() {
    if(ContentBrowserPanel.HUD.elt.style.display === 'none') {
        ContentBrowserPanel.Holder.elt.style.maxHeight = '';
        ContentBrowserPanel.Main.elt.style.maxHeight = windowHeight/4+"px";
        ContentBrowserPanel.HUD.elt.style.display = 'flex';
        ContentBrowserPanel.Holder.position(0,windowHeight-windowHeight/4);
    }else {
        ContentBrowserPanel.HUD.hide();
        ContentBrowserPanel.Holder.position(0,windowHeight-ContentBrowserPanel.Main.child()[0].scrollHeight);
        ContentBrowserPanel.Main.elt.style.maxHeight = ContentBrowserPanel.Main.child()[0].scrollHeight;
        ContentBrowserPanel.Holder.elt.style.height = ContentBrowserPanel.Main.child()[0].scrollHeight;
    }
}
function removeOldContent() {
    oldScroll = ContentBrowserPanel.Main.elt.scrollTop;
    for(let i of ContentBrowserPanel.Divs) {
        i.remove();
    }
    ContentBrowserPanel.Divs = [];
}