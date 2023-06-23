var overUI = window.overUI ? window.overUI: false;
function OpenDialog(MainDiv,OnExit=()=>{},headerText=createDiv("Dialog Window")) {
    let Holder = createDiv()
    let window = createDiv();
    window.parent(Holder);
    window.style("display: flex");
    let ExitButton = createButton("X");
    ExitButton.style("cursor:pointer;")
    ExitButton.mousePressed(()=>{
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
function uiElement(element) {
    element.mouseOver(() => overUI = true);
    element.mouseOut(() => overUI = false);
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
