var player;
class Player {
    constructor() {
        this.pos = createVector(400, -1000);
        this.size = createVector(30, 70);
        this.vel = createVector(0, 0);
        this.old = createVector(0, 0);
        this.cameraPos = this.pos.copy();
        this.godMode = false;
        this.grounded = false;
        this.colliding = false;
        this.collidedId = null;
        this.groundedId = null;
        this.shootingDelay = 300; // Delay between shots in milliseconds
        this.lastShotTime = 0; // Time of the last shot in milliseconds
        this.collisionType = 'Rect';
        this.groundList = [];
        this.playerAABB;
        this.savedX = 0;
        this.collisions = [];
        this.skipNext = false;
        //Enable Running physics
        //world.gravity.y = 5;
    }
    getCollisionVectors() {
        return [this.pos,this.size]
    }
    display(shouldRun = true) {
        if(!shouldRun) return 1;
        fill(125)
        //rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        //if(this.body) DrawAll()
        //DrawShape(this.body.GetFixtureList().GetShape(),this.body.m_xf)
        //this.phySprite.draw();
        //fill(125);
        //rect(this.pos.x, this.pos.x, this.size.x, this.size.y);
        //this.groundDetector.draw();
        //this.SideDetector.draw();
        if(!this.body){
            let bodyDef = new b2BodyDef;
            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0;
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.shape = new b2PolygonShape;
                   fixDef.shape.SetAsBox(
                         this.size.x/2 //half width
                      ,  this.size.y/2 //half height
                   );
            bodyDef.position.x = this.posCenter().x;
            bodyDef.position.y = this.posCenter().y;
            
            //this.body = new p2.Body({mass:0,position:[this.x,-this.y],fixedRotation : true})
            //this.body.addShape(new p2.Box({ width: this.width,height:this.height}));
            this.body = engine.world.CreateBody(bodyDef)
            this.body.CreateFixture(fixDef);
            this.body.SetFixedRotation(true);
            //Continuous Collision Detection
            this.body.SetBullet(true);
            //User data for contact listener
            this.body.SetUserData(this);
            //Custom gravity scale i made
            this.body.gravityScale = new b2Vec2(0,0);
            //PLAYER AABB for collision detection
            this.playerAABB = new b2AABB();
            this.playerAABB.lowerBound.Set(this.pos.x, this.pos.y);
            this.playerAABB.upperBound.Set(this.pos.x + this.size.x, this.pos.y + this.size.y);;
            //We override this so we can use our own physics things
            engine.physics = true;
        }
    }
    update() {
        this.old = this.pos.copy();
        //controlller
        let overui = window['overUI'] !== undefined ? overUI : false;
        let notDoingInput = document.activeElement === document.body || document.activeElement === canvas;
        if(notDoingInput) {
        if (mouseIsPressed && !overui) {
            //console.log(overui)
            this.shootTowards()
        }
        let right,left,up,down;
        right = keyIsDown(68) || keyIsDown(39);
        left = keyIsDown(65) || keyIsDown(37);
        up = keyIsDown(87) || keyIsDown(38);
        down = keyIsDown(16) || keyIsDown(40);
        //Space
        if (up && this.godMode) {
            this.vel.y = -7
        }
        if (up && this.grounded) {
            this.grounded = false;
            this.vel.y = -7;
            //this.phySprite.vel.y = this.vel.y;
        }
        if (left) {
            this.vel.x -= 5;
        }
        if (right) {
            this.vel.x += 5;
        }
        if (left && down) {
            this.vel.x += 3;
        }
        if (right && down) {
            this.vel.x -= 2;
        }
        if (down) {
            let SizeY = this.size.y;
            this.size.y = lerp(this.size.y, 45, .5);
            this.pos.y += SizeY - this.size.y;
        } else if (this.size.y != 70) {
            let SizeY = this.size.y;
            this.size.y = lerp(this.size.y, 70, .5);;
            this.pos.y += SizeY - this.size.y;
         }
    }
        //Y vel
        if (this.grounded) this.vel.y = 0;
        else{this.vel.y += .1}
        this.pos.y += 1 * this.vel.y;
            //if(this.grounded && !this.colliding) this.grounded = false;
            //X vel
        this.vel.x = this.vel.x * .7
        if (this.vel.x < 0.0001 && this.vel.x > 0) this.vel.x = 0;
        else if (this.vel.x > -0.0001 && this.vel.x < 0) this.vel.x = 0;
        this.pos.x += 1 * this.vel.x;
        if (this.pos.y >engine.getActiveScene().maxPos) {
            this.playerDeath();
        }
        if(this.body) {
            this.body.SetLinearVelocity({x:this.vel.x,y:this.vel.y})
            this.body.SetPosition(this.posCenter())
            this.body.GetFixtureList().GetShape().SetAsBox(
                this.size.x/2 //half width
             ,  this.size.y/2 //half height
          );
        }
    }
    playerDeath() {
        this.pos =engine.getActiveScene().pos.copy();
        this.size = createVector(30, 70);
        //this.phySprite.pos = this.posCenter();
        this.vel = createVector(0, 0);
        //this.phySprite.vel = this.vel;
        this.old = createVector(0, 0);
    }
    collision(id) {
        let t_box = engine.getfromUUID(id);
        if (t_box && t_box.isCollidable)
            return t_box.collision(this);
    }
    posCenter() {
        return this.center(this.size, this.pos);
    }
    center(v, v1) {
        let t_v = v.copy().div(2).add(v1);
        return t_v;
    }
    yCollision(id) {
        let t_box = engine.getfromUUID(id);
        let bpos = createVector(t_box.x, t_box.y)
        let bsize = createVector(t_box.width, t_box.height);
        let t_center = this.center(bsize, bpos);
        let pos_center = this.posCenter();
        //Y Collision
        if (pos_center.y < t_center.y) {
            let distance = (this.size.copy().div(2).y + bsize.copy().div(2).y) - (t_center.y - pos_center.y);
            this.pos.y -= distance;
            this.grounded = true;
            this.groundedId = id;
        }
        if (pos_center.y > t_center.y) {
            this.vel.y = 0;
            let distance = (this.size.copy().div(2).y + bsize.copy().div(2).y) + (t_center.y - pos_center.y);
            this.pos.y += distance+1;
        }
    }
    xCollision(id) {
        let t_box = engine.getfromUUID(id);
        let bpos = createVector(t_box.x, t_box.y);
        let bsize = createVector(t_box.width, t_box.height);
        let t_center = this.center(bsize, bpos);
        let pos_center = this.posCenter();
        //X Collision
        if (pos_center.x < t_center.x) {
            this.vel.x = 0;
            let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) - (t_center.x - pos_center.x);
            this.pos.x -= distance+2;
        }
        if (pos_center.x > t_center.x) {
            this.vel.x = 0;
            let distance = (this.size.copy().div(2).x + bsize.copy().div(2).x) + (t_center.x - pos_center.x);
            this.pos.x += distance+2;
        }
    }
    onCollide(id) {
        let t_box = engine.getfromUUID(id);
        if (!t_box) return;
        let bpos = createVector(t_box.oldX, t_box.oldY)
        let bsize = createVector(t_box.width, t_box.height);
        let tcenter = this.center(bsize, bpos);
        let pcenter = this.center(this.size, this.old);
        if (abs(pcenter.x - tcenter.x) > (bsize.x / 2 + this.size.x / 2) - 1) { this.xCollision(id) } else { this.yCollision(id) }
    }
    collisionStart(uuid) {
        this.collisions.push(uuid);
        //this.onCollide(uuid);
    }
    collisionEnd(uuid) {
        let id = this.collisions.indexOf(uuid);
        this.collisions.splice(id,1);
        if(uuid === this.groundedId) {
            this.grounded = false;
        }
        //console.log(this.groundedId,uuid);
    }
    shootTowards() {
        let toMouse = createVector(-(width / 2 - mouseX), -(height / 2 - mouseY));
        const direction = {
            x: cos(toMouse.heading()),
            y: sin(toMouse.heading())
        };
        //console.log(direction)
        const currentTime = Date.now();
        const timeSinceLastShot = currentTime - this.lastShotTime;

        if (timeSinceLastShot >= this.shootingDelay) {
            let bullet = new Bullet(this.posCenter().x, this.posCenter().y, direction.x, direction.y);
           engine.getActiveScene().boxes.push(bullet);
            this.lastShotTime = currentTime;
        }
    }
    foundFixture(fixture) {
        if(!(fixture.GetBody().GetUserData() instanceof Player)) {
            console.log(fixture.GetBody().GetUserData());
        }
    }
    checkCollisions() {
        //Platforming engine strips
        //Away all physics code because
        //It's way too complicated to implement an object that follows that
        for(let uuid of this.groundList) {
            if(this.collision(uuid)) {this.onCollide(uuid);}
            else {
                this.groundList.splice(this.groundList.indexOf(uuid),1)
                if(this.grounded&&this.groundedId===uuid) {
                    this.grounded = false;
                }
            }
        }
        let found = false;
        let groundExists = false;
        let t_box_id;
        let wasColliding = this.grounded;
        if(wasColliding) {
            this.pos.y--;
        }
        for (let box of engine.getActiveScene().boxes) {
            let c = this.collision(box.uuid);
            if (c) {
                this.collidedId = box.uuid;
                this.onCollide(box.uuid);
            }
            if (!found) {
                found = c;
            }
            if (this.grounded && box.uuid == this.groundedId) {
                groundExists = true;
                this.pos.y++;
                this.grounded = this.collision(box.uuid);
                if (this.grounded) this.groundedId = box.uuid;
                this.pos.y--;
            }
        }
        if(wasColliding) {
            this.pos.y++;
        }
        //If ground was deleted
        if(!groundExists) {
            this.grounded = false;
        }
        this.colliding = found;
        return this.colliding;
    }
    camera() {
        let pos = this.posCenter();
        this.cameraPos = createVector(lerp(this.cameraPos.x, pos.x - width / 2, .25), lerp(this.cameraPos.y, pos.y - height / 2, .25));
        resetMatrix();
        engine.cameraPos = this.cameraPos.copy();
        //translate(-this.cameraPos.x, -this.cameraPos.y);

    }
}
