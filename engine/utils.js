var overUI = window.overUI ? window.overUI: false;
function OpenDialog(MainDiv,OnExit=()=>{},headerText=createDiv("Dialog Window")) {
    let Holder = createDiv()
    let window = createDiv();
    window.parent(Holder);
    window.style("display: flex");
    let ExitButton = createButton("X");
    ExitButton.style("cursor:pointer;")
    ExitButton.mousePressed(()=>{
        setTimeout(()=>{overUI = false},500);
        Holder.remove()
        OnExit()
    });
    Holder.style("width:fit-content");
    Holder.style("overflow:auto");
    Holder.style("max-height:"+height/2);
    Holder.style(" background-color: rgba(0, 0, 0, 0.25);")
    ExitButton.parent(window);
    headerText.parent(window);
    MainDiv.parent(Holder)
    let offsets = Holder.size()
    Holder.position((width-offsets.width)/2,(height-offsets.height)/2)
    uiElement(Holder);
}
function safeOverride(obj,name,get,set) {
    if(obj[name]) {
        console.error("Overriding Existing value from location", name)
    }
    obj.__defineGetter__(name,get);
    obj.__defineSetter__(name,set);
}
function Import(obj,location,target=false) {
    if(!target) {
    for(let name of Object.keys(obj)) {
        safeOverride(location,name,()=>{return obj[name]},(_)=>{return obj[name] = _});
    }
    }else {
        if(typeof target === 'string') {
        if(!obj[target]) return;
        safeOverride(location,target,()=>{return obj[target]},(_)=>{return obj[target] = _});
        }else if(target instanceof Array) {
            for(let name of target) {
                if(obj[name]) {
                    safeOverride(location,name,()=>{return obj[name]},(_)=>{return obj[name] = _});
                }
            }
        }
    }
}
function uiElement(element) {
    element.mouseOver(() => overUI = true);
    element.mouseOut(() => overUI = false);
}
function handleShape(body) {

}
function DrawShape(s, pos ,color) {
    //console.log(s.m_type);
    switch (s.m_type) {
        case DrawShape.e_circleShape:
            console.log("It's a circle")
            break;
        case DrawShape.e_edgeShape:
            console.log("It's an edge")
            break;
        case DrawShape.e_polygonShape:
            //console.log("it's a polygon", s.GetVertices(),pos);
            //Translate vertices into real vertices
            let vlist = [];
            for(let vertice of s.GetVertices()) {
                vlist.push(DrawShape.Math.b2Math.MulX(pos,vertice));
            }
            DrawPolygon(vlist);
            break;
    }
}
Import(Box2D.Collision.Shapes.b2Shape,DrawShape);
Import(Box2D.Common,DrawShape,"Math");
function DrawPolygon(vertices) {
    //Figure it out
    beginShape()
    for(let vertice of vertices) {
        vertex(vertice.x, vertice.y)
    }
    endShape()
}
function DrawAll() {
    for (b = engine.world.m_bodyList;
        b; b = b.m_next) {
           xf = b.m_xf;
           for (f = b.GetFixtureList();
           f; f = f.m_next) {
              s = f.GetShape();
              DrawShape(s, xf, color);
           }
        }
}
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            } else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    // Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});
