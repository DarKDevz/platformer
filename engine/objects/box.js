class Box extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, "Box");
        this.width = w;
        this.height = h;
        this.clr = 0;
        this.oldX;
        this.oldY;
        this.typeId = 0;
        this.isCollidable = true;
        this.collisionType = 'Rect';
    }
    init() {
        if(!this)return;
        if(!this.height)return;
        if(!this.width)return;
        if(this.width && this.height) {
            //Avoid making double physics body if initializing twice
        if(!this.body) {
        let bodyDef = new b2BodyDef;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0;
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        let hw = this.width/2;
        let hh = this.height/2;
        fixDef.shape.SetAsBox(
            hw //half width
          , hh //half height
       );
        bodyDef.position.x = this.x+hw;
        bodyDef.position.y = this.y+hh;
        this.body = engine.world.CreateBody(bodyDef);
        this.body.SetUserData(this);
        this.fixture = this.body.CreateFixture(fixDef);
        }
        }
    }
    getCollisionVectors() {
    return [this,{x:this.width,y:this.height}]
    }
    getValuesName() {
        return super.getValuesName().concat(["width", "height"]);
    }

    getValues() {
        return super.getValues().concat(this.width, this.height);
    }

    getActualValuesName() {
        return super.getActualValuesName().concat(["width", "height"]);
    }
    draw() {
        fill(this.clr);
        rect(this.x, this.y, this.width, this.height);
    }
    display(OnlyDraw,noDraw = false) {
        if(!noDraw){this.draw()}
        if(!OnlyDraw)this.update();
    }
    collision(obj) {
        let type = obj.collisionType+'Vector'
        let ObjectVectors = obj.getCollisionVectors()
        let collides = HandleCollision('Rect',type,...this.getCollisionVectors(),...ObjectVectors)

        if (collides) {
            this.onCollide(obj);
        }

        return collides;
    }
    customDraw() {
            super.customDraw()
            stroke(0, 0, 255);
            line(this.x + this.width / 2, this.y + this.height / 2, this.x + this.width / 2 - 30, this.y + this.height / 2);
            stroke(255, 0, 0);
            line(this.x + this.width / 2, this.y + this.height / 2, this.x + this.width / 2, this.y + this.height / 2 - 30);
            stroke(0);
        }
    update() {
        this.oldX = this.x;
        this.oldY = this.y;
    }
    onCollide() {}
}