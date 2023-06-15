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
    display() {
        this.oldX = this.x;
        this.oldY = this.y;
        fill(this.clr);
        rect(this.x, this.y, this.width, this.height);
        this.update();
    }
    collision(obj) {
        const { x, y, width, height, pos, size } = obj;
        const oX = pos !== undefined ? pos.x : x;
        const oY = pos !== undefined ? pos.y : y;
        const oW = size !== undefined ? size.x : width;
        const oH = size !== undefined ? size.y : height;

        let collides = collide(this, { x: oX, y: oY, width: oW, height: oH });

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
        //	update() {}
    onCollide() {}
}