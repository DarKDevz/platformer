class Text extends GameObject{
	constructor(x,y,text) {
	super(x,y);
	this.text = text;
	this.typeId = 3;
	}
	getValues() {
	return[...super.getValues(),"\"" + this.text + "\""];
	}
	getValuesName() {
	return[...super.getValuesName(),"text"]
	}
	display() {
	text(this.text,this.x,this.y);
	}
	
}