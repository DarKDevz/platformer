class Text extends GameObject{
	constructor(x,y,text) {
	super(x,y);
	this.text = text;
	}
	display() {
	text(this.text,this.x,this.y);
	}
	
}