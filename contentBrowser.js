//Browser Panel Stuff
function readTypeAndName() {
    for(let nameOfFile in ContentBrowserPanel.files) {
        let _file = ContentBrowserPanel.files[nameOfFile];
        let typeOfFile = _file.type;
        console.warn(nameOfFile+typeOfFile);
        if(typeOfFile === ".js") {
            let _get = ()=>{return ContentBrowserPanel.files[nameOfFile].data}
            let set = (value)=>{
                //console.warn(ContentBrowserPanel.files[nameOfFile].whoUses)
                for(let ObjId in _file.whoUses) {
                    let script = _file.whoUses[ObjId];
                    script.fn = value;
                }
            };
            let inp = createButton(nameOfFile+typeOfFile).parent(ContentBrowserPanel.HUD);
            inp.elt.draggable = "true";
            inp.elt.ondragstart = (event)=>{
                event.dataTransfer.setData("UUID",ContentBrowserPanel.files[nameOfFile].UUID);
                console.log(ContentBrowserPanel.files[nameOfFile]);
            }
            inp.mousePressed(() => {
                if(mouseButton === "right") {

                }else {
                    window.mouseReleased = () => {
                        window.mouseReleased = () => {};
                        var popupWindow = window.open("popup.html?text=" + encodeURIComponent(_get().toString()), "Popup Window", "width=400,height=300");
                        window.receivePopupText = (text) => {
                        console.warn(text);
                        _file.data = text;
                        set(text);
                        _get = () => text;
                };}
            }
            });
            inp.size(140,140);
            ContentBrowserPanel.Divs.push(inp);
        }else if(typeOfFile === ".img") {
            let img = createImg("data:image/png;base64,"+_file.data).parent(ContentBrowserPanel.HUD);
            img.elt.draggable = "true";
            img.elt.ondragstart = (event)=>{
                event.dataTransfer.setData("UUID",ContentBrowserPanel.files[nameOfFile].UUID);
                console.log(ContentBrowserPanel.files[nameOfFile]);
            }
            let _get = ()=>{return ContentBrowserPanel.files[nameOfFile].data}
            let set = (value)=>{
                forceBrowserUpdate = true;
                //console.warn(ContentBrowserPanel.files[nameOfFile].whoUses)
                for(let ObjId in _file.whoUses) {
                    let script = _file.whoUses[ObjId];
                    script.src = value;
                }
            };
            img.mousePressed(() => {
                console.log(mouseButton);
                if(mouseButton === "right") {

                }else {
                    window.mouseReleased = () => {
                        this.mouseReleased = ()=>{}
                let popup = window.open('imagePopup.html', '_blank', 'width=400,height=400');
                popup._ImageData = () =>{
                    return _get();
                }    
                window.jsonImage = (text) => {
                    console.warn(text);
                    _file.data = text.imageb64;
                    _get = ()=>{return text};
                    };
                    }
                }
              });
              img.size(140,140);
              ContentBrowserPanel.Divs.push(img);
        }
    }
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
    for(let i of ContentBrowserPanel.Divs) {
        i.remove();
    }
    ContentBrowserPanel.Divs = [];
}