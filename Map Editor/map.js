let button;
let applyBtn;
let getBtn;
let boxes = [];
let x,y,w,h;
let BoxID;
function addBox(x,y,w,h) {
	boxes.push(new Box(x,y,w,h));
}
function defaultBox() {
	addBox(0,0,50,50);
}
function setup() {
  createCanvas(800,500);
  button = createButton('Add Box');
  button.position(0, 450);
  button.mousePressed(defaultBox);
  applyBtn = createButton('Apply');
  applyBtn.position(150, 450);
  applyBtn.mousePressed(updateValues);
  getBtn = createButton('Get Values');
  getBtn.position(67.5, 450);
  getBtn.mousePressed(getValues);
  x = createInput('');
  y = createInput('');
  w = createInput('');
  h = createInput('');
  addBox(150,250,170,50);
  addBox(350,100,100,50);
  addBox(-1,400,810,32);
  addBox(610,200,60,100);
  addBox(600,300,150,32);
  addBox(600,300,32,100);
}
function draw() {
	clear();
	for(t_box of boxes) {
	t_box.show();
	}
}
function mouseClicked() {
	let found;
	for(t_box_id in boxes) {
	let t_box = boxes[t_box_id];
	if (t_box.pressed() && !found) {
	    t_box.clr = 175;
	    BoxID = t_box_id;
	    found = true;
	}else {
	    t_box.clr = 0;
	}
	}
}
function updateValues() {
	if(!BoxID) return;
	let t_box = boxes[BoxID];
	t_box.x = x.value();
	t_box.y = y.value();
	t_box.w = w.value();
	t_box.h = h.value();
	BoxID = null;
}
function getValues() {
	let t_box = boxes[BoxID];
	x.value(t_box.x);
	y.value(t_box.y);
	w.value(t_box.w);
	h.value(t_box.h);
}