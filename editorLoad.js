var loadInterval;
function changeMapData(data) {
    window.loaded = true;
    MapData.data = data;
}
function doReload() {
    console.error("works");
    preload();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function checkLoad() {
    if(window.loaded) {
        clearInterval(loadInterval);
        engine = new Engine();
        player = new Player();
        JsonMap(MapData);
    }else if(window.editorData) {
        changeMapData(window.editorData)
    }
}
function preload() {
    window.loaded = false;
    clearInterval(loadInterval);
    loadInterval = setInterval(checkLoad,200);
}
function setup() {
    //Initialize Game things
    createCanvas(windowWidth, windowHeight);
    //Remove right click default behaviour
	canvas.oncontextmenu = function (e) {
		e.preventDefault();
	}
    noSmooth();
    
}
var mouseJoint;
function getBodyAtMouse() {
    mousePVec = new b2Vec2(mouseX + engine.cameraPos.x, mouseY + engine.cameraPos.y);
    var aabb = new b2AABB();
    aabb.lowerBound.Set(mouseX + engine.cameraPos.x - 0.001, mouseY + engine.cameraPos.y - 0.001);
    aabb.upperBound.Set(mouseX + engine.cameraPos.x + 0.001, mouseY + engine.cameraPos.y + 0.001);
    
    // Query the world for overlapping shapes.

    selectedBody = null;
    engine.world.QueryAABB(getBodyCB, aabb);
    return selectedBody;
 }

function getBodyCB(fixture) {
    if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
       if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
          selectedBody = fixture.GetBody();
          return false;
       }
    }
    return true;
}
function draw() {
    //Make Sure it's loaded correctly
    if(!window.loaded) return;
    if(!window?.player?.update) return; 
    if(!window?.engine?.getActiveScene) return; 
    clear();
    background(150, 230, 240);
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
    player.update();
    //Early Update
    engine.getActiveScene().earlyUpdate();
    player.camera();
    player.checkCollisions();
    engine.getActiveScene().display();
    engine.getActiveScene().customDraw(false);
    player.display();
    //Late Update
    engine.getActiveScene().lateUpdate();
    if(mouseIsPressed && (!mouseJoint)) {
        var body = getBodyAtMouse();
        if(body) {
           var md = new b2MouseJointDef();
           md.bodyA = engine.world.GetGroundBody();
           md.bodyB = body;
           md.target.Set(mouseX + engine.cameraPos.x, mouseY + engine.cameraPos.y);
           md.collideConnected = true;
           md.maxForce = 300.0 * 10 * body.GetMass();
           mouseJoint = engine.world.CreateJoint(md);
           body.SetAwake(true);
        }
     }
     
     if(mouseJoint) {
        if(mouseIsPressed) {
           mouseJoint.SetTarget(new b2Vec2(mouseX + engine.cameraPos.x, mouseY + engine.cameraPos.y));
        } else {
           engine.world.DestroyJoint(mouseJoint);
           mouseJoint = null;
        }
     }
    /*-------------PLAYER AND LEVEL DRAWING-----------------*/
}
