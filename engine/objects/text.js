class Text extends GameObject {
    constructor(x, y, text) {
        super(x, y,"text");
        this.text = text;
        this.clr = 0;
        this.width = textWidth(this.text);
        this.height = 10;
        this.typeId = 3;
    }
    getClassName() {
        return "Text"
    }
    getValues() {
        return [...super.getValues(), this.t];
    }
    getValuesName() {
        return [...super.getValuesName(), "text"]
    }
    getActualValuesName() {
        return [...super.getActualValuesName(), "text"]
    }
    set text(v) {
        this.t = v;
        this.width = textWidth(this.t);
    }
    display() {
        fill(this.clr)
        text(this.t, this.x, this.y);
    }

}