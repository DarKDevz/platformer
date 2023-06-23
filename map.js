function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    //UI Resize
    editor.onResize();
}
function setup() {
    //Initialize Game things
    createCanvas(windowWidth, windowHeight);
    noSmooth();
    engine = new Engine();
    player = new Player();
    //Initialize Editor things
    editor.onSetup();
}
function draw() {
    if (keyIsDown(17) && keyIsDown(86)) {
        editor.pasteObjects();
    }else {
        pasted = false;
    }
    clear();
    background(150, 230, 240);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    if (Playing && !Paused)
        player.update();
    //Early Update
    engine.getActiveScene().earlyUpdate(!Paused);
    if (Playing && !Paused)
        player.camera();
    else
        engine.cameraPos = cameraPos;
    if (Playing && !Paused)
        player.checkCollisions();
    engine.getActiveScene().display(Paused);
    engine.getActiveScene().customDraw(levelMode);
    player.display(Playing);
    //Late Update
    engine.getActiveScene().lateUpdate(!Paused);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    //Editor things
    editor.onUpdate()
}
//UtilFunc
function mouseUp() {
    editor.onMouseUp();
}
