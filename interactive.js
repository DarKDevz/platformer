class Interactive extends GameObject {
    constructor(x, y, callback = "()=>{}", radius = 5) {
        super(x, y, "interactive");
        this.r = radius;
        this.callback = callback;
        this.components = [];
        this.components.push(new gameScript({ obj: this, fn: callback }));
        this.typeId = 5;
    }
    getValuesName() {
        return [...super.getValuesName(), "noMenu", "radius"];
    }
    getValues() {
        return [...super.getValues(), 0, this.r]
    }
    getActualValuesName() {
        return [...super.getActualValuesName(), "components[0]", "r"]
    }
    getClassName() {
        return "Interactive"
    }
    getComponents(id = "noId") {
        if (id === "noId") return this.components;
        return this.components[id];
    }
    onCollide() {
        eval(this.components[0].fn)
    }
    collision(obj) {
        var oX, oY, oW, oH;
        if (obj.pos !== undefined) {
            oX = obj.pos.x;
            oY = obj.pos.y;
        } else {
            oX = obj.x;
            oY = obj.y;
        }
        if (obj.size !== undefined) {
            oW = obj.size.x;
            oH = obj.size.y;
        } else {
            oW = obj.width;
            oH = obj.height;
        }
        let rect = {
            x: oX,
            y: oY,
            width: oW,
            height: oH,
        }
        let collides = collideCircle(rect, this);
        if (collides && player === obj) this.onCollide();
        return collides;
    }
    display() {
        this.oldX = this.x;
        this.oldY = this.y;
        fill(255, 0, 255);
        //it wants a diameter
        circle(this.x, this.y, this.r * 2);
    }
    customDraw() {
        super.customDraw();
        stroke(0, 0, 255);
        line(this.x, this.y, this.x - this.r, this.y);
        stroke(0, 255, 0);
        line(this.x, this.y, this.x, this.y - this.r);
        stroke(0);
    }
    lateUpdate() {
        this.canBeInteracted = this.collision(player);
    }
}
