var topDiv;
function windowResized() {
    resizeCanvas(topDiv.clientWidth, topDiv.clientHeight);
    //UI Resize
    editor.onResize();
}
function preload() {
    window.loaded = false;
    engine = new Engine();
    player = new Player();
    JsonMap(MapData);
}
function setup() {
    //Initialize Game things
    topDiv = document.getElementById("topDiv")
    let cnv = createCanvas(topDiv.clientWidth, topDiv.clientHeight);
    cnv.parent(document.getElementById("topDiv"))
    noSmooth();
    //Initialize Editor things
    editor.onSetup();
    PanelsInit()
}
function draw() {
    //engine.load();
    if (keyIsDown(17) && keyIsDown(86)) {
        editor.pasteObjects();
    }else {
        pasted = false;
    }
    clear();
    background(150, 230, 240);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //Early Update
    engine.getActiveScene().earlyUpdate(false);
    engine.cameraPos = cameraPos;
    engine.getActiveScene().display(true);
    engine.getActiveScene().customDraw(levelMode);
    //Late Update
    engine.getActiveScene().lateUpdate(false);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //Editor things
    editor.onUpdate()
}
//UtilFunc
function mouseUp() {
    editor.onMouseUp();
}
